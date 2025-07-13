// Modern JavaScript for Ali Adabi's Website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initSmoothScrolling();
    initScrollEffects();
    initAnimations();
    initContactForm();
    initMobileMenu();
    initEmailObfuscation();
});

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.project-card, .publication-item, .speaking-item, .award-item, .skill-category, .timeline-item, .experience-item'
    );
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Floating animation for hero icons
    const floatingElements = document.querySelectorAll('.float-element');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 2}s`;
    });
    
    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero-title .highlight');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const countUp = (element, target) => {
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 20);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                
                if (number) {
                    countUp(target, number);
                }
                
                statsObserver.unobserve(target);
            }
        });
    });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Create mailto link with obfuscated email
            const toEmail = buildEmail('aliadabi', 'icloud.com');
            const mailtoLink = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showNotification('Email client opened! Please send the message from your email application.', 'success');
            
            // Reset form
            form.reset();
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// ===== UTILITY FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateField(field) {
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#dc2626';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = '#dc2626';
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.style.borderColor = '';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: '500',
        zIndex: '9999',
        maxWidth: '400px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'error' ? '#dc2626' : 
                        type === 'success' ? '#059669' : '#2563eb'
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function(...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    // Navigate sections with arrow keys (when not in form)
    if (!document.activeElement.matches('input, textarea')) {
        const sections = ['home', 'about', 'experience', 'projects', 'publications', 'speaking', 'contact'];
        const currentIndex = sections.findIndex(section => 
            document.getElementById(section).getBoundingClientRect().top <= 100
        );
        
        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            e.preventDefault();
            document.getElementById(sections[currentIndex + 1]).scrollIntoView({
                behavior: 'smooth'
            });
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            document.getElementById(sections[currentIndex - 1]).scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
});

// ===== PRELOAD IMAGES =====
function preloadImages() {
    const images = [
        './images/ac_global_demo.png',
        './images/tc.jpg',
        './images/icorps.png',
        './images/ucscbc.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Add skip link for keyboard navigation
document.addEventListener('DOMContentLoaded', function() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
});

// ===== SCROLL TO TOP BUTTON =====
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Scroll to top');
    
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateY(100px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });
    
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 500) {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        } else {
            button.style.opacity = '0';
            button.style.transform = 'translateY(100px)';
        }
    }, 100));
    
    document.body.appendChild(button);
}

// Initialize scroll to top button
createScrollToTopButton();

// ===== CONSOLE EASTER EGG =====
console.log(`
🚀 Welcome to Ali Adabi's Portfolio!
💻 Interested in the code? Check out the GitHub: http://github.com/seadsystem
🤝 Let's connect: aliadabi@icloud.com
🧠 AI • ML • IoT • Innovation
`);

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log(`⚡ Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
            }
        }, 0);
    });
}

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Note: Add service worker file if needed for offline functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}

// ===== THEME DETECTION =====
function initThemeDetection() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function updateTheme(e) {
        if (e.matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
    
    updateTheme(prefersDark);
    prefersDark.addEventListener('change', updateTheme);
}

// Initialize theme detection
initThemeDetection();

// ===== EMAIL OBFUSCATION =====
function initEmailObfuscation() {
    // Handle email contact link
    const emailContact = document.getElementById('email-contact');
    const emailSocial = document.getElementById('email-social');
    
    if (emailContact) {
        emailContact.addEventListener('click', function(e) {
            e.preventDefault();
            const user = this.dataset.user;
            const domain = this.dataset.domain;
            const email = buildEmail(user, domain);
            window.location.href = `mailto:${email}`;
        });
        
        // Add hover effect to show it's clickable
        emailContact.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
            this.style.textDecoration = 'underline';
        });
        
        emailContact.addEventListener('mouseleave', function() {
            this.style.textDecoration = 'none';
        });
    }
    
    if (emailSocial) {
        emailSocial.addEventListener('click', function(e) {
            e.preventDefault();
            const user = this.dataset.user;
            const domain = this.dataset.domain;
            const email = buildEmail(user, domain);
            window.location.href = `mailto:${email}`;
        });
    }
}

function buildEmail(user, domain) {
    // Additional obfuscation - reverse and rebuild
    const userPart = user.split('').reverse().join('');
    const domainPart = domain.split('').reverse().join('');
    
    // Reverse them back
    const finalUser = userPart.split('').reverse().join('');
    const finalDomain = domainPart.split('').reverse().join('');
    
    return `${finalUser}@${finalDomain}`;
}

// Add CSS to hide email parts from basic scrapers
function addEmailProtectionCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .email-part::before {
            content: '';
            position: absolute;
            left: -9999px;
        }
        .email-protection {
            unicode-bidi: bidi-override;
            direction: rtl;
        }
    `;
    document.head.appendChild(style);
}

// Initialize email protection CSS
addEmailProtectionCSS(); 