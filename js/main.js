// Initialize AOS
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations with optimized settings
    AOS.init({
        duration: 1000,
        easing: 'ease-out',
        once: false,
        offset: 100,
        disable: false,
        delay: 0
    });

    // Timeline Items Animation
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        if (index % 2 === 0) {
            item.setAttribute('data-aos', 'fade-right');
        } else {
            item.setAttribute('data-aos', 'fade-left');
        }
        item.setAttribute('data-aos-duration', '1000');
        item.setAttribute('data-aos-offset', '200');
    });

    // Founder Cards Animation
    document.querySelectorAll('.founder-card').forEach((card, index) => {
        card.setAttribute('data-aos', index === 0 ? 'fade-right' : 'fade-left');
        card.setAttribute('data-aos-duration', '1000');
    });

    // Interview Cards Animation
    document.querySelectorAll('.interview-card').forEach((card, index) => {
        if (index === 0) {
            card.setAttribute('data-aos', 'fade-right');
        } else if (index === 1) {
            card.setAttribute('data-aos', 'fade-up');
        } else {
            card.setAttribute('data-aos', 'fade-left');
        }
        card.setAttribute('data-aos-duration', '1000');
    });

    // Quiz Functionality
    function initQuiz() {
        const quizContainer = document.getElementById('quiz');
        if (!quizContainer) return;
        
        const questions = document.querySelectorAll('.quiz-question');
        const prevButton = document.getElementById('prev-question');
        const nextButton = document.getElementById('next-question');
        const submitButton = document.getElementById('submit-quiz');
        const resultsDiv = document.getElementById('quiz-results');
        const resultsText = document.getElementById('results-text');
        const correctAnswersDiv = document.getElementById('correct-answers');
        const restartButton = document.getElementById('restart-quiz');
        
        let currentQuestion = 0;
        
        // Correct answers
        const correctAnswers = {
            q1: 'b', // 1924
            q2: 'b', // Friedrich Lamberti
            q3: 'b', // 1999
            q4: 'b', // Margarethe Lamberti
            q5: 'c'  // 100 Jahre
        };
        
        // Show the first question
        showQuestion(currentQuestion);
        
        // Next button click handler
        nextButton.addEventListener('click', function() {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
                
                prevButton.style.display = 'block';
                
                if (currentQuestion === questions.length - 1) {
                    nextButton.style.display = 'none';
                    submitButton.style.display = 'block';
                }
            }
        });
        
        // Previous button click handler
        prevButton.addEventListener('click', function() {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion(currentQuestion);
                
                if (currentQuestion === 0) {
                    prevButton.style.display = 'none';
                }
                
                if (currentQuestion < questions.length - 1) {
                    nextButton.style.display = 'block';
                    submitButton.style.display = 'none';
                }
            }
        });
        
        // Submit button click handler
        submitButton.addEventListener('click', function() {
            let score = 0;
            let userAnswers = {};
            
            for (let i = 1; i <= questions.length; i++) {
                const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
                if (selectedOption) {
                    userAnswers[`q${i}`] = selectedOption.value;
                    if (selectedOption.value === correctAnswers[`q${i}`]) {
                        score++;
                    }
                }
            }
            
            questions.forEach(question => {
                question.style.display = 'none';
            });
            prevButton.style.display = 'none';
            submitButton.style.display = 'none';
            
            resultsDiv.style.display = 'block';
            
            const percentage = (score / questions.length) * 100;
            let feedback;
            
            if (percentage === 100) {
                feedback = 'Hervorragend! Sie sind ein wahrer Lamberti-Experte!';
            } else if (percentage >= 80) {
                feedback = 'Sehr gut! Sie kennen die Geschichte von Lamberti wirklich gut.';
            } else if (percentage >= 60) {
                feedback = 'Gut gemacht! Sie haben ein solides Wissen über Lamberti.';
            } else if (percentage >= 40) {
                feedback = 'Nicht schlecht! Es gibt noch einiges über Lamberti zu entdecken.';
            } else {
                feedback = 'Vielleicht sollten Sie unsere Geschichtsseite noch einmal besuchen?';
            }
            
            resultsText.innerHTML = `Sie haben ${score} von ${questions.length} Fragen richtig beantwortet (${percentage}%).<br>${feedback}`;
            
            correctAnswersDiv.innerHTML = '<h5>Die richtigen Antworten:</h5><ul>' +
                '<li>Frage 1: 1924</li>' +
                '<li>Frage 2: Friedrich Lamberti</li>' +
                '<li>Frage 3: 1999</li>' +
                '<li>Frage 4: Margarethe Lamberti</li>' +
                '<li>Frage 5: 100 Jahre</li>' +
                '</ul>';
        });
        
        // Restart button click handler
        restartButton.addEventListener('click', function() {
            currentQuestion = 0;
            
            document.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.checked = false;
            });
            
            resultsDiv.style.display = 'none';
            
            showQuestion(currentQuestion);
            nextButton.style.display = 'block';
            prevButton.style.display = 'none';
        });
        
        // Function to show a specific question
        function showQuestion(questionIndex) {
            questions.forEach((question, index) => {
                question.style.display = index === questionIndex ? 'block' : 'none';
            });
        }
    }

    // Initialize Quiz
    initQuiz();
});

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 1000,
        easing: 'ease-out',
        once: true,
        offset: 100,
        disable: false
    });

    // Timeline Items Animation
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        if (index % 2 === 0) {
            item.setAttribute('data-aos', 'fade-right');
        } else {
            item.setAttribute('data-aos', 'fade-left');
        }
    });

    // Founder Cards Animation
    document.querySelectorAll('.founder-card').forEach((card, index) => {
        card.setAttribute('data-aos', index === 0 ? 'fade-right' : 'fade-left');
    });

    // Interview Cards Animation
    document.querySelectorAll('.interview-card').forEach((card, index) => {
        if (index === 0) {
            card.setAttribute('data-aos', 'fade-right');
        } else if (index === 1) {
            card.setAttribute('data-aos', 'fade-up');
        } else {
            card.setAttribute('data-aos', 'fade-left');
        }
    });

    // Refresh AOS
    setTimeout(() => {
        AOS.refresh();
    }, 500);

    // Karten-Animation wiederherstellen (vorher entfernt)
    document.querySelectorAll('.founder-card, .interview-card').forEach(card => {
        // Remove any inline styles that might interfere with animations
        card.style.removeProperty('opacity');
        card.style.removeProperty('transform');
        
        // Explizit opacity und transform setzen für Karten-Animation
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';
        
        // Set AOS attributes for slide animations
        if (card.classList.contains('founder-card')) {
            card.setAttribute('data-aos', 'fade-right');
            card.setAttribute('data-aos-duration', '800');
            card.setAttribute('data-aos-offset', '100');
        } else {
            card.setAttribute('data-aos', 'fade-left');
            card.setAttribute('data-aos-duration', '800');
            card.setAttribute('data-aos-offset', '100');
        }
    });
    
    // Configure timeline items for animation
    const timelineItemsToAnimate = document.querySelectorAll('.timeline-item');
    timelineItemsToAnimate.forEach((item, index) => {
        item.classList.remove('item-visible'); // Remove any forced visibility
        item.style.removeProperty('opacity');
        item.style.removeProperty('transform');
        
        // Set custom animation attributes
        item.setAttribute('data-aos', 'slide-up');
        item.setAttribute('data-aos-duration', '800');
        item.setAttribute('data-aos-delay', (index * 100).toString());
        item.setAttribute('data-aos-offset', '150');
        
        // Add additional attributes for better performance
        item.setAttribute('data-aos-anchor-placement', 'top-bottom');
    });

    // Show timeline items with animation
    setTimeout(() => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            // Ensure the correct animation type is set
            item.setAttribute('data-aos', 'slide-up');
            item.setAttribute('data-aos-delay', (index * 100).toString());
            
            // Force AOS to update and recognize the elements
            AOS.refresh();
        });
        
        // Update timeline vertical line
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer) {
            const timelineHeight = timelineContainer.offsetHeight * 0.8;
            timelineContainer.style.setProperty('--timeline-height', timelineHeight + 'px');
        }
    }, 100);

    // Timeline Animation
    const timeline = document.querySelector('.timeline-container');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timeline && timelineItems.length > 0) {
        // Set initial timeline height
        timeline.style.setProperty('--timeline-height', '0%');
        
        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        }
        
        // Function to update timeline
        function updateTimeline() {
            let visibleItems = 0;
            timelineItems.forEach((item, index) => {
                if (isInViewport(item)) {
                    visibleItems = index + 1;
                }
            });
            
            const height = (visibleItems / timelineItems.length) * 100;
            timeline.style.setProperty('--timeline-height', `${height}%`);
        }
        
        // Update on scroll
        window.addEventListener('scroll', updateTimeline);
        // Initial update
        updateTimeline();
    }

    // Smooth Scrolling für Anker-Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Background-Änderung beim Scrollen
    const navbar = document.querySelector('.navbar');
    function updateNavbarBackground() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }
    
    window.addEventListener('scroll', updateNavbarBackground);
    updateNavbarBackground(); // Initial ausführen

    // Aktiviere Bootstrap Tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    // Initialisierung der Erinnerungs-Funktionen
    initMemories();

    // Initialisierung des Bild-Modals
    initImageModal();

    // Update timeline line height initially
    const timelineContainer = document.querySelector('.timeline-container');
    if (timelineContainer) {
        const timelineHeight = timelineContainer.offsetHeight * 0.8;
        timelineContainer.style.setProperty('--timeline-height', timelineHeight + 'px');
    }
});

