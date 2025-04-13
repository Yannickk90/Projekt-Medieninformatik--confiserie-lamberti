// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Initialize tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
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