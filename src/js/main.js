// Premium Animations and Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Feature Detection
    const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(12px)') || 
                                 CSS.supports('-webkit-backdrop-filter', 'blur(12px)');
    
    if (!supportsBackdropFilter) {
        document.documentElement.classList.add('no-backdrop-filter');
    }
    
    // Header scroll effect with throttle
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > lastScroll && currentScroll > 100) {
                    header.classList.add('scrolled');
                } else if (currentScroll < lastScroll && currentScroll < 100) {
                    header.classList.remove('scrolled');
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
    
    // Mobile menu interactions
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });
        
        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                navbarCollapse.classList.remove('show');
            }
        });
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu after click
                navbarCollapse?.classList.remove('show');
            }
        });
    });
    
    // Intersection Observer for fade-in elements
    try {
        const fadeElements = document.querySelectorAll('[data-fade]');
        
        if ('IntersectionObserver' in window && fadeElements.length > 0) {
            const fadeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        fadeObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '50px'
            });
            
            fadeElements.forEach(element => {
                element.classList.add('fade-in');
                fadeObserver.observe(element);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            fadeElements.forEach(element => element.classList.add('visible'));
        }
    } catch (error) {
        console.warn('Error setting up fade animations:', error);
    }
    
    // Parallax effect with throttle
    try {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        let parallaxTicking = false;
        
        if (parallaxElements.length > 0) {
            const handleParallax = () => {
                if (!parallaxTicking) {
                    window.requestAnimationFrame(() => {
                        const scrolled = window.pageYOffset;
                        
                        parallaxElements.forEach(element => {
                            const speed = element.getAttribute('data-parallax') || 0.2;
                            const yPos = -(scrolled * speed);
                            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                        });
                        
                        parallaxTicking = false;
                    });
                    
                    parallaxTicking = true;
                }
            };
            
            window.addEventListener('scroll', handleParallax, { passive: true });
        }
    } catch (error) {
        console.warn('Error setting up parallax effect:', error);
    }
    
    // Tooltip initialization
    try {
        const tooltipTriggerList = document.querySelectorAll('[data-tooltip]');
        
        if (tooltipTriggerList.length > 0) {
            const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => {
                return new bootstrap.Tooltip(tooltipTriggerEl, {
                    boundary: 'window',
                    placement: 'bottom'
                });
            });
        }
    } catch (error) {
        console.warn('Error initializing tooltips:', error);
    }
    
    // Interactive hover effects
    const addHoverEffect = (elements, className) => {
        elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add(className);
            });
            
            element.addEventListener('mouseleave', () => {
                element.classList.remove(className);
            });
        });
    };
    
    // Add hover effects to various elements
    addHoverEffect(document.querySelectorAll('.nav-link'), 'nav-link-hover');
    addHoverEffect(document.querySelectorAll('.social-link'), 'social-hover');
    addHoverEffect(document.querySelectorAll('.contact-link'), 'contact-hover');
    
    // Custom cursor effect
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });
    
    const updateCursor = () => {
        const dx = targetX - cursorX;
        const dy = targetY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(updateCursor);
    };
    
    updateCursor();
    
    // Add cursor interactions
    const cursorElements = document.querySelectorAll('a, button');
    
    cursorElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });

    // Hero Slider
    class HeroSlider {
        constructor() {
            this.slider = document.querySelector('.hero-slider');
            this.track = this.slider.querySelector('.slider-track');
            this.slides = this.slider.querySelectorAll('.slide');
            this.prevBtn = this.slider.querySelector('.slider-prev');
            this.nextBtn = this.slider.querySelector('.slider-next');
            this.dots = this.slider.querySelectorAll('.dot');
            this.currentSlide = 0;
            this.isAnimating = false;
            this.touchStartX = 0;
            this.touchEndX = 0;
            this.progressBar = null;
            this.autoPlayInterval = null;
            this.autoPlayDelay = 5000;

            this.init();
        }

        init() {
            this.createProgressBar();
            this.setupEventListeners();
            this.startAutoPlay();
            this.updateProgressBar();
        }

        createProgressBar() {
            this.progressBar = document.createElement('div');
            this.progressBar.className = 'slider-progress';
            this.progressBar.innerHTML = '<div class="slider-progress-bar"></div>';
            this.slider.appendChild(this.progressBar);
        }

        updateProgressBar() {
            const progressBar = this.progressBar.querySelector('.slider-progress-bar');
            progressBar.style.width = '0%';
            progressBar.style.transition = 'width 0.1s linear';
            
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 50);
        }

        setupEventListeners() {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });

            // Touch events
            this.slider.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
            });

            this.slider.addEventListener('touchmove', (e) => {
                this.touchEndX = e.touches[0].clientX;
                const diff = this.touchStartX - this.touchEndX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            });

            // Mouse events
            this.slider.addEventListener('mousemove', (e) => {
                const rect = this.slider.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = (x - centerX) / 20;
                const moveY = (y - centerY) / 20;
                
                this.slides.forEach(slide => {
                    if (slide.classList.contains('active')) {
                        const content = slide.querySelector('.slide-content');
                        content.style.transform = `translateZ(20px) translateX(${moveX}px) translateY(${moveY}px)`;
                    }
                });
            });

            this.slider.addEventListener('mouseleave', () => {
                this.slides.forEach(slide => {
                    if (slide.classList.contains('active')) {
                        const content = slide.querySelector('.slide-content');
                        content.style.transform = 'translateZ(20px)';
                    }
                });
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            });
        }

        startAutoPlay() {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
        }

        stopAutoPlay() {
            clearInterval(this.autoPlayInterval);
        }

        prevSlide() {
            if (this.isAnimating) return;
            this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.updateSlides();
        }

        nextSlide() {
            if (this.isAnimating) return;
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            this.updateSlides();
        }

        goToSlide(index) {
            if (this.isAnimating) return;
            this.currentSlide = index;
            this.updateSlides();
        }

        updateSlides() {
            this.isAnimating = true;
            
            // Reset all slides
            this.slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.transform = 'translateZ(-100px)';
            });

            // Update dots
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });

            // Animate current slide
            const currentSlide = this.slides[this.currentSlide];
            currentSlide.classList.add('active');
            
            // Add 3D transform
            currentSlide.style.transform = 'translateZ(0)';
            
            // Animate content
            const content = currentSlide.querySelector('.slide-content');
            content.style.transform = 'translateZ(20px)';
            
            // Add floating animation to image
            const image = currentSlide.querySelector('.slide-img');
            image.style.animation = 'float 3s ease-in-out infinite';
            
            // Update progress bar
            this.updateProgressBar();
            
            // Reset animation flag
            setTimeout(() => {
                this.isAnimating = false;
            }, 800);
        }
    }

    // Initialize slider
    if (document.querySelector('.hero-slider')) {
        new HeroSlider();
    }

    // Premium Slider
    class PremiumSlider {
        constructor() {
            this.slider = document.querySelector('.premium-slider');
            if (!this.slider) return;

            this.track = this.slider.querySelector('.premium-slider-track');
            this.slides = this.slider.querySelectorAll('.premium-slide');
            this.dots = this.slider.querySelectorAll('.premium-slider-dot');
            this.progressBar = this.slider.querySelector('.premium-slider-progress-bar');
            
            this.currentSlide = 0;
            this.slideCount = this.slides.length;
            this.isAnimating = false;
            this.autoplayInterval = null;
            this.autoplayDelay = 5000;
            
            this.init();
        }

        init() {
            this.setupEventListeners();
            this.startAutoplay();
        }

        setupEventListeners() {
            // Dot navigation
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });

            // Arrow navigation
            const prevBtn = this.slider.querySelector('.premium-slider-arrow--prev');
            const nextBtn = this.slider.querySelector('.premium-slider-arrow--next');
            if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
            if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

            // Touch events
            let touchStartX = 0;
            let touchEndX = 0;

            this.slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                this.pauseAutoplay();
            });

            this.slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
                this.startAutoplay();
            });

            // Mouse events
            this.slider.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.slider.addEventListener('mouseleave', () => this.startAutoplay());
        }

        handleSwipe(startX, endX) {
            const swipeThreshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }

        goToSlide(index) {
            if (this.isAnimating || index === this.currentSlide) return;

            this.isAnimating = true;
            this.updateProgressBar(0);

            // Update active states
            this.slides[this.currentSlide].classList.remove('active');
            this.dots[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dots[this.currentSlide].classList.add('active');

            // Animate track
            this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;

            // Reset animation state
            setTimeout(() => {
                this.isAnimating = false;
                this.updateProgressBar(100);
            }, 800);
        }

        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.slideCount;
            this.goToSlide(nextIndex);
        }

        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
            this.goToSlide(prevIndex);
        }

        startAutoplay() {
            this.pauseAutoplay();
            this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
        }

        pauseAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        }

        updateProgressBar(percent) {
            this.progressBar.style.width = `${percent}%`;
        }
    }

    // Initialize the slider when the DOM is loaded
    new PremiumSlider();
});
