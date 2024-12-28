document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const backgroundBlur = document.querySelector('.background-blur');
    const progress = document.querySelector('.progress');
    const slideNumber = document.querySelector('.slide-number');
    let currentSlide = 0;
    let autoplayInterval;
    let particles = [];

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }

    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.className = 'slide';
            if (index === currentSlide) {
                slide.classList.add('active');
                const currentImage = slide.querySelector('img').src;
                backgroundBlur.style.backgroundImage = `url(${currentImage})`;
            } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
            } else if (index === (currentSlide + 1) % slides.length) {
                slide.classList.add('next');
            }
        });

        // Update progress bar and slide number
        progress.style.width = ((currentSlide + 1) / slides.length * 100) + '%';
        slideNumber.textContent = `${currentSlide + 1}/${slides.length}`;

        // Create particles
        for(let i = 0; i < 3; i++) {
            createParticle(
                Math.random() * window.innerWidth,
                window.innerHeight + Math.random() * 100
            );
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }

    // Initialize slider
    updateSlides();

    // Event listeners with hover effects
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    // Mouse move particle effect
    document.addEventListener('mousemove', (e) => {
        if(Math.random() > 0.9) {
            createParticle(e.clientX, e.clientY);
        }
    });

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
            resetAutoplay();
        }
    }

    // Autoplay with progress bar
    function startAutoplay() {
        let progressWidth = 0;
        const progressInterval = 50; // Update every 50ms
        const autoplayDuration = 5000; // 5 seconds per slide
        const progressStep = (progressInterval / autoplayDuration) * 100;

        autoplayInterval = setInterval(() => {
            progressWidth += progressStep;
            progress.style.width = progressWidth + '%';

            if (progressWidth >= 100) {
                progressWidth = 0;
                nextSlide();
            }
        }, progressInterval);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        progress.style.width = '0%';
        startAutoplay();
    }

    // Start autoplay
    startAutoplay();

    // Pause autoplay on hover
    document.querySelector('.slider-container').addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    document.querySelector('.slider-container').addEventListener('mouseleave', () => {
        startAutoplay();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });

    // Add hover effect to slides
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            if (slide.classList.contains('active')) {
                for(let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        createParticle(
                            Math.random() * window.innerWidth,
                            window.innerHeight + Math.random() * 100
                        );
                    }, i * 100);
                }
            }
        });
    });
});