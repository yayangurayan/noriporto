// script.js
// NORI - Digital Portfolio Development
// Main JavaScript File (Fully Updated & Corrected)

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

/**
 * Initialize all application components
 */
function initApp() {
    initPreloader();
    initThemeToggle();
    initMobileMenu();
    initScrollAnimations();
    initCartSystem();
    initSmoothScrolling();
    initModalSystem();
    initNotificationModal();
    initFormValidation();
    initTypingAnimation();
    initDynamicPricing(); // Handles all price calculations and displays

    loadCartFromStorage();
    updateCartUI();
    
    // Initial static price rendering for products without options
    renderStaticPrices();

    console.log('NORI Website initialized successfully');
}

/**
 * Light/Dark Theme Toggle Functionality
 */
function initThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const docElement = document.documentElement;

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        docElement.classList.add('dark');
    } else {
        docElement.classList.remove('dark');
    }

    themeToggleButton.addEventListener('click', () => {
        docElement.classList.toggle('dark');
        localStorage.theme = docElement.classList.contains('dark') ? 'dark' : 'light';
    });
}


/**
 * Typing Animation Functionality
 */
function initTypingAnimation() {
    const typingTextEl = document.getElementById('typing-text');
    if (!typingTextEl) return;

    const words = ["Desain Modern", "Kode Bersih", "Responsif Cepat", "Harga Terjangkau"];
    let wordIndex = 0, charIndex = 0, isDeleting = false;
    const type = () => {
        const currentWord = words[wordIndex];
        let displayText = isDeleting 
            ? currentWord.substring(0, charIndex--) 
            : currentWord.substring(0, charIndex++);
        
        typingTextEl.textContent = displayText;
        
        let timeout = isDeleting ? 75 : 150;

        if (!isDeleting && charIndex === currentWord.length + 1) {
            timeout = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            timeout = 500;
        }
        setTimeout(type, timeout);
    };
    type();
}

/**
 * Preloader and Entry Animation Functionality
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const contentWrapper = document.getElementById('content-wrapper');
    const revealElements = document.querySelectorAll('.reveal-on-load');

    if (!preloader || !contentWrapper) return;

    setTimeout(() => {
        preloader.classList.add('opacity-0');
        preloader.addEventListener('transitionend', () => {
            preloader.style.display = 'none';
            contentWrapper.classList.remove('opacity-0');
            revealElements.forEach(el => el.classList.add('revealed'));
        }, { once: true });
    }, 1500);
}

/**
 * Notification Modal Functionality
 */
function initNotificationModal() {
    const notificationButton = document.getElementById('notification-button');
    const notificationModal = document.getElementById('notification-modal');
    const closeNotificationButton = document.getElementById('close-notification-button');
    const notificationDot = document.getElementById('notification-dot');

    if (!notificationButton || !notificationModal || !closeNotificationButton || !notificationDot) return;

    const open = () => {
        openModal(notificationModal);
        notificationDot.classList.add('hidden');
    };
    const close = () => closeModal(notificationModal);

    notificationButton.addEventListener('click', open);
    closeNotificationButton.addEventListener('click', close);
    notificationModal.addEventListener('click', (e) => e.target === notificationModal && close());
}

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileMenuButton || !mobileMenu || !mobileMenuOverlay) return;

    const toggleMobileMenu = () => {
        const isActive = !mobileMenu.classList.contains('translate-x-full');
        mobileMenu.classList.toggle('translate-x-full');
        mobileMenuOverlay.classList.toggle('hidden', isActive);
        setTimeout(() => mobileMenuOverlay.classList.toggle('opacity-0', isActive), 10);
        mobileMenuButton.classList.toggle('hamburger-active');
    };

    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', toggleMobileMenu));
}

/**
 * Scroll Animations & Header State
 */
function initScrollAnimations() {
    const fadeSections = document.querySelectorAll('.fade-in-section');
    if (fadeSections.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        fadeSections.forEach(section => observer.observe(section));
    }
    
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }
}