// Memory Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const memoryForm = document.getElementById('memory-form');
    if (!memoryForm) return; // Exit if not on a page with memory form
    
    const memoryList = document.getElementById('memory-list');
    const memorySaved = document.getElementById('memory-saved');
    const memoryDisplay = document.getElementById('memory-display');
    
    // Load saved memories from localStorage
    loadMemories();
    
    // Form submit handler
    memoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('memory-name').value;
        const year = document.getElementById('memory-year').value;
        const text = document.getElementById('memory-text').value;
        const imageInput = document.getElementById('memory-image');
        
        // Create a new memory object
        const memory = {
            name: name,
            year: year,
            text: text,
            date: new Date().toLocaleDateString(),
            image: null
        };
        
        // Handle image upload if present
        if (imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(event) {
                memory.image = event.target.result;
                saveMemory(memory);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            saveMemory(memory);
        }
        
        // Reset form
        memoryForm.reset();
        
        // Show success message
        memorySaved.style.display = 'block';
        setTimeout(function() {
            memorySaved.style.display = 'none';
        }, 3000);
    });
    
    // Function to save memory to localStorage
    function saveMemory(memory) {
        // Get existing memories or initialize empty array
        const memories = JSON.parse(localStorage.getItem('lambertiMemories')) || [];
        
        // Add new memory
        memories.push(memory);
        
        // Save back to localStorage
        localStorage.setItem('lambertiMemories', JSON.stringify(memories));
        
        // Display memories
        loadMemories();
    }
    
    // Function to load and display memories from localStorage
    function loadMemories() {
        const memories = JSON.parse(localStorage.getItem('lambertiMemories')) || [];
        
        // Show/hide memories section based on if there are any
        if (memories.length > 0) {
            memoryDisplay.style.display = 'block';
            
            // Clear and rebuild the memory list
            memoryList.innerHTML = '';
            
            memories.forEach(function(memory, index) {
                const memoryItem = document.createElement('div');
                memoryItem.className = 'memory-item';
                
                const header = document.createElement('div');
                header.className = 'memory-header';
                header.innerHTML = `<strong>${memory.name}</strong><span>${memory.year} | ${memory.date}</span>`;
                
                const content = document.createElement('div');
                content.className = 'memory-content';
                content.textContent = memory.text;
                
                memoryItem.appendChild(header);
                memoryItem.appendChild(content);
                
                // Add image if exists
                if (memory.image) {
                    const imageDiv = document.createElement('div');
                    imageDiv.className = 'memory-image';
                    
                    const img = document.createElement('img');
                    img.src = memory.image;
                    img.className = 'img-fluid';
                    img.alt = `Erinnerungsbild von ${memory.name}`;
                    
                    imageDiv.appendChild(img);
                    memoryItem.appendChild(imageDiv);
                }
                
                memoryList.appendChild(memoryItem);
            });
        } else {
            memoryDisplay.style.display = 'none';
        }
    }
});

