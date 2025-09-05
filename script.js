// script.js
// NORI - Digital Portfolio Development
// Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

/**
 * Initialize the application
 */
function initApp() {
    // Initialize all components
    initPreloader();
    initMobileMenu();
    initScrollAnimations();
    initCartSystem();
    initSmoothScrolling();
    initModalSystem();
    initNotificationModal();
    initFormValidation();
    initLoadingState();
    initDynamicPricing();
    initTypingAnimation(); // <-- PENAMBAHAN: Memanggil fungsi animasi ketik

    // Check for saved cart items in localStorage
    loadCartFromStorage();
    
    // Update cart UI on initial load
    updateCartUI();
    
    console.log('NORI Website initialized successfully');
}


/**
 * PENAMBAHAN: Typing Animation Functionality
 */
function initTypingAnimation() {
    const typingTextEl = document.getElementById('typing-text');
    if (!typingTextEl) return;

    const words = ["Desain Modern", "Kode Bersih", "Responsif Cepat", "Harga Terjangkau"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150;
    const deletingSpeed = 75;
    const delayBetweenWords = 2000;

    function type() {
        const currentWord = words[wordIndex];
        let displayText = '';

        if (isDeleting) {
            // Hapus karakter
            displayText = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Tambah karakter
            displayText = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        typingTextEl.textContent = displayText;
        typingTextEl.classList.add('animate-typing');

        let timeout = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            // Jeda setelah selesai mengetik kata
            timeout = delayBetweenWords;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
             // Jeda sebelum mengetik kata baru
            timeout = 500;
        }

        setTimeout(type, timeout);
    }

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

    // Hide preloader after 1.5 seconds
    setTimeout(() => {
        preloader.classList.add('opacity-0');
        
        preloader.addEventListener('transitionend', (e) => {
            if (e.target === preloader) {
                preloader.style.display = 'none';
                contentWrapper.classList.remove('opacity-0');

                revealElements.forEach(el => {
                    el.classList.add('revealed');
                });
            }
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

    notificationButton.addEventListener('click', () => {
        openModal(notificationModal);
        notificationDot.classList.add('hidden');
    });

    closeNotificationButton.addEventListener('click', () => {
        closeModal(notificationModal);
    });

    notificationModal.addEventListener('click', (e) => {
        if (e.target === notificationModal) {
            closeModal(notificationModal);
        }
    });
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

    function toggleMobileMenu() {
        mobileMenu.classList.toggle('translate-x-full');
        mobileMenuOverlay.classList.toggle('hidden');
        
        setTimeout(() => {
            mobileMenuOverlay.classList.toggle('opacity-0');
        }, 10);
        
        mobileMenuButton.classList.toggle('hamburger-active');
    }

    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('translate-x-full')) {
                toggleMobileMenu();
            }
        });
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const fadeSections = document.querySelectorAll('.fade-in-section');
    
    if (fadeSections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        fadeSections.forEach(section => {
            observer.observe(section);
        });
    }
    
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Smooth Scrolling for Navigation Links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Cart System (UPDATED)
 */
let cart = [];
const products = {
    1: { 
        name: 'Source Code Template', 
        basePrice: 50000,
    },
    2: { 
        name: 'Web Portofolio Complete', 
        hostingPrices: {
            '3-bulan': 60000,
            '6-bulan': 65000,
            '1-tahun': 70000
        },
        featurePrice: 2500
    },
    3: { 
        name: 'Update Portofolio', 
        basePrice: 10000,
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
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeModal(cartModal);
            }
        });
    }
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', processCheckout);
    }
    
    loadCartFromStorage();
}

/**
 * Dynamic Pricing for "Web Portofolio Complete" (NEW)
 */
function initDynamicPricing() {
    const hostingSelect = document.getElementById('hosting-choice');
    const featureCheckboxes = document.querySelectorAll('.custom-feature');
    const priceDisplay = document.querySelector('#produk .grid > div:nth-child(2) .text-3xl');

    function updateCompletePortfolioPrice() {
        if (!hostingSelect || !priceDisplay) return;

        const selectedHosting = hostingSelect.value;
        const hostingPrice = products[2].hostingPrices[selectedHosting] || 0;
        
        const selectedFeaturesCount = document.querySelectorAll('.custom-feature:checked').length;
        const featuresPrice = selectedFeaturesCount * products[2].featurePrice;
        
        const totalPrice = hostingPrice + featuresPrice;
        
        priceDisplay.textContent = formatRupiah(totalPrice);
    }

    if (hostingSelect) {
       hostingSelect.addEventListener('change', updateCompletePortfolioPrice);
    }
    
    featureCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCompletePortfolioPrice);
    });

    // Initial price calculation on load
    updateCompletePortfolioPrice();
}

