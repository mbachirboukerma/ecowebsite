document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleInput = document.querySelector('#theme-toggle input');
    const clickSound = document.getElementById('click-sound');
    const slides = document.querySelectorAll('.slide');
    const sliderButtons = document.querySelectorAll('.slider-btn');
    const button = document.getElementById('clickMeBtn');
    const message = document.getElementById('message');
    const aboutContainer = document.querySelector('.about-container');
    let currentSlide = 0;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Sound Playback
    const playSound = () => {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => {
                console.log('Sound playback prevented:', e);
            });
        }
    };

    // Update Cart Count
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            if (totalItems > 0) {
                element.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }

    // Initialize cart count
    updateCartCount();

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Smooth Scroll for Navigation Links
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

    // Active Navigation Link
    const navLinks = document.querySelectorAll('.nav-link');
    
    function setActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(sectionId)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // ClickMe Button Animation
    if (button && message) {
        button.addEventListener('click', () => {
            playSound();
            message.classList.toggle('visible');
            button.textContent = message.classList.contains('visible')
                ? 'Click me again!'
                : 'Click me!';
            
            // Add bounce animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        });
    }

    // About Section Animation
    if (aboutContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    aboutContainer.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(aboutContainer);
    }

    // Add to Cart Animation
    document.querySelectorAll('.add-to-cart').forEach(addButton => {
        addButton.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');
            
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1,
                    image: productImage
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Add animation feedback
            this.classList.add('added');
            setTimeout(() => {
                this.classList.remove('added');
            }, 1000);
        });
    });

    // Listen for cart updates from other tabs
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart') {
            cart = JSON.parse(e.newValue) || [];
            updateCartCount();
        }
    });

    // Slider functionality
    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            sliderButtons[i].classList.toggle('active', i === index);
        });
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };

    sliderButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            playSound();
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    setInterval(nextSlide, 3000);

    // Button sound & shop redirect
    document.querySelectorAll('button, a.shop-btn').forEach(element => {
        element.addEventListener('click', function (e) {
            if (element.classList.contains('shop-btn')) {
                e.preventDefault();
                playSound();
                setTimeout(() => {
                    window.location.href = element.href;
                }, 300);
            } else {
                playSound();
            }
        });
    });

    // Contact form modern submit with spinner and popup
    const contactForm = document.getElementById('contact-form');
    const contactBtn = document.getElementById('contact-submit-btn');
    const contactPopup = document.getElementById('contact-success-popup');

    if (contactForm && contactBtn && contactPopup) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            contactBtn.classList.add('loading');

            // جمع البيانات
            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                contactBtn.classList.remove('loading');
                contactPopup.classList.add('active');
                contactPopup.classList.remove('hidden');
                contactForm.reset();
                setTimeout(() => {
                    contactPopup.classList.remove('active');
                    contactPopup.classList.add('hidden');
                }, 3000);
            })
            .catch(error => {
                contactBtn.classList.remove('loading');
                alert('حدث خطأ أثناء الإرسال. حاول مرة أخرى.');
            });
        });
    }
});