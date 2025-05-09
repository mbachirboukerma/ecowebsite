// DOM Elements
const steps = document.querySelectorAll('.step');
const checkoutSteps = document.querySelectorAll('.checkout-step');
const nextButtons = document.querySelectorAll('.next-btn');
const backButtons = document.querySelectorAll('.back-btn');
const paymentForm = document.getElementById('payment-form');
const personalInfoForm = document.getElementById('personal-info-form');
const confirmOrderBtn = document.getElementById('confirm-order');
const orderSummary = document.getElementById('order-summary');
const orderReceipt = document.getElementById('order-receipt');
    const clickSound = document.getElementById('click-sound');
const successSound = document.getElementById('success-sound');

// Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentStep = 1;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if cart is empty
    if (cart.length === 0) {
        showError('Your cart is empty. Please add items before checkout.');
        setTimeout(() => {
            window.location.href = 'shop.html';
        }, 2000);
        return;
    }

    updateCartCount();
    displayOrderSummary();
    initializeThemeToggle();
    setupEventListeners();
    AOS.init();
    
    // Initialize confirmation step if it's the current step
    const currentStep = document.querySelector('.step.active');
    if (currentStep && currentStep.id === 'step5') {
        initializeConfirmationStep();
    }
    
    // Add step change listener
    const stepButtons = document.querySelectorAll('.step-button');
    stepButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetStep = button.getAttribute('data-step');
            if (targetStep === 'step5') {
                setTimeout(initializeConfirmationStep, 100);
            }
        });
    });

    // Bind confirmation step buttons
    bindConfirmationStepButtons();
    
    // Add event listener for confirmation step
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', function() {
            // ... existing confirmation code ...
            
            // After confirmation, rebind the buttons
            setTimeout(() => {
                bindConfirmationStepButtons();
            }, 100);
        });
    }
});

// Event Listeners
function setupEventListeners() {
    // Navigation
    nextButtons.forEach(button => {
        button.addEventListener('click', handleNextStep);
    });

    backButtons.forEach(button => {
        button.addEventListener('click', handleBackStep);
    });

    // Forms
    paymentForm?.addEventListener('submit', handlePaymentSubmit);
    personalInfoForm?.addEventListener('submit', handlePersonalInfoSubmit);
    confirmOrderBtn?.addEventListener('click', handleOrderConfirmation);

    // Input Formatting and Validation
    document.getElementById('card-number')?.addEventListener('input', formatCardNumber);
    document.getElementById('expiry')?.addEventListener('input', formatExpiry);
    document.getElementById('cvv')?.addEventListener('input', formatCVV);
}

// Step Navigation
function handleNextStep(e) {
    e.preventDefault();
    playSound(clickSound);
    
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
        return;
    }
    
    if (currentStep < 5) {
        currentStep++;
        updateSteps();
        animateStepTransition('next');
    }
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1: // Review Order
            if (cart.length === 0) {
                showError('Your cart is empty. Please add items before checkout.');
                return false;
            }
            return true;

        case 2: // Payment Info
            return validatePaymentForm();

        case 3: // Personal Info
            return validatePersonalInfoForm();

        case 4: // Delivery
            return validateDeliveryForm();

        default:
            return true;
    }
}

function validatePaymentForm() {
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('card-name').value;
    const phone = document.getElementById('phone').value;

    // Validate card number (must be 16 digits)
    if (cardNumber.length !== 16) {
        showError('Card number must be 16 digits');
        return false;
    }

    // Validate card name
    if (cardName.trim().length < 3) {
        showError('Please enter a valid card holder name');
        return false;
    }

    // Validate expiry date
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (!month || !year || 
        month < 1 || month > 12 || 
        year < currentYear || 
        (year === currentYear && month < currentMonth)) {
        showError('Please enter a valid expiry date');
        return false;
    }

    // Validate CVV (must be 3 digits)
    if (cvv.length !== 3) {
        showError('CVV must be 3 digits');
        return false;
    }

    // Validate phone number
    if (phone.length < 10) {
        showError('Please enter a valid phone number');
        return false;
    }

    return true;
}

function validatePersonalInfoForm() {
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const phone = document.getElementById('phone').value;

    // Validate full name
    if (fullName.trim().length < 3) {
        showError('Please enter a valid full name');
        return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return false;
    }

    // Validate address
    if (address.trim().length < 5) {
        showError('Please enter a valid address');
        return false;
    }

    // Validate city
    if (city.trim().length < 2) {
        showError('Please enter a valid city');
        return false;
    }

    // Validate phone
    if (phone.length < 10) {
        showError('Please enter a valid phone number');
        return false;
    }

    return true;
}

function validateDeliveryForm() {
    const deliveryOption = document.querySelector('input[name="delivery"]:checked');
    if (!deliveryOption) {
        showError('Please select a delivery option');
        return false;
    }
    return true;
}

