// Initialize AOS (Animate On Scroll) with reduced effects
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations with reduced settings for better compatibility with Locomotive
    AOS.init({
        duration: 600,
        easing: 'ease-out',
        once: true, // Changed to true - elements should only animate once
        mirror: false,
        anchorPlacement: 'top-bottom',
        offset: 80, // Reduced offset for earlier animation
        delay: 50, // Reduced delay
        disable: 'mobile' // Disable on mobile for better performance
    });
    
    // Force reveal founder and interview cards immediately
    document.querySelectorAll('.founder-card, .interview-card').forEach(card => {
        card.classList.add('aos-animate');
        card.style.opacity = '1';
        card.style.transform = 'none';
    });
    
    // Show all timeline items initially with a small delay
    setTimeout(() => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('item-visible');
            }, index * 150); // Stagger the appearance slightly
        });
        
        // Update timeline vertical line
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer) {
            const timelineHeight = timelineContainer.offsetHeight * 0.8;
            timelineContainer.style.setProperty('--timeline-height', timelineHeight + 'px');
        }
    }, 200);

    // Timeline-Animation
    const timeline = document.querySelector('.timeline-container');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timeline && timelineItems.length > 0) {
        // Speichern, welche Items bereits sichtbar wurden
        const visibleItems = new Array(timelineItems.length).fill(false);
        
        // Funktion zum Aktualisieren der Timeline-Linie
        function updateTimeline() {
            // Prüfen, ob Timeline-Container im Viewport ist
            const timelineRect = timeline.getBoundingClientRect();
            if (timelineRect.top > window.innerHeight || timelineRect.bottom < 0) {
                return; // Timeline nicht im Viewport
            }
            
            // Viewport-Höhe für Sichtbarkeitsberechnung
            const viewportHeight = window.innerHeight;
            
            // Zählen, wie viele Items sichtbar sind
            let lastVisibleIndex = -1;
            
            // Items überprüfen und animieren
            timelineItems.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                // Item ist sichtbar, wenn es mindestens 1/3 sichtbar im Viewport ist
                const visibilityThreshold = 0.3;
                const itemTop = itemRect.top;
                const itemVisible = itemTop < viewportHeight * (1 - visibilityThreshold) && 
                                   itemTop + itemRect.height * visibilityThreshold > 0;
                
                if (itemVisible) {
                    if (!visibleItems[index]) {
                        // Item wird erstmals sichtbar
                        visibleItems[index] = true;
                        item.classList.add('item-visible');
                        
                        // Scroll-Verzögerung für die Animation
                        setTimeout(() => {
                            // Timeline-Linie aktualisieren
                            updateLineHeight();
                        }, 50);
                    }
                    
                    // Merken des letzten sichtbaren Items
                    lastVisibleIndex = index;
                }
            });
            
            // Hilfsfunktion zum Aktualisieren der Linienhöhe
            function updateLineHeight() {
                if (lastVisibleIndex >= 0) {
                    // Die Linie wächst schrittweise mit jedem sichtbaren Item
                    const lineHeight = (lastVisibleIndex + 1) / timelineItems.length * 100;
                    timeline.style.setProperty('--line-height', `${lineHeight}%`);
                } else {
                    timeline.style.setProperty('--line-height', '0%');
                }
            }
        }
        
        // Anpassung für die Timeline-Linie mit CSS-Variable
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .timeline-container::before {
                height: var(--line-height, 0%) !important;
            }
        `;
        document.head.appendChild(styleSheet);
        
        // Event-Listener für das Scrollen
        window.addEventListener('scroll', updateTimeline);
        window.addEventListener('resize', updateTimeline);
        
        // Initial ausführen
        setTimeout(updateTimeline, 100);
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

    // Initialisierung des Quiz
    initQuiz();

    // Initialisierung der Erinnerungs-Funktionen
    initMemories();

    // Initialisierung des Bild-Modals
    initImageModal();
});

// Quiz Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Quiz elements
    const quizContainer = document.getElementById('quiz');
    if (!quizContainer) return; // Exit if not on a page with quiz
    
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
            
            // Show previous button if not on first question
            prevButton.style.display = 'block';
            
            // Show submit button on last question, hide next button
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
            
            // Hide previous button if on first question
            if (currentQuestion === 0) {
                prevButton.style.display = 'none';
            }
            
            // Show next button, hide submit button if not on last question
            if (currentQuestion < questions.length - 1) {
                nextButton.style.display = 'block';
                submitButton.style.display = 'none';
            }
        }
    });
    
    // Submit button click handler
    submitButton.addEventListener('click', function() {
        // Calculate score
        let score = 0;
        let userAnswers = {};
        
        // Get user's answers
        for (let i = 1; i <= questions.length; i++) {
            const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
            if (selectedOption) {
                userAnswers[`q${i}`] = selectedOption.value;
                if (selectedOption.value === correctAnswers[`q${i}`]) {
                    score++;
                }
            }
        }
        
        // Hide questions and show results
        questions.forEach(question => {
            question.style.display = 'none';
        });
        prevButton.style.display = 'none';
        submitButton.style.display = 'none';
        
        // Show results
        resultsDiv.style.display = 'block';
        
        // Display score and feedback
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
        
        // Show correct answers
        correctAnswersDiv.innerHTML = '<h5>Die richtigen Antworten:</h5><ul>';
        correctAnswersDiv.innerHTML += '<li>Frage 1: 1924</li>';
        correctAnswersDiv.innerHTML += '<li>Frage 2: Friedrich Lamberti</li>';
        correctAnswersDiv.innerHTML += '<li>Frage 3: 1999</li>';
        correctAnswersDiv.innerHTML += '<li>Frage 4: Margarethe Lamberti</li>';
        correctAnswersDiv.innerHTML += '<li>Frage 5: 100 Jahre</li>';
        correctAnswersDiv.innerHTML += '</ul>';
    });
    
    // Restart button click handler
    restartButton.addEventListener('click', function() {
        // Reset to first question
        currentQuestion = 0;
        
        // Clear selected options
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Hide results
        resultsDiv.style.display = 'none';
        
        // Show first question and next button
        showQuestion(currentQuestion);
        nextButton.style.display = 'block';
        prevButton.style.display = 'none';
    });
    
    // Function to show a specific question
    function showQuestion(questionIndex) {
        questions.forEach((question, index) => {
            if (index === questionIndex) {
                question.style.display = 'block';
            } else {
                question.style.display = 'none';
            }
        });
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

// Initialize Locomotive Scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    smoothMobile: false,
    multiplier: 0.7,
    lerp: 0.05,
    getDirection: true,
    inertia: 0.5,
    getSpeed: true,
    class: 'is-inview',
});

// Refresh Locomotive Scroll when all images are loaded
window.addEventListener('load', () => {
    scroll.update();
});

// Add data attributes for parallax effects to background elements
document.querySelectorAll('.parallax-bg').forEach((bg, index) => {
    bg.setAttribute('data-scroll', '');
    bg.setAttribute('data-scroll-speed', '-3');
    bg.setAttribute('data-scroll-position', 'top');
    bg.setAttribute('data-scroll-direction', 'vertical');
});

// Add data scroll attributes to section containers for smooth transitions
document.querySelectorAll('section').forEach((section) => {
    section.setAttribute('data-scroll-section', '');
});

// Set up content elements with reveal animation
document.querySelectorAll('.parallax-content, .section-title, .section-subtitle').forEach((el) => {
    el.setAttribute('data-scroll', '');
    el.setAttribute('data-scroll-speed', '1');
    el.setAttribute('data-scroll-delay', '0.05');
});

// Add data-scroll attributes to timeline elements for better tracking
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.setAttribute('data-scroll', '');
    item.setAttribute('data-scroll-class', 'item-visible');
    item.setAttribute('data-scroll-offset', '20%');
    item.setAttribute('data-scroll-repeat', 'false');
    item.setAttribute('data-scroll-call', 'timelineVisible');
});

// Make sure the timeline container is tracked
if (document.querySelector('.timeline-container')) {
    const timelineContainerElement = document.querySelector('.timeline-container');
    timelineContainerElement.setAttribute('data-scroll', '');
    timelineContainerElement.setAttribute('data-scroll-offset', '10%');
    timelineContainerElement.setAttribute('data-scroll-repeat', 'false');
}

// Timeline animation
let timelineItems = document.querySelectorAll('.timeline-item');
let timelineContainer = document.querySelector('.timeline-container');

if (timelineContainer) {
    // Modify the viewport detection for Locomotive Scroll
    const isInViewport = function(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
            rect.bottom >= 100
        );
    };
    
    // Function to animate timeline items
    const animateTimelineItems = function() {
        let anyVisible = false;
        timelineItems.forEach(function(item, index) {
            if (isInViewport(item)) {
                anyVisible = true;
                item.classList.add('item-visible');
                
                // Maintain a minimum height for the timeline
                let totalHeight = Math.max(
                    item.offsetTop + item.offsetHeight - 40,
                    timelineContainer.offsetHeight * 0.2
                );
                
                timelineContainer.style.setProperty('--timeline-height', totalHeight + 'px');
            }
        });
        
        // If no items are visible but we have items, show the first one
        if (!anyVisible && timelineItems.length > 0) {
            timelineItems[0].classList.add('item-visible');
            let totalHeight = timelineItems[0].offsetHeight;
            timelineContainer.style.setProperty('--timeline-height', totalHeight + 'px');
        }
    };
    
    // Initial animation immediately and after a delay
    animateTimelineItems();
    setTimeout(animateTimelineItems, 500);
    setTimeout(animateTimelineItems, 1000);
    
    // Update on scroll events from Locomotive
    scroll.on('scroll', function() {
        animateTimelineItems();
    });
    
    // Force animation update after Locomotive updates
    scroll.on('call', function(value, way, obj) {
        if (way === 'enter') {
            animateTimelineItems();
        }
    });
    
    // Regular scroll backup for non-smooth scroll devices
    document.addEventListener('scroll', function() {
        animateTimelineItems();
    });
    
    // Update when Locomotive Scroll updates
    scroll.on('update', animateTimelineItems);
}

// Image Modal
const images = document.querySelectorAll('.timeline-image img, .gallery-item img');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const captionText = document.getElementById('imageCaption');
const closeBtn = document.querySelector('.image-modal-close');

if (modal && modalImg && closeBtn) {
    images.forEach(img => {
        img.onclick = function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            
            // Get caption if available
            let caption = this.alt;
            let parentFigcaption = this.parentElement.querySelector('figcaption');
            
            if (parentFigcaption) {
                caption = parentFigcaption.innerText;
            }
            
            captionText.innerHTML = caption;
            
            // Prevent body scrolling
            document.body.style.overflow = "hidden";
        }
    });
    
    // Close the modal
    closeBtn.onclick = function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
    
    // Also close when clicking outside the image
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
    
    // Close with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
}

// Quiz functionality
const quizElement = document.getElementById('quiz');

if (quizElement) {
    const questions = document.querySelectorAll('.quiz-question');
    const prevBtn = document.getElementById('prev-question');
    const nextBtn = document.getElementById('next-question');
    const submitBtn = document.getElementById('submit-quiz');
    const resultsDiv = document.getElementById('quiz-results');
    const resultsText = document.getElementById('results-text');
    const correctAnswersDiv = document.getElementById('correct-answers');
    const restartBtn = document.getElementById('restart-quiz');
    
    let currentQuestion = 0;
    
    // Show first question initially
    updateQuestionDisplay();
    
    // Event listeners for navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentQuestion++;
            updateQuestionDisplay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentQuestion--;
            updateQuestionDisplay();
        });
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', showResults);
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', restartQuiz);
    }
    
    function updateQuestionDisplay() {
        questions.forEach((question, index) => {
            if (index === currentQuestion) {
                question.style.display = 'block';
            } else {
                question.style.display = 'none';
            }
        });
        
        // Update button visibility
        if (prevBtn) {
            prevBtn.style.display = currentQuestion > 0 ? 'inline-block' : 'none';
        }
        
        if (nextBtn && submitBtn) {
            if (currentQuestion === questions.length - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'inline-block';
            } else {
                nextBtn.style.display = 'inline-block';
                submitBtn.style.display = 'none';
            }
        }
    }
    
    function showResults() {
        // Check answers
        const correctAnswers = ['b', 'b', 'b', 'b', 'c']; // Correct answers for each question
        let score = 0;
        let userAnswers = [];
        
        for (let i = 0; i < questions.length; i++) {
            const selectedOption = document.querySelector(`input[name="q${i+1}"]:checked`);
            if (selectedOption) {
                userAnswers.push({
                    question: i+1,
                    selected: selectedOption.value,
                    correct: selectedOption.value === correctAnswers[i]
                });
                
                if (selectedOption.value === correctAnswers[i]) {
                    score++;
                }
            } else {
                userAnswers.push({
                    question: i+1,
                    selected: null,
                    correct: false
                });
            }
        }
        
        // Hide questions, show results
        questions.forEach(question => {
            question.style.display = 'none';
        });
        
        if (prevBtn && nextBtn && submitBtn) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'none';
        }
        
        if (resultsDiv && resultsText && correctAnswersDiv) {
            resultsDiv.style.display = 'block';
            
            // Display score
            const percentage = Math.round((score / questions.length) * 100);
            resultsText.innerHTML = `Sie haben ${score} von ${questions.length} Fragen richtig beantwortet (${percentage}%).`;
            
            // Display correct answers
            let answersHTML = '';
            userAnswers.forEach(answer => {
                const icon = answer.correct ? '✓' : '✗';
                const color = answer.correct ? 'green' : 'red';
                
                answersHTML += `<p style="color: ${color};">${icon} Frage ${answer.question}: ${answer.selected ? (answer.correct ? 'Richtig' : 'Falsch') : 'Nicht beantwortet'}</p>`;
            });
            
            correctAnswersDiv.innerHTML = answersHTML;
        }
    }
    
    function restartQuiz() {
        // Reset all selections
        const radioInputs = document.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            input.checked = false;
        });
        
        // Reset to first question
        currentQuestion = 0;
        
        // Hide results, show first question
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
        }
        
        updateQuestionDisplay();
    }
}

// Memory functionality
const memoryForm = document.getElementById('memory-form');
const memorySavedAlert = document.getElementById('memory-saved');
const memoryDisplay = document.getElementById('memory-display');
const memoryList = document.getElementById('memory-list');

if (memoryForm && memorySavedAlert && memoryDisplay && memoryList) {
    // Load existing memories
    loadMemories();
    
    memoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('memory-name');
        const yearInput = document.getElementById('memory-year');
        const textInput = document.getElementById('memory-text');
        const imageInput = document.getElementById('memory-image');
        
        // Get form values
        const name = nameInput.value;
        const year = yearInput.value;
        const text = textInput.value;
        
        // Create memory object
        let memory = {
            name: name,
            year: year,
            text: text,
            date: new Date().toLocaleDateString('de-DE')
        };
        
        // Handle image if provided
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                memory.image = e.target.result;
                saveMemory(memory);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            saveMemory(memory);
        }
        
        // Reset form
        memoryForm.reset();
        
        // Show success message
        memorySavedAlert.style.display = 'block';
        setTimeout(function() {
            memorySavedAlert.style.display = 'none';
        }, 3000);
    });
    
    function saveMemory(memory) {
        // Get existing memories from localStorage
        let memories = JSON.parse(localStorage.getItem('lambertierinnerungen')) || [];
        
        // Add new memory
        memories.push(memory);
        
        // Save to localStorage
        localStorage.setItem('lambertierinnerungen', JSON.stringify(memories));
        
        // Update display
        loadMemories();
    }
    
    function loadMemories() {
        // Get memories from localStorage
        let memories = JSON.parse(localStorage.getItem('lambertierinnerungen')) || [];
        
        // Show/hide memories display
        if (memories.length > 0) {
            memoryDisplay.style.display = 'block';
            
            // Generate HTML for memories
            let html = '';
            memories.forEach(function(memory) {
                html += `
                    <div class="memory-item">
                        <div class="memory-header">
                            <span>${memory.name}</span>
                            <span>${memory.year} • ${memory.date}</span>
                        </div>
                        <div class="memory-content">${memory.text}</div>
                        ${memory.image ? `
                            <div class="memory-image">
                                <img src="${memory.image}" alt="Erinnerung von ${memory.name}" class="img-fluid rounded">
                            </div>
                        ` : ''}
                    </div>
                `;
            });
            
            memoryList.innerHTML = html;
        } else {
            memoryDisplay.style.display = 'none';
        }
    }
}

// Call Locomotive Scroll update on any resize event
window.addEventListener('resize', () => {
    scroll.update();
});

// Re-init Locomotive Scroll after all dynamic content is loaded
setTimeout(() => {
    scroll.update();
}, 1000);

// Additional update to ensure smooth transitions after all content loads
window.addEventListener('DOMContentLoaded', () => {
    // Initial update
    setTimeout(() => {
        scroll.update();
    }, 500);
    
    // Secondary update after images likely loaded
    setTimeout(() => {
        scroll.update();
    }, 2000);
});

// Force timeline update after everything loads
window.addEventListener('load', () => {
    const timeline = document.querySelector('.timeline-container');
    if (timeline) {
        // Make sure at least the first item is visible
        const firstItem = document.querySelector('.timeline-item');
        if (firstItem) {
            firstItem.classList.add('item-visible');
            
            // Set timeline height based on the first visible item
            const initialHeight = Math.max(firstItem.offsetHeight, timeline.offsetHeight * 0.3);
            timeline.style.setProperty('--timeline-height', initialHeight + 'px');
            
            // Force all items to check visibility
            document.querySelectorAll('.timeline-item').forEach(item => {
                const rect = item.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.9 && rect.bottom >= 100) {
                    item.classList.add('item-visible');
                }
            });
        }
    }
    
    // Update Locomotive Scroll
    if (typeof scroll !== 'undefined') {
        scroll.update();
    }
});

// Load handler to ensure everything is visible
window.addEventListener('load', () => {
    // Force all AOS animations to complete
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.add('aos-animate');
    });
    
    // Ensure timeline is visible
    const timeline = document.querySelector('.timeline-container');
    if (timeline) {
        const items = document.querySelectorAll('.timeline-item');
        
        // Make all items visible
        items.forEach(item => {
            item.classList.add('item-visible');
        });
        
        // Set timeline height to full height
        const lastItem = items[items.length - 1];
        if (lastItem) {
            const totalHeight = lastItem.offsetTop + lastItem.offsetHeight;
            timeline.style.setProperty('--timeline-height', totalHeight + 'px');
        } else {
            timeline.style.setProperty('--timeline-height', '100%');
        }
    }
    
    // Make all cards visible
    document.querySelectorAll('.founder-card, .interview-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
    });
    
    // Update Locomotive Scroll
    if (typeof scroll !== 'undefined') {
        scroll.update();
    }
}); 