// Image Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the modal and its elements
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('imageCaption');
    const closeBtn = document.querySelector('.image-modal-close');
    
    // Find all timeline images
    const timelineImages = document.querySelectorAll('.timeline-image img');
    
    // Add click event to all timeline images
    timelineImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            modal.style.display = 'flex';
            modalImg.src = this.src;
            modalCaption.textContent = this.alt;
            
            // Prevent scrolling on body when modal is open
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close the modal when clicking the close button
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close the modal when clicking outside the image
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close the modal when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Remove Locomotive Scroll initialization and related code
document.addEventListener('DOMContentLoaded', function() {
    // Standard scroll behavior for all elements
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    // Remove data-scroll attributes
    document.body.removeAttribute('data-scroll-container');
    document.querySelectorAll('[data-scroll], [data-scroll-section]').forEach(el => {
        el.removeAttribute('data-scroll');
        el.removeAttribute('data-scroll-section');
        el.removeAttribute('data-scroll-speed');
        el.removeAttribute('data-scroll-position');
    });

    // Ensure smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Liquid Cursor Effect
document.addEventListener('DOMContentLoaded', function() {
    // Disable cursor effect for better usability
    // This code is commented out to prevent cursor issues
    /*
    // Create cursor elements
    const cursorContainer = document.createElement('div');
    cursorContainer.className = 'cursor-container';
    document.body.appendChild(cursorContainer);

    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursorContainer.appendChild(cursor);

    // Create canvas for liquid effect
    const canvas = document.createElement('canvas');
    canvas.id = 'liquid-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Liquid simulation parameters
    const particles = [];
    const particleCount = 20;
    const maxTrailLength = 20;
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: 0,
            y: 0,
            trail: [],
            speed: 0.1 + Math.random() * 0.2,
            delay: i * 2
        });
    }

    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update cursor position
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;

        // Add active class on movement
        cursor.classList.add('active');
        setTimeout(() => cursor.classList.remove('active'), 100);
    });

    // Animation loop
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate mouse velocity
        const velocityX = mouseX - lastMouseX;
        const velocityY = mouseY - lastMouseY;
        const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

        // Update particles
        particles.forEach(particle => {
            // Update particle position with delay
            const targetX = mouseX;
            const targetY = mouseY;
            
            particle.x += (targetX - particle.x) * particle.speed;
            particle.y += (targetY - particle.y) * particle.speed;

            // Update trail
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > maxTrailLength) {
                particle.trail.shift();
            }

            // Draw liquid effect
            if (particle.trail.length > 2) {
                ctx.beginPath();
                ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
                
                // Create smooth curve through trail points
                for (let i = 1; i < particle.trail.length - 2; i++) {
                    const xc = (particle.trail[i].x + particle.trail[i + 1].x) / 2;
                    const yc = (particle.trail[i].y + particle.trail[i + 1].y) / 2;
                    ctx.quadraticCurveTo(particle.trail[i].x, particle.trail[i].y, xc, yc);
                }

                // Connect to the last two points
                ctx.quadraticCurveTo(
                    particle.trail[particle.trail.length - 2].x,
                    particle.trail[particle.trail.length - 2].y,
                    particle.trail[particle.trail.length - 1].x,
                    particle.trail[particle.trail.length - 1].y
                );

                // Style the path
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (velocity / 20)})`;
                ctx.lineWidth = 2 * (velocity / 20);
                ctx.stroke();
            }
        });

        // Update last mouse position
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        // Continue animation loop
        requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Hide default cursor
    document.body.style.cursor = 'none';

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .timeline-image, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });
    */
}); 