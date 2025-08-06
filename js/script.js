// Discobeak Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
            } else {
                // Create mobile menu if it doesn't exist
                createMobileMenu();
            }
        });
    }
    
    // Create mobile menu dynamically
    function createMobileMenu() {
        const nav = document.querySelector('nav');
        const mobileMenuDiv = document.createElement('div');
        mobileMenuDiv.className = 'mobile-menu md:hidden bg-gray-800 border-t border-gray-700';
        mobileMenuDiv.innerHTML = `
            <div class="px-6 py-4 space-y-4">
                <a href="/" class="block text-white hover:text-disco-gold transition-colors">Home</a>
                <a href="/about" class="block text-white hover:text-disco-gold transition-colors">About</a>
                <a href="/shop" class="block text-white hover:text-disco-gold transition-colors">Shop</a>
                <a href="/blog" class="block text-white hover:text-disco-gold transition-colors">Blog</a>
            </div>
        `;
        nav.appendChild(mobileMenuDiv);
    }
    
    // Disco duck dancing on click
    const discoDuckIcons = document.querySelectorAll('.disco-duck-icon');
    discoDuckIcons.forEach(duck => {
        duck.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'disco-duck-dance 0.5s ease-in-out 3';
            }, 10);
        });
    });
    
    // Add to cart animations
    const addToCartButtons = document.querySelectorAll('button');
    addToCartButtons.forEach(button => {
        if (button.textContent.includes('Add to Cart')) {
            button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create floating cart icon
            const cart = document.createElement('i');
            cart.className = 'fas fa-shopping-cart';
            cart.style.cssText = `
                position: fixed;
                top: ${e.clientY}px;
                left: ${e.clientX}px;
                color: var(--disco-pink);
                font-size: 24px;
                pointer-events: none;
                z-index: 9999;
                animation: cart-float 1s ease-out forwards;
            `;
            
            document.body.appendChild(cart);
            
            // Animate button
            this.style.transform = 'scale(0.95)';
            this.innerHTML = '<i class="fas fa-check mr-2"></i>Added!';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.innerHTML = '<i class="fas fa-shopping-cart mr-2"></i>Add to Cart';
            }, 1000);
            
            // Remove floating cart
            setTimeout(() => {
                document.body.removeChild(cart);
            }, 1000);
            });
        }
    });
    
    // Newsletter subscription
    const newsletterForms = document.querySelectorAll('form, .newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"], button:last-child');
            const emailInput = this.querySelector('input[type="email"]');
            
            if (submitButton && emailInput) {
                submitButton.innerHTML = '<i class="fas fa-check mr-2"></i>Subscribed!';
                submitButton.style.background = 'linear-gradient(45deg, var(--disco-lime), var(--disco-cyan))';
                emailInput.value = '';
                
                setTimeout(() => {
                    submitButton.innerHTML = 'Subscribe';
                    submitButton.style.background = '';
                }, 2000);
            }
        });
    });
    
    // Scroll animations
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
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.product-card, article, .bg-gray-800, .bg-gray-700');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Disco ball cursor effect
    let isMouseMoving = false;
    let mouseTimer;
    
    document.addEventListener('mousemove', function(e) {
        clearTimeout(mouseTimer);
        isMouseMoving = true;
        
        // Create sparkle at cursor
        if (Math.random() < 0.1) { // 10% chance
            createSparkle(e.clientX, e.clientY);
        }
        
        mouseTimer = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
    });
    
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
            z-index: 9999;
            font-size: 16px;
            animation: sparkle-fade 1s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (document.body.contains(sparkle)) {
                document.body.removeChild(sparkle);
            }
        }, 1000);
    }
    
    // Quantity selectors
    const quantityButtons = document.querySelectorAll('button');
    quantityButtons.forEach(button => {
        if (button.textContent === '+' || button.textContent === '-') {
            button.addEventListener('click', function() {
                const quantitySpan = this.parentNode.querySelector('span');
                if (quantitySpan) {
                    let quantity = parseInt(quantitySpan.textContent);
                    if (this.textContent === '+') {
                        quantity++;
                    } else if (this.textContent === '-' && quantity > 1) {
                        quantity--;
                    }
                    quantitySpan.textContent = quantity;
                    
                    // Add a little animation
                    quantitySpan.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        quantitySpan.style.transform = 'scale(1)';
                    }, 150);
                }
            });
        }
    });
    
    // Search functionality (if search is added later)
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search" i]');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Add search suggestions or filtering logic here
            console.log('Searching for:', this.value);
        });
    });
    
    // Lazy loading for images
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('image-loading');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        img.classList.add('image-loading');
        imageObserver.observe(img);
    });
    
    // Disco mode toggle (Easter egg)
    let discoModeClicks = 0;
    const logo = document.querySelector('.disco-duck-icon');
    
    if (logo) {
        logo.addEventListener('click', function() {
            discoModeClicks++;
            if (discoModeClicks >= 5) {
                activateDiscoMode();
                discoModeClicks = 0;
            }
        });
    }
    
    function activateDiscoMode() {
        document.body.style.animation = 'disco-bg-shift 0.5s ease-in-out infinite';
        
        // Add more disco balls
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createDiscoBall();
            }, i * 200);
        }
        
        // Reset after 5 seconds
        setTimeout(() => {
            document.body.style.animation = '';
            const tempBalls = document.querySelectorAll('.temp-disco-ball');
            tempBalls.forEach(ball => ball.remove());
        }, 5000);
    }
    
    function createDiscoBall() {
        const ball = document.createElement('div');
        ball.className = 'temp-disco-ball';
        ball.style.cssText = `
            position: fixed;
            width: 30px;
            height: 30px;
            background: linear-gradient(45deg, #FFD700, #FF1493, #00FFFF, #8A2BE2);
            border-radius: 50%;
            top: ${Math.random() * window.innerHeight}px;
            left: ${Math.random() * window.innerWidth}px;
            pointer-events: none;
            z-index: 9999;
            animation: disco-float 3s ease-in-out infinite;
        `;
        
        document.body.appendChild(ball);
    }
    
    // Performance optimization: debounce scroll events
    let ticking = false;
    
    function updateScrollEffects() {
        // Add any scroll-based effects here
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
    
    // Accessibility enhancements
    document.addEventListener('keydown', function(e) {
        // Allow Enter key to trigger click events on focused elements
        if (e.key === 'Enter') {
            const focused = document.activeElement;
            if (focused && focused.tagName !== 'INPUT' && focused.tagName !== 'TEXTAREA') {
                focused.click();
            }
        }
        
        // Add escape key to close mobile menu
        if (e.key === 'Escape') {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
    
    // Add custom CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cart-float {
            0% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) scale(0.5);
                opacity: 0;
            }
        }
        
        @keyframes sparkle-fade {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: scale(1) rotate(180deg);
                opacity: 1;
            }
            100% {
                transform: scale(0) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize any third-party integrations
    // (This is where you'd add analytics, chat widgets, etc.)
    
    console.log('🦆 Discobeak website loaded and ready to groove! ✨');
});

// Utility functions
function getRandomColor() {
    const colors = ['#FF1493', '#8A2BE2', '#FFD700', '#FF4500', '#00FFFF', '#32CD32'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Export functions for potential use in other scripts
window.DiscobeakUtils = {
    getRandomColor,
    isInViewport,
    createSparkle: function(x, y) {
        // Made available globally for other scripts
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
            z-index: 9999;
            font-size: 16px;
            animation: sparkle-fade 1s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (document.body.contains(sparkle)) {
                document.body.removeChild(sparkle);
            }
        }, 1000);
    }
};