/**
 * Smooth Scrolling for Navigation Links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================================================================
// CART SYSTEM & PRODUCT DATA
// ===================================================================================

let cart = [];
const DISCOUNT_RATE = 0.25; 

const products = {
    1: { 
        id: 1,
        name: 'Custom Portfolio (Source Code)', 
        basePrice: 49900,
    },
    2: { 
        id: 2,
        name: 'Web Portofolio Complete', 
        hostingPrices: {
            '3-bulan': 99900,
            '6-bulan': 139900,
            '1-tahun': 174900
        },
        featurePrice: 5000
    },
    3: { 
        id: 3,
        name: 'Revisi / Update Source Code', 
        basePrice: 7900,
    },
    4: {
        id: 4,
        name: 'Jasa Hosting Domain',
        durationPrices: {
            '1-bulan': 14900,
            '3-bulan': 24900,
            '6-bulan': 43900,
            '1-tahun': 79900
        }
    },
    5: {
        id: 5,
        name: 'Custom Website (Toko/Personal)',
        basePrice: 1000000
    }
};

function initCartSystem() {
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeCartButton = document.getElementById('close-cart-button');
    const checkoutButton = document.getElementById('checkout-button');
    
    if (cartButton && cartModal) {
        cartButton.addEventListener('click', () => openModal(cartModal));
    }
    if (closeCartButton) {
        closeCartButton.addEventListener('click', () => closeModal(cartModal));
    }
    if (cartModal) {
        cartModal.addEventListener('click', (e) => e.target === cartModal && closeModal(cartModal));
    }
    if (checkoutButton) {
        checkoutButton.addEventListener('click', processCheckout);
    }
}

function renderPrice(element, originalPrice) {
    if (!element) return;
    const discountedPrice = originalPrice * (1 - DISCOUNT_RATE);
    
    const originalPriceFormatted = formatRupiah(originalPrice);
    const discountedPriceFormatted = formatRupiah(discountedPrice);
    
    let priceHTML;
    // For premium products, use amber color, otherwise use cyan
    if (element.id === 'product-2-price-display' || element.id === 'product-5-price-display') {
        priceHTML = `
            <span class="text-xl text-slate-500 dark:text-slate-400 line-through">${originalPriceFormatted}</span>
            <span class="text-3xl font-bold text-amber-500 dark:text-amber-400 ml-2">${discountedPriceFormatted}</span>
        `;
    } else {
        priceHTML = `
            <span class="text-xl text-slate-500 dark:text-slate-400 line-through">${originalPriceFormatted}</span>
            <span class="text-3xl font-bold text-cyan-500 dark:text-cyan-400 ml-2">${discountedPriceFormatted}</span>
        `;
    }
    element.innerHTML = priceHTML;
}


function renderStaticPrices() {
    renderPrice(document.getElementById('product-1-price-display'), products[1].basePrice);
    renderPrice(document.getElementById('product-3-price-display'), products[3].basePrice);
    renderPrice(document.getElementById('product-5-price-display'), products[5].basePrice);
}

function initDynamicPricing() {
    const hostingSelect2 = document.getElementById('hosting-choice');
    const featureCheckboxes = document.querySelectorAll('.custom-feature');
    const priceDisplay2 = document.getElementById('product-2-price-display');

    function updateProduct2Price() {
        if (!hostingSelect2 || !priceDisplay2) return;
        const hostingPrice = products[2].hostingPrices[hostingSelect2.value] || 0;
        const featuresCount = document.querySelectorAll('.custom-feature:checked').length;
        const featuresPrice = featuresCount * products[2].featurePrice;
        const originalTotalPrice = hostingPrice + featuresPrice;
        renderPrice(priceDisplay2, originalTotalPrice);
    }
    if(hostingSelect2) {
        hostingSelect2.addEventListener('change', updateProduct2Price);
        featureCheckboxes.forEach(cb => cb.addEventListener('change', updateProduct2Price));
        updateProduct2Price();
    }

    const durationSelect4 = document.getElementById('hosting-duration-4');
    const priceDisplay4 = document.getElementById('product-4-price-display');

    function updateProduct4Price() {
        if (!durationSelect4 || !priceDisplay4) return;
        const originalPrice = products[4].durationPrices[durationSelect4.value] || 0;
        renderPrice(priceDisplay4, originalPrice);
    }
    if(durationSelect4) {
        durationSelect4.addEventListener('change', updateProduct4Price);
        updateProduct4Price();
    }
}

function calculateProductPrice(productId, options) {
    const product = products[productId];
    if (!product) return 0;
    
    let originalPrice = 0;
    switch(productId) {
        case 2:
            originalPrice = (product.hostingPrices[options.hosting] || 0) + (options.features.length * product.featurePrice);
            break;
        case 4:
            originalPrice = product.durationPrices[options.duration] || 0;
            break;
        default:
            originalPrice = product.basePrice;
    }
    return originalPrice * (1 - DISCOUNT_RATE);
}

function addToCart(productId) {
    const product = products[productId];
    if (!product) return showToast('Produk tidak ditemukan', 'error');
    
    let customizations = {};
    let options = {};
    
    if (productId === 2) {
        const hostingSelect = document.getElementById('hosting-choice');
        const warnaSelect = document.getElementById('warna-choice');
        const featureCheckboxes = document.querySelectorAll('.custom-feature:checked');
        
        options.hosting = hostingSelect.value;
        options.features = Array.from(featureCheckboxes).map(cb => cb.value);

        customizations.Hosting = hostingSelect.options[hostingSelect.selectedIndex].text;
        customizations.Warna = warnaSelect.value;
        if (options.features.length > 0) {
            customizations.Fitur = options.features.join(', ');
        }
    } else if (productId === 4) {
        const durationSelect = document.getElementById('hosting-duration-4');
        options.duration = durationSelect.value;
        customizations.Durasi = durationSelect.options[durationSelect.selectedIndex].text;
    }
    
    const price = calculateProductPrice(productId, options);
    
    cart.push({
        id: `${productId}-${Date.now()}`,
        productId: productId,
        name: product.name,
        price: price,
        quantity: 1,
        customizations: customizations
    });
    
    saveCartToStorage();
    updateCartUI();
    showToast('Produk berhasil ditambahkan!', 'success');
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCartToStorage();
    updateCartUI();
    showToast('Produk dihapus dari keranjang', 'info');
}

function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        saveCartToStorage();
        updateCartUI();
    }
}

function setQuantity(itemId, value) {
    const item = cart.find(item => item.id === itemId);
    const quantity = parseInt(value, 10);
    if (item && quantity > 0) {
        item.quantity = quantity;
        saveCartToStorage();
        updateCartUI();
    } else {
        updateCartUI();
    }
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    const emptyMsg = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-button');
    const customerForm = document.getElementById('customer-data-form');
    const ticketEl = document.getElementById('ticket-number');
    
    if (!container) return;
    
    // Clear previous items but keep the empty message element
    const items = container.querySelectorAll('.cart-item-dynamic');
    items.forEach(item => item.remove());

    if (cart.length === 0) {
        emptyMsg.classList.remove('hidden');
        customerForm.classList.add('hidden');
        checkoutBtn.disabled = true;
    } else {
        emptyMsg.classList.add('hidden');
        customerForm.classList.remove('hidden');
        checkoutBtn.disabled = false;
        
        if (ticketEl && !ticketEl.textContent) {
            ticketEl.textContent = `NORI-${Date.now().toString().slice(-6)}`;
        }
        
        cart.forEach((item) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item-dynamic flex justify-between items-start mb-4 pb-4 border-b border-slate-200 dark:border-slate-700';
            
            let detailsHTML = `<h4 class="font-bold text-slate-800 dark:text-white">${item.name}</h4>`;
            if (Object.keys(item.customizations).length > 0) {
                detailsHTML += '<div class="text-xs text-slate-500 dark:text-slate-400 mt-1">';
                for (const key in item.customizations) {
                    detailsHTML += `<span><strong>${key}:</strong> ${item.customizations[key]}</span><br>`;
                }
                detailsHTML += '</div>';
            }
            
            itemEl.innerHTML = `
                <div class="flex-grow pr-4">${detailsHTML}<p class="text-cyan-500 font-semibold mt-2">${formatRupiah(item.price)}</p></div>
                <div class="text-right">
                    <div class="flex items-center border border-slate-300 dark:border-slate-600 rounded-md mb-2">
                        <button onclick="updateQuantity('${item.id}', -1)" class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-l-md transition-colors">-</button>
                        <input type="number" value="${item.quantity}" onchange="setQuantity('${item.id}', this.value)" class="w-12 text-center bg-transparent border-none focus:outline-none">
                        <button onclick="updateQuantity('${item.id}', 1)" class="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-r-md transition-colors">+</button>
                    </div>
                    <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:text-red-400 text-xs transition-colors">Hapus</button>
                </div>
            `;
            container.appendChild(itemEl);
        });
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalEl.textContent = formatRupiah(total);
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalItems;
    countEl.classList.toggle('scale-0', totalItems === 0);
    countEl.classList.toggle('flex', totalItems > 0);
}


function processCheckout() {
    const customerName = document.getElementById('customer-name');
    const customerEmail = document.getElementById('customer-email');
    const customerNotes = document.getElementById('customer-notes');
    const ticketNumber = document.getElementById('ticket-number');
    
    if (!customerName.value.trim()) return showToast('Mohon isi nama lengkap', 'error');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.value)) return showToast('Mohon isi alamat email yang valid', 'error');
    
    const phoneNumber = '6281396815717';
    let message = `Halo NORI, saya ingin memesan (PROMO DISKON 25%):\n\n`;
    message += `*Nomor Tiket: ${ticketNumber.textContent}*\n`;
    message += `*Nama: ${customerName.value.trim()}*\n`;
    message += `*Email: ${customerEmail.value.trim()}*\n`;
    
    if (customerNotes.value.trim()) {
        message += `*Catatan: ${customerNotes.value.trim()}*\n`;
    }

    message += `-----------------------------------\n\n`;
    
    cart.forEach(item => {
        message += `*${item.quantity}x - ${item.name}*\n`;
        Object.entries(item.customizations).forEach(([key, value]) => {
            message += `  - ${key}: ${value}\n`;
        });
        message += `  _Subtotal: ${formatRupiah(item.price * item.quantity)}_\n\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `-----------------------------------\n`;
    message += `*TOTAL PESANAN: ${formatRupiah(total)}*\n\n`;
    message += `Mohon informasikan langkah selanjutnya. Terima kasih.`;
    
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
    
    showToast('Pesanan berhasil dibuat!', 'success');
    closeModal(document.getElementById('cart-modal'));
    
    cart = [];
    saveCartToStorage();
    updateCartUI();
    customerName.value = '';
    customerEmail.value = '';
    customerNotes.value = '';
    ticketNumber.textContent = '';
}

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
}

/**
 * Generic Modal System
 */
