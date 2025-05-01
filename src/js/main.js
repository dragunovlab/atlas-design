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
});