/**
 * Calculate the total price for a product based on selected options (NEW)
 */
function calculateProductPrice(productId) {
    const product = products[productId];
    if (!product) return 0;
    
    if (productId === 2) { // Web Portofolio Complete
        const hostingSelect = document.getElementById('hosting-choice');
        const selectedHosting = hostingSelect ? hostingSelect.value : '3-bulan';
        const hostingPrice = product.hostingPrices[selectedHosting] || 0;
        
        const selectedFeaturesCount = document.querySelectorAll('.custom-feature:checked').length;
        const featuresPrice = selectedFeaturesCount * product.featurePrice;
        
        return hostingPrice + featuresPrice;
    }
    
    // For other products, return the base price
    return product.basePrice;
}

/**
 * Add product to cart (UPDATED)
 */
function addToCart(productId) {
    const product = products[productId];
    if (!product) {
        console.error('Product not found:', productId);
        showToast('Produk tidak ditemukan', 'error');
        return;
    }
    
    let customizations = {};
    const price = calculateProductPrice(productId);
    
    if (productId === 1) {
        const templateRadio = document.querySelector('input[name="template-choice"]:checked');
        if (templateRadio) {
            customizations.Template = templateRadio.value;
        }
    } else if (productId === 2) {
        const hostingSelect = document.getElementById('hosting-choice');
        const warnaSelect = document.getElementById('warna-choice');
        const featureCheckboxes = document.querySelectorAll('.custom-feature:checked');
        
        if (hostingSelect) {
            customizations.Hosting = hostingSelect.options[hostingSelect.selectedIndex].text;
        }
        
        if (warnaSelect) {
            customizations.Warna = warnaSelect.value;
        }
        
        const features = Array.from(featureCheckboxes).map(cb => cb.value);
        if (features.length > 0) {
            customizations.Fitur = features.join(', ');
        }
    }
    
    cart.push({
        id: productId,
        name: product.name,
        price: price,
        quantity: 1,
        customizations: customizations
    });
    
    saveCartToStorage();
    updateCartUI();
    showToast('Produk berhasil ditambahkan ke keranjang', 'success');
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartUI();
        showToast('Produk dihapus dari keranjang', 'info');
    }
}

function updateQuantity(index, change) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += change;
        
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        
        saveCartToStorage();
        updateCartUI();
    }
}

function setQuantity(index, value) {
    const quantity = parseInt(value, 10);
    
    if (index >= 0 && index < cart.length && quantity > 0) {
        cart[index].quantity = quantity;
        saveCartToStorage();
        updateCartUI();
    }
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountEl = document.getElementById('cart-count');
    const emptyCartMsg = document.getElementById('empty-cart-message');
    const checkoutButton = document.getElementById('checkout-button');
    const customerForm = document.getElementById('customer-data-form');
    const ticketNumberEl = document.getElementById('ticket-number');
    
    if (!cartContainer) return;
    
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        if (emptyCartMsg) {
            emptyCartMsg.classList.remove('hidden');
            cartContainer.appendChild(emptyCartMsg);
        }
        if (customerForm) customerForm.classList.add('hidden');
        if (checkoutButton) checkoutButton.disabled = true;
    } else {
        if (emptyCartMsg) emptyCartMsg.classList.add('hidden');
        if (customerForm) customerForm.classList.remove('hidden');
        if (checkoutButton) checkoutButton.disabled = false;
        
        if (ticketNumberEl && !ticketNumberEl.textContent) {
            ticketNumberEl.textContent = `NORI-${Date.now()}`;
        }
        
        cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'flex justify-between items-start mb-4 pb-4 border-b border-slate-700';
            
            let detailsHTML = `<h4 class="font-bold text-white">${item.name}</h4>`;
            
            if (Object.keys(item.customizations).length > 0) {
                detailsHTML += '<div class="text-xs text-slate-400 mt-1">';
                for (const key in item.customizations) {
                    detailsHTML += `<span><strong>${key}:</strong> ${item.customizations[key]}</span><br>`;
                }
                detailsHTML += '</div>';
            }
            
            itemEl.innerHTML = `
                <div class="flex-grow pr-4">
                    ${detailsHTML}
                    <p class="text-cyan-400 font-semibold mt-2">${formatRupiah(item.price)}</p>
                </div>
                <div class="text-right">
                    <div class="flex items-center border border-slate-600 rounded-md mb-2">
                        <button onclick="updateQuantity(${index}, -1)" class="px-2 py-1 text-white hover:bg-slate-600 rounded-l-md transition-colors">-</button>
                        <input type="number" value="${item.quantity}" onchange="setQuantity(${index}, this.value)" class="w-12 text-center bg-transparent border-none text-white focus:outline-none">
                        <button onclick="updateQuantity(${index}, 1)" class="px-2 py-1 text-white hover:bg-slate-600 rounded-r-md transition-colors">+</button>
                    </div>
                    <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-400 text-xs transition-colors">Hapus</button>
                </div>
            `;
            
            cartContainer.appendChild(itemEl);
        });
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalEl) {
        cartTotalEl.textContent = formatRupiah(total);
    }
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
        cartCountEl.classList.toggle('hidden', totalItems === 0);
        cartCountEl.classList.toggle('scale-0', totalItems === 0);
        cartCountEl.classList.toggle('flex', totalItems > 0);
        cartCountEl.classList.toggle('scale-100', totalItems > 0);
    }
}