function initModalSystem() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.fixed.inset-0:not(.hidden)').forEach(closeModal);
        }
    });
}

function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform')?.classList.remove('scale-95');
    }, 10);
}

/**
 * PERBAIKAN BUG SCROLL: Replaced modal close logic with a more reliable and robust implementation.
 */
function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('opacity-0');
    modal.querySelector('.transform')?.classList.add('scale-95');
    
    // Set a timeout to hide the modal after the transition
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);

    // UNLOCK SCROLL IMMEDIATELY when the close process begins.
    // This is a more aggressive and reliable fix.
    document.body.style.overflow = '';
}

function initFormValidation() {
    // Basic form validation implementation
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const toastIcon = toast.querySelector('i');
    const toastMessage = toast.querySelector('p');
    toast.className = toast.className.replace(/bg-\w+-500/, '');
    if (type === 'error') {
        toast.classList.add('bg-red-500');
        toastIcon.className = 'fas fa-exclamation-circle';
    } else if (type === 'info') {
        toast.classList.add('bg-blue-500'); // Added for info toasts
        toastIcon.className = 'fas fa-info-circle';
    } else {
        toast.classList.add('bg-green-500');
        toastIcon.className = 'fas fa-check-circle';
    }
    toastMessage.textContent = message;
    toast.classList.remove('translate-x-[120%]');
    setTimeout(() => toast.classList.add('translate-x-[120%]'), 3000);
}

/**
 * Local Storage Functions
 */
function saveCartToStorage() {
    localStorage.setItem('noriCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('noriCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error parsing cart from localStorage:', e);
            cart = [];
            localStorage.removeItem('noriCart');
        }
    }
}

// Make functions available globally for HTML onclick attributes
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.setQuantity = setQuantity;
