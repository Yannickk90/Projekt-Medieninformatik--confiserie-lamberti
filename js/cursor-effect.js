// Cursor Distortion Effect using Three.js
class CursorDistortion {
    constructor() {
        this.container = document.querySelector('.cursor-container');
        this.mouse = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        this.ease = 0.1;
        this.radius = 60; // Reduced size of the distortion area
        
        this.init();
    }

    init() {
        // Create Three.js scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.OrthographicCamera(
            -window.innerWidth / 2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            -window.innerHeight / 2,
            1,
            1000
        );
        this.camera.position.z = 1;

        // Create renderer with transparency
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true,
            premultipliedAlpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Create plane geometry
        this.geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

        // Create shader material
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2() },
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                uTexture: { value: null },
                uRadius: { value: this.radius }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec2 uMouse;
                uniform vec2 uResolution;
                uniform sampler2D uTexture;
                uniform float uRadius;
                varying vec2 vUv;

                void main() {
                    vec2 uv = vUv;
                    vec2 mouse = uMouse / uResolution;
                    
                    // Calculate distance from cursor
                    float dist = distance(uv, mouse);
                    
                    // Create smoother falloff for distortion
                    float falloff = 1.0 - smoothstep(0.0, uRadius / uResolution.x, dist);
                    falloff = pow(falloff, 2.0); // Sharper falloff
                    
                    // Create subtle swirling effect
                    float angle = atan(uv.y - mouse.y, uv.x - mouse.x);
                    float swirl = falloff * 0.015; // Very subtle distortion
                    
                    // Apply distortion
                    vec2 offset = vec2(
                        cos(angle - uTime) * swirl,
                        sin(angle - uTime) * swirl
                    );
                    
                    // Sample texture with distortion
                    vec4 color = texture2D(uTexture, uv + offset);
                    
                    // Make the effect completely transparent outside the radius
                    gl_FragColor = vec4(color.rgb, falloff * 0.3); // Reduced opacity
                }
            `
        });

        // Create mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        // Load texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load('images/backgrounds/chocolate-liquid.jpg', (texture) => {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            this.material.uniforms.uTexture.value = texture;
            this.animate();
        });

        // Event listeners
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
    }

    onMouseMove(event) {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
    }

    onResize() {
        // Update camera
        this.camera.left = -window.innerWidth / 2;
        this.camera.right = window.innerWidth / 2;
        this.camera.top = window.innerHeight / 2;
        this.camera.bottom = -window.innerHeight / 2;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Update geometry
        this.geometry.dispose();
        this.geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
        this.mesh.geometry = this.geometry;

        // Update uniforms
        this.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Update mouse position with easing
        this.target.x = this.mouse.x;
        this.target.y = this.mouse.y;
        this.material.uniforms.uMouse.value.x += (this.target.x - this.material.uniforms.uMouse.value.x) * this.ease;
        this.material.uniforms.uMouse.value.y += (this.target.y - this.material.uniforms.uMouse.value.y) * this.ease;

        // Update time
        this.material.uniforms.uTime.value += 0.01;

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the effect when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CursorDistortion();
}); 