function handleBackStep(e) {
    e.preventDefault();
    playSound(clickSound);
    
    if (currentStep > 1) {
        currentStep--;
        updateSteps();
        animateStepTransition('back');
    }
}

function updateSteps() {
    steps.forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
    });

    checkoutSteps.forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
        if (step.id === 'step5') {
            if (index + 1 === currentStep) {
                step.classList.remove('hidden');
                bindConfirmationStepButtons();
            } else {
                step.classList.add('hidden');
            }
        }
    });

    const confirmationStep = document.getElementById('step5');
    if (confirmationStep) {
        if (currentStep === 5) {
            confirmationStep.classList.remove('hidden');
            bindConfirmationStepButtons();
        } else {
            confirmationStep.classList.add('hidden');
        }
    }
    const receiptModal = document.querySelector('.receipt-modal');
    if (receiptModal) {
        receiptModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Animations
function animateStepTransition(direction) {
    const currentStepElement = document.querySelector(`#step-${currentStep}`);
    if (!currentStepElement) return;
    const animation = direction === 'next' ? 'slideInRight' : 'slideInLeft';
    currentStepElement.style.animation = 'none';
    currentStepElement.offsetHeight; // Trigger reflow
    currentStepElement.style.animation = `${animation} 0.5s ease forwards`;
}

// Form Handling
async function handlePaymentSubmit(e) {
    e.preventDefault();
    playSound(clickSound);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        // Simulate API call
        await simulateLoading();
        handleNextStep(e);
    } catch (error) {
        showError('Payment verification failed. Please try again.');
    }
}

async function handlePersonalInfoSubmit(e) {
    e.preventDefault();
    playSound(clickSound);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        // Simulate API call
        await simulateLoading();
        handleNextStep(e);
    } catch (error) {
        showError('Failed to save personal information. Please try again.');
    }
}

async function handleOrderConfirmation() {
    playSound(clickSound);

    try {
        await simulateLoading();
        playSound(successSound);
        showConfetti();
        displayOrderReceipt();
        handleNextStep({ preventDefault: () => {} });
    } catch (error) {
        showError('Failed to confirm order. Please try again.');
    }
}

// Utility Functions
function formatCardNumber(e) {
    e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
}

function formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
}

function formatCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
}

function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounts.forEach(counter => counter.textContent = count);
}

