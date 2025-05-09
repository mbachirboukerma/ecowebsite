console.log('shop.js loaded and running');
// Product data
const products = [
    {
        id: 1,
        name: "𝓑𝓾𝓵𝓭𝓪𝓴 𝓢𝓹𝓲𝓬𝔂 𝓒𝓱𝓲𝓬𝓴𝓮𝓷 𝓡𝓪𝓶𝓮𝓷",
        price: 3.99,
        description: "Extremely spicy Korean ramen with chicken flavor",
        image: "https://i.pinimg.com/736x/76/15/0f/76150ff84fbafed7fd779877c2c34e46.jpg",
        size: "140g"
    },
    {
        id: 2,
        name: "𝓛𝓸𝓽𝓽𝓮 𝓒𝓱𝓸𝓬𝓸 𝓟��𝓮",
        price: 5.99,
        description: "Classic Korean chocolate marshmallow pies",
        image: "https://i.pinimg.com/736x/4a/03/fd/4a03fd19841b0969972ba0b505e4de7f.jpg",
        size: "12 pack"
    },
    {
        id: 3,
        name: "𝓞𝓽𝓽𝓸𝓰𝓲 𝓙𝓲𝓷 𝓡𝓪𝓶𝓮𝓷",
        price: 2.99,
        description: "Mild and savory Korean ramen",
        image: "https://i.pinimg.com/736x/ca/31/27/ca3127a776766211eee58dda9bf57aa4.jpg",
        size: "120g"
    },
    {
        id: 4,
        name: "𝓗𝓸𝓷𝓮𝔂 𝓑𝓾𝓽𝓽𝓮𝓻 𝓒𝓱𝓲𝓹𝓼",
        price: 4.49,
        description: "Sweet and savory Korean snack",
        image: "https://i.pinimg.com/736x/43/07/5c/43075cee421d312d7e949f5234708f79.jpg",
        size: "80g"
    },
    {
        id: 5,
        name: "𝓑𝓲𝓫𝓲𝓰𝓸 𝓜𝓪𝓷𝓭𝓾",
        price: 6.99,
        description: "Korean dumplings quick meal",
        image: "https://i.pinimg.com/736x/d3/cd/d0/d3cdd0e0d4b221b2e57fc6f7dfe3a1bc.jpg",
        size: "500g"
    },
    {
        id: 6,
        name: "𝓞𝓻𝓮𝓸",
        price: 4.99,
        description: "Classic Korean chocolate marshmallow pies",
        image: "https://i.pinimg.com/736x/66/af/36/66af364336512615de8510eed2a4493f.jpg",
        size: "5 pack"
    },
    {
        id: 7,
        name: "𝓢𝓽𝓻𝓪𝔀𝓫𝓮𝓻𝓻𝔂 𝓜𝓲𝓵𝓴",
        price: 3.99,
        description: "Classic Korean chocolate marshmallow pies",
        image: "https://i.pinimg.com/736x/0d/7a/bf/0d7abf3ae2f4217635f9de4c9597e015.jpg",
        size: "25 ml"
    },
    {
        id: 8,
        name: "𝓢��𝓻𝓪𝔀𝓫𝓮𝓻𝓻𝔂 𝓜𝓲𝓵𝓴 𝓒𝓱𝓪𝓹��𝓼𝓪𝓵𝓽𝓽𝓮𝓸𝓴",
        price: 6.95,
        description: "Classic Korean chocolate marshmallow pies",
        image: "https://i.pinimg.com/736x/4f/8c/2e/4f8c2e9e0faa7b461b16c75c5cb7433d.jpg",
        size: "25 ml"
    },
    {
        id: 9,
        name: " 𝓣𝓽𝓮𝓸𝓴𝓫𝓸𝓴𝓴𝓲",
        price: 4.98,
        description: "Classic Korean spicy",
        image: "https://i.pinimg.com/736x/bc/a1/0e/bca10e80e2c24c8029acd988ec84505a.jpg",
        size: "250 G"
    },
];

const productGrid = document.getElementById('product-grid');
if (!productGrid) {
    console.error('product-grid not found!');
} else {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) {
        console.warn('.cart-count not found! (cart badge will not update)');
    }
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) {
        console.warn('#theme-toggle not found! (theme toggle may not work)');
    }
    const moonIcon = themeToggle.querySelector('i');

    // Update cart count
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    updateCartCount();

    // Create product cards
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <p class="size">Size: ${product.size}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;

        // 3D hover animation
        productCard.addEventListener('mouseenter', () => {
            productCard.style.transform = 'perspective(1000px) rotateY(10deg) rotateX(5deg) scale(1.05)';
            productCard.style.boxShadow = '0 15px 30px rgba(255, 182, 193, 0.4)';
        });

        productCard.addEventListener('mouseleave', () => {
            productCard.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
            productCard.style.boxShadow = '0 5px 15px rgba(255, 182, 193, 0.2)';
        });

        // Add to cart functionality
        const addButton = productCard.querySelector('.add-to-cart');
        addButton.addEventListener('click', () => {
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.image
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Add animation
            addButton.textContent = 'Added!';
            setTimeout(() => {
                addButton.textContent = 'Add to Cart';
            }, 1000);
        });

        productGrid.appendChild(productCard);
    });

    // Animation on scroll for product cards
    function revealCardsOnScroll() {
        const cards = document.querySelectorAll('.product-card');
        const triggerBottom = window.innerHeight * 0.95;
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            if (cardTop < triggerBottom) {
                card.classList.add('visible');
            }
        });
    }
    window.addEventListener('scroll', revealCardsOnScroll);
    revealCardsOnScroll();

    // Theme toggle logic (موحد مع باقي الصفحات)
    const themeToggleInput = document.querySelector('#theme-toggle input');
    const clickSound = document.getElementById('click-sound');
    // تحميل الثيم عند البداية
    const loadTheme = () => {
        const savedMode = localStorage.getItem('darkMode');
        const isDark = savedMode === 'true';
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        document.body.classList.toggle('dark-mode', isDark);
        if (themeToggleInput) {
            themeToggleInput.checked = isDark;
        }
    };
    // تغيير الثيم وتخزين التفضيل
    const toggleTheme = () => {
        const isDark = themeToggleInput.checked;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark);
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
        }
    };
    if (themeToggleInput) {
        themeToggleInput.addEventListener('change', toggleTheme);
    }
    loadTheme();
    // مزامنة بين التابات
    window.addEventListener('storage', function(e) {
        if (e.key === 'darkMode') {
            loadTheme();
        }
    });

    // عناصر DOM
    const themeSwitchInput = document.querySelector('#theme-toggle input');

    // تحديث الثيم حسب الحالة
    function applyTheme(isDark) {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.body.classList.remove('dark-mode');
        }

        // تحديث حالة السويتش
        if (themeSwitchInput) {
            themeSwitchInput.checked = isDark;
        }
    }

    // تحميل الثيم عند بداية الصفحة
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
        applyTheme(savedTheme === 'true');
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark);
        localStorage.setItem('darkMode', prefersDark);
    }

    // عند تغيير السويتش
    themeSwitchInput.addEventListener('change', () => {
        const isDark = themeSwitchInput.checked;
        applyTheme(isDark);
        localStorage.setItem('darkMode', isDark);
        playSound();
    });

    // تفعيل الصوت عند الضغط على الأزرار والروابط
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
}