function processCheckout() {
    const customerName = document.getElementById('customer-name');
    const customerEmail = document.getElementById('customer-email');
    const ticketNumber = document.getElementById('ticket-number');
    
    if (!customerName || !customerName.value.trim()) {
        showToast('Mohon isi nama lengkap', 'error');
        customerName.focus();
        return;
    }
    
    if (!customerEmail || !customerEmail.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.value)) {
        showToast('Mohon isi alamat email yang valid', 'error');
        customerEmail.focus();
        return;
    }
    
    const phoneNumber = '6281396815717';
    let message = `Halo NORI, saya ingin memesan:\n\n`;
    message += `*Nomor Tiket: ${ticketNumber.textContent}*\n`;
    message += `*Nama: ${customerName.value.trim()}*\n`;
    message += `*Email: ${customerEmail.value.trim()}*\n`;
    message += `-----------------------------------\n\n`;
    
    let total = 0;
    cart.forEach(item => {
        message += `*${item.quantity}x - ${item.name}*\n`;
        if (Object.keys(item.customizations).length > 0) {
            for (const key in item.customizations) {
                message += `  - ${key}: ${item.customizations[key]}\n`;
            }
        }
        message += `  _Subtotal: ${formatRupiah(item.price * item.quantity)}_\n\n`;
        total += item.price * item.quantity;
    });
    
    message += `-----------------------------------\n`;
    message += `*TOTAL PESANAN: ${formatRupiah(total)}*\n\n`;
    message += `Mohon informasikan langkah selanjutnya untuk pembayaran. Terima kasih.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    showToast('Pesanan berhasil dibuat!', 'success');
    
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) closeModal(cartModal);
    
    cart = [];
    saveCartToStorage();
    updateCartUI();
    
    if (customerName) customerName.value = '';
    if (customerEmail) customerEmail.value = '';
    if (ticketNumber) ticketNumber.textContent = '';
}

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
}

/**
 * Modal System
 */
function initModalSystem() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal:not(.hidden)').forEach(closeModal);
        }
    });
}

function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.bg-slate-800')?.classList.remove('scale-95');
    }, 10);
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('opacity-0');
    modal.querySelector('.bg-slate-800')?.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

/**
 * Form Validation
 */
function initFormValidation() {
    const customerName = document.getElementById('customer-name');
    const customerEmail = document.getElementById('customer-email');
    
    if (customerName) {
        customerName.addEventListener('input', () => {
            validateField(customerName, /^[a-zA-Z\s]{3,}$/, 'Nama minimal 3 karakter');
        });
    }
    
    if (customerEmail) {
        customerEmail.addEventListener('input', () => {
            validateField(customerEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format email tidak valid');
        });
    }
}

function validateField(field, regex, errorMessage) {
    if (!field) return;
    const isValid = regex.test(field.value.trim());
    field.classList.toggle('border-green-500', isValid && field.value.trim() !== '');
    field.classList.toggle('border-red-500', !isValid && field.value.trim() !== '');
}

/**
 * Toast Notification System
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const toastIcon = toast.querySelector('i');
    const toastMessage = toast.querySelector('p');

    toast.className = toast.className.replace(/bg-\w+-500/, ''); // Remove old color
    if (type === 'error') {
        toast.classList.add('bg-red-500');
        toastIcon.className = 'fas fa-exclamation-circle';
    } else {
        toast.classList.add('bg-green-500');
        toastIcon.className = 'fas fa-check-circle';
    }

    toastMessage.textContent = message;
    toast.classList.remove('translate-x-[120%]');

    setTimeout(() => {
        toast.classList.add('translate-x-[120%]');
    }, 3000);
}

function initLoadingState() {
    // Future implementation for loading states
}

function showLoading() {
    document.getElementById('loading-spinner')?.classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-spinner')?.classList.add('hidden');
}

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
        }
    }
}

// Make functions available globally for HTML onclick attributes
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.setQuantity = setQuantity;
