 document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Typewriter Effect ---
    const typewriterTexts = [
        "Machine Learning",
        "Internet of Things (IoT)",
        "Sustainability",
        "Smart Cities",
        "Cyber-Physical Systems",
        "Energy Analytics"
    ];
    
    let typewriterElement = document.getElementById('typewriter-text');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeWriter() {
        if (!typewriterElement) return;
        const currentText = typewriterTexts[textIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; 
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typewriterTexts.length;
            typingSpeed = 500;
        }
        
        setTimeout(typeWriter, typingSpeed);
    }
    
    if(typewriterElement) typeWriter();

    // --- 2. Stats Counter Animation ---
    const counters = document.querySelectorAll('.stat-number');
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const speed = 200;
            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target + "+";
                }
            };
            updateCount();
        });
    };

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        });
        observer.observe(statsSection);
    }

    // --- 3. Gallery Logic (Fixed) ---
    const slides = document.querySelectorAll('.gallery-slide');
    const thumbs = document.querySelectorAll('.filmstrip-thumb');
    const nextBtn = document.querySelector('.gallery-next');
    const prevBtn = document.querySelector('.gallery-prev');
    const progressBar = document.querySelector('.progress-bar');
    const counterCurrent = document.querySelector('.current-slide');
    const counterTotal = document.querySelector('.total-slides');
    let currentSlide = 0;
    let autoPlayInterval;

    if(slides.length > 0) {
        if(counterTotal) counterTotal.innerText = slides.length;

        function showSlide(index) {
            // Loop functionality
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;
            currentSlide = index;

            // Update Classes
            slides.forEach(s => s.classList.remove('active'));
            slides[currentSlide].classList.add('active');
            
            thumbs.forEach(t => t.classList.remove('active'));
            if(thumbs[currentSlide]) thumbs[currentSlide].classList.add('active');

            if(counterCurrent) counterCurrent.innerText = currentSlide + 1;

            // Reset Progress Bar Animation
            if(progressBar) {
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = 'width 4s linear'; // Matches interval
                    progressBar.style.width = '100%';
                }, 50);
            }
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 4000); // 4 Seconds per slide
        }

        // Event Listeners
        if(nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay(); // Reset timer on interaction
        });

        if(prevBtn) prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            startAutoPlay();
        });

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                showSlide(index);
                startAutoPlay();
            });
        });

        // Initialize
        showSlide(0);
        startAutoPlay();
    }

    // --- 4. Theme Switcher ---
    const themeSwitch = document.getElementById('checkbox');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark' && themeSwitch) themeSwitch.checked = true;
    }
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function(e) {
            if (e.target.checked) {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- 5. Mobile Menu ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if(navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = getComputedStyle(document.documentElement).getPropertyValue('--nav-bg');
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                navLinks.style.zIndex = '999';
            }
        });
    }

    // --- 6. Network Graph (Fixed Visibility) ---
    initNetworkGraph();
});

// Network Graph Logic
function initNetworkGraph() {
    const canvas = document.getElementById('network-graph');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Resize function
    let width, height;
    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    const particles = [];
    const particleCount = Math.min(80, Math.floor(width * height / 10000));
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            // FIX: Use White color so it shows on dark background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; 
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    ctx.beginPath();
                    // FIX: Use Cyan/White lines
                    ctx.strokeStyle = `rgba(100, 200, 255, ${0.15 - distance/1200})`; 
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}