function displayOrderSummary() {
    if (!orderSummary) return;

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 5.99;
    const total = subtotal + shipping;

    orderSummary.innerHTML = cart.map(item => `
        <div class="order-item" data-aos="fade-up">
            <img src="${item.image}" alt="${item.name}" class="order-item-img">
            <div class="order-item-details">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                <div class="order-item-qty">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="order-item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('grand-total').textContent = `$${total.toFixed(2)}`;

    // Add event listeners for quantity buttons
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', handleQuantityChange);
    });

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });
}

function handleQuantityChange(e) {
    const button = e.target;
    const itemId = parseInt(button.dataset.id);
    const item = cart.find(item => item.id === itemId);
    
    if (button.classList.contains('plus')) {
        item.quantity++;
    } else if (button.classList.contains('minus') && item.quantity > 1) {
        item.quantity--;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    displayOrderSummary();
}

function handleRemoveItem(e) {
    const button = e.target.closest('.remove-btn');
    const itemId = parseInt(button.dataset.id);
    
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayOrderSummary();
}

function displayOrderReceipt() {
    if (!orderReceipt) return;
    const orderNumber = Math.floor(Math.random() * 1000000);
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    orderReceipt.innerHTML = `
        <div class="receipt-header">
            <h3>Order Confirmed!</h3>
            <p>Thank you for your purchase</p>
        </div>
        <div class="receipt-details">
            <p><strong>Order Number:</strong> #${orderNumber}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
        </div>
        <div class="receipt-items">
                ${cart.map(item => `
                    <div class="receipt-item">
                    <span>${item.name} x ${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
        </div>
                <div class="receipt-total">
            <p><strong>Total:</strong> $${document.getElementById('grand-total').textContent.replace('$', '')}</p>
                </div>
    `;
}

// Theme Toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const themeToggleInput = themeToggle.querySelector('input');
    if (!themeToggleInput) return;
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggleInput.checked = isDarkMode;
    themeToggleInput.addEventListener('change', (e) => {
        const isDark = e.target.checked;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('darkMode', isDark);
    });
}

// Animations and Effects
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function showConfetti() {
    const colors = ['#ff69b4', '#ffb6c1', '#ffc0cb'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

function playSound(sound) {
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

async function simulateLoading() {
    return new Promise(resolve => setTimeout(resolve, 1500));
}

// Add CSS for new animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    .error-message {
        position: fixed;
        top: 80px; /* Position below navbar */
        left: 50%;
        transform: translateX(-50%);
        background: var(--error-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        animation: slideDown 0.3s ease;
        z-index: 9999;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        font-weight: 500;
        text-align: center;
        min-width: 300px;
        max-width: 90%;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    @keyframes slideDown {
        from { 
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        to { 
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }

    .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        top: -10px;
        animation: fall linear forwards;
    }

    @keyframes fall {
        to { transform: translateY(100vh) rotate(360deg); }
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    .receipt-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .receipt-details {
        margin-bottom: 2rem;
    }

    .receipt-items {
        margin-bottom: 2rem;
    }

    .receipt-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    .receipt-total {
        text-align: right;
        font-size: 1.2rem;
        font-weight: 600;
        }
    `;
    document.head.appendChild(style);

// Confetti Animation
function createConfetti() {
    const container = document.querySelector('.confetti-container');
    const colors = ['var(--primary-color)', 'var(--accent-color)', 'var(--success-color)'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(confetti);
    }
}

// Receipt Modal
function showReceiptModal() {
    const modal = document.querySelector('.receipt-modal');
    if (!modal) return;

    const orderItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const receiptItemsDiv = document.querySelector('.receipt-items');
    
    if (receiptItemsDiv) {
        if (orderItems.length > 0) {
            receiptItemsDiv.innerHTML = orderItems.map(item => `
                <div class="receipt-item">
                    <div class="receipt-item-details">
                        <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px;">
                        <span>${item.name} x ${item.quantity}</span>
                    </div>
                    <span class="receipt-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
        } else {
            receiptItemsDiv.innerHTML = '<div class="receipt-item">No items in order.</div>';
        }
    }

    const receiptTotalDiv = document.querySelector('.receipt-total');
    if (receiptTotalDiv) {
        const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = 5.99;
        const total = subtotal + shipping;
        receiptTotalDiv.innerHTML = `
            <div class="receipt-subtotal">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="receipt-shipping">
                <span>Shipping:</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            <div class="receipt-grand-total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;
    }

    modal.classList.add('active');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeReceiptModal() {
    const modal = document.querySelector('.receipt-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function bindConfirmationStepButtons() {
    // زر عرض الفاتورة
    const viewReceiptBtn = document.getElementById('view-receipt');
    if (viewReceiptBtn) {
        // إزالة جميع المستمعات السابقة
        viewReceiptBtn.replaceWith(viewReceiptBtn.cloneNode(true));
        const newViewBtn = document.getElementById('view-receipt');
        newViewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showReceiptModal();
        });
    }

    // زر العودة للصفحة الرئيسية
    const homeBtn = document.getElementById('go-home');
    if (homeBtn) {
        homeBtn.replaceWith(homeBtn.cloneNode(true));
        const newHomeBtn = document.getElementById('go-home');
        newHomeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // مسح السلة وتحديث العداد
            localStorage.setItem('cart', '[]');
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
            window.location.href = 'index.html';
        });
    }

    // زر إغلاق النافذة المنبثقة
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.replaceWith(closeModalBtn.cloneNode(true));
        const newCloseBtn = document.querySelector('.close-modal');
        newCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeReceiptModal();
        });
    }

    // إغلاق النافذة عند النقر خارجها
    const modal = document.querySelector('.receipt-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeReceiptModal();
            }
        });
    }
}

// أعد الربط بعد كل خطوة
function initializeConfirmationStep() {
    createConfetti();
    bindConfirmationStepButtons();
    // Add event listeners for receipt modal
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.onclick = closeReceiptModal;
    }
    // Close modal when clicking outside
    const modal = document.querySelector('.receipt-modal');
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeReceiptModal();
            }
        };
    }
}

document.getElementById("confirm-order").addEventListener("click", function () {
    const formData = new FormData();
    formData.append("name", document.getElementById("full-name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append("address", document.getElementById("address").value);
    formData.append("city", document.getElementById("city").value);
    formData.append("deliveryMethod", document.querySelector('input[name="delivery"]:checked').value);

    const orderItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const itemsText = orderItems.map(item => `${item.name} (x${item.quantity})`).join(", ");
    formData.append("items", itemsText);
    formData.append("subtotal", document.getElementById("subtotal").textContent.replace('$', ''));
    formData.append("shipping", document.getElementById("shipping").textContent.replace('$', ''));
    formData.append("total", document.getElementById("grand-total").textContent.replace('$', ''));

    fetch("https://script.google.com/macros/s/AKfycbyhE6ThjBoKZK9tulx9PMZuqZEOnIHuSgseVS5DDNj61ZceXM-PyFH1IOvRzOdFbyS2Ww/exec", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        console.log("تم الإرسال إلى Google Sheet:", data);
        document.querySelector("#step5").classList.remove("hidden");
    })
    .catch(err => {
        console.error("خطأ في الإرسال إلى Google Sheets:", err);
    });
});
