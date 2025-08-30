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
    initMobileMenu();
    initScrollAnimations();
    initCartSystem();
    initSmoothScrolling();
    initModalSystem();
    initFormValidation();
    initLoadingState();
    
    // Check for saved cart items in localStorage
    loadCartFromStorage();
    
    // Update cart UI on initial load
    updateCartUI();
    
    console.log('NORI Website initialized successfully');
}

/**
 * Mobile Menu Functionality (Updated for Side Panel)
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Guard clause to ensure elements exist
    if (!mobileMenuButton || !mobileMenu || !mobileMenuOverlay) return;

    function toggleMobileMenu() {
        mobileMenu.classList.toggle('translate-x-full'); // Slides menu in/out from the right
        mobileMenuOverlay.classList.toggle('hidden'); // Shows/hides the dark overlay
        
        // Animate overlay opacity for a fade-in/out effect
        setTimeout(() => {
            mobileMenuOverlay.classList.toggle('opacity-0');
        }, 10);
        
        mobileMenuButton.classList.toggle('hamburger-active'); // Animates the hamburger icon to an 'X'
    }

    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu); // Close menu when clicking on the overlay

    // Close mobile menu when a navigation link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Check if the menu is currently open before trying to close it
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
        // Create Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe all fade sections
        fadeSections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Header scroll effect
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
 * Cart System
 */
let cart = [];
const products = {
    1: { 
        name: 'Source Code Template', 
        basePrice: 50000,
        customizations: {}
    },
    2: { 
        name: 'Web Portofolio Complete', 
        basePrice: 75000,
        customizations: {}
    },
    3: { 
        name: 'Update Portofolio', 
        basePrice: 15000,
        customizations: {}
    }
};

function initCartSystem() {
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeCartButton = document.getElementById('close-cart-button');
    const checkoutButton = document.getElementById('checkout-button');
    
    // Open cart modal
    if (cartButton && cartModal) {
        cartButton.addEventListener('click', function() {
            openModal(cartModal);
        });
    }
    
    // Close cart modal
    if (closeCartButton) {
        closeCartButton.addEventListener('click', function() {
            closeModal(cartModal);
        });
    }
    
    // Close modal when clicking outside
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeModal(cartModal);
            }
        });
    }
    
    // Checkout functionality
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            processCheckout();
        });
    }
    
    // Initialize cart from localStorage if available
    const savedCart = localStorage.getItem('noriCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

/**
 * Add product to cart
 * @param {number} productId - ID of the product to add
 */
function addToCart(productId) {
    if (!products[productId]) {
        console.error('Product not found:', productId);
        showToast('Produk tidak ditemukan', 'error');
        return;
    }
    
    // Get product customizations based on type
    let customizations = {};
    
    if (productId === 1) {
        // Source Code Template
        const templateSelect = document.getElementById('template-choice');
        if (templateSelect) {
            customizations.Template = templateSelect.value;
        }
    } else if (productId === 2) {
        // Web Portfolio Complete
        const temaRadios = document.querySelectorAll('input[name="tema"]');
        const warnaSelect = document.getElementById('warna-choice');
        const modeRadios = document.querySelectorAll('input[name="mode"]');
        const featureCheckboxes = document.querySelectorAll('.custom-feature:checked');
        
        // Get selected tema
        temaRadios.forEach(radio => {
            if (radio.checked) {
                customizations.Tema = radio.value;
            }
        });
        
        // Get selected warna
        if (warnaSelect) {
            customizations.Warna = warnaSelect.value;
        }
        
        // Get selected mode
        modeRadios.forEach(radio => {
            if (radio.checked) {
                customizations.Mode = radio.value;
            }
        });
        
        // Get selected features
        const features = Array.from(featureCheckboxes).map(cb => cb.value);
        if (features.length > 0) {
            customizations.Fitur = features.join(', ');
        }
    }
    
    // Add product to cart
    cart.push({
        id: productId,
        name: products[productId].name,
        price: products[productId].basePrice,
        quantity: 1,
        customizations: customizations
    });
    
    // Save to localStorage
    saveCartToStorage();
    
    // Update UI
    updateCartUI();
    
    // Show success message
    showToast('Produk berhasil ditambahkan ke keranjang', 'success');
}

/**
 * Remove item from cart
 * @param {number} index - Index of the item to remove
 */
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartUI();
        showToast('Produk dihapus dari keranjang', 'info');
    }
}

/**
 * Update item quantity in cart
 * @param {number} index - Index of the item to update
 * @param {number} change - Change in quantity (positive or negative)
 */
function updateQuantity(index, change) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += change;
        
        // Ensure quantity is at least 1
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        
        saveCartToStorage();
        updateCartUI();
    }
}

/**
 * Set item quantity in cart
 * @param {number} index - Index of the item to update
 * @param {number} value - New quantity value
 */
function setQuantity(index, value) {
    const quantity = parseInt(value, 10);
    
    if (index >= 0 && index < cart.length && quantity > 0) {
        cart[index].quantity = quantity;
        saveCartToStorage();
        updateCartUI();
    }
}

/**
 * Update cart UI
 */
function updateCartUI() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountEl = document.getElementById('cart-count');
    const emptyCartMsg = document.getElementById('empty-cart-message');
    const checkoutButton = document.getElementById('checkout-button');
    const customerForm = document.getElementById('customer-data-form');
    const ticketNumberEl = document.getElementById('ticket-number');
    
    if (!cartContainer) return;
    
    // Clear current items
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        if (emptyCartMsg) {
            emptyCartMsg.classList.remove('hidden');
            cartContainer.appendChild(emptyCartMsg);
        }
        
        // Hide customer form and disable checkout
        if (customerForm) customerForm.classList.add('hidden');
        if (checkoutButton) checkoutButton.disabled = true;
    } else {
        // Hide empty cart message
        if (emptyCartMsg) emptyCartMsg.classList.add('hidden');
        
        // Show customer form and enable checkout
        if (customerForm) customerForm.classList.remove('hidden');
        if (checkoutButton) checkoutButton.disabled = false;
        
        // Generate ticket number if not exists
        if (ticketNumberEl) {
            if (!ticketNumberEl.textContent) {
                ticketNumberEl.textContent = `NORI-${Date.now()}`;
            }
        }
        
        // Add items to cart UI
        cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'flex justify-between items-start mb-4 pb-4 border-b border-slate-700';
            
            let detailsHTML = `<h4 class="font-bold text-white">${item.name}</h4>`;
            
            // Add customization details if any
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
    
    // Update total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalEl) {
        cartTotalEl.textContent = formatRupiah(total);
    }
    
    // Update cart count badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCountEl.classList.remove('hidden', 'scale-0');
            cartCountEl.classList.add('flex', 'scale-100');
        } else {
            cartCountEl.classList.add('scale-0');
            cartCountEl.classList.remove('scale-100');
        }
    }
}

/**
 * Process checkout
 */
function processCheckout() {
    const customerName = document.getElementById('customer-name');
    const customerEmail = document.getElementById('customer-email');
    const ticketNumber = document.getElementById('ticket-number');
    
    // Validate form
    if (!customerName || !customerName.value.trim()) {
        showToast('Mohon isi nama lengkap', 'error');
        customerName.focus();
        return;
    }
    
    if (!customerEmail || !customerEmail.value.trim()) {
        showToast('Mohon isi alamat email', 'error');
        customerEmail.focus();
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail.value)) {
        showToast('Mohon isi alamat email yang valid', 'error');
        customerEmail.focus();
        return;
    }
    
    // Generate WhatsApp message
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
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Show success message
    showToast('Pesanan berhasil dibuat! Silakan lanjutkan pembayaran di WhatsApp.', 'success');
    
    // Close cart modal
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        closeModal(cartModal);
    }
    
    // Clear cart after successful checkout
    cart = [];
    saveCartToStorage();
    updateCartUI();
    
    // Clear form fields
    if (customerName) customerName.value = '';
    if (customerEmail) customerEmail.value = '';
    if (ticketNumber) ticketNumber.textContent = '';
}

/**
 * Format number to Rupiah currency
 * @param {number} number - Number to format
 * @returns {string} Formatted currency string
 */
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
    // Close modals when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal:not(.hidden)');
            openModals.forEach(modal => {
                closeModal(modal);
            });
        }
    });
}

/**
 * Open modal
 * @param {HTMLElement} modal - Modal element to open
 */
function openModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('hidden');
    
    // Trigger reflow for animation
    void modal.offsetWidth;
    
    modal.classList.remove('opacity-0');
    const modalContent = modal.querySelector('.bg-slate-800'); // Target the actual content div
    if (modalContent) {
        modalContent.classList.remove('scale-95');
    }
    
    // Disable body scrolling
    document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 * @param {HTMLElement} modal - Modal element to close
 */
function closeModal(modal) {
    if (!modal) return;
    
    modal.classList.add('opacity-0');
    const modalContent = modal.querySelector('.bg-slate-800'); // Target the actual content div
    if (modalContent) {
        modalContent.classList.add('scale-95');
    }
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        modal.classList.add('hidden');
        
        // Enable body scrolling
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
        customerName.addEventListener('input', function() {
            validateField(this, /^[a-zA-Z\s]{3,}$/, 'Nama minimal 3 karakter dan hanya boleh berisi huruf');
        });
    }
    
    if (customerEmail) {
        customerEmail.addEventListener('input', function() {
            validateField(this, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Format email tidak valid');
        });
    }
}

/**
 * Validate form field
 * @param {HTMLElement} field - Field to validate
 * @param {RegExp} regex - Regular expression for validation
 * @param {string} errorMessage - Error message to show
 */
function validateField(field, regex, errorMessage) {
    if (!field) return;
    
    const isValid = regex.test(field.value.trim());
    
    if (field.value.trim() === '') {
        field.classList.remove('border-green-500', 'border-red-500');
    } else if (isValid) {
        field.classList.remove('border-red-500');
        field.classList.add('border-green-500');
    } else {
        field.classList.remove('border-green-500');
        field.classList.add('border-red-500');
        
        // Show error tooltip on focus loss
        field.addEventListener('blur', function() {
            if (!regex.test(this.value.trim()) && this.value.trim() !== '') {
                showToast(errorMessage, 'error');
            }
        });
    }
}

/**
 * Toast Notification System
 */
function initToast() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(toastContainer);
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 */
function showToast(message, type = 'success') {
    initToast();
    
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Set toast classes based on type
    let toastClasses = 'px-4 py-3 rounded-lg shadow-lg text-white flex items-center transform transition-all duration-300 translate-x-full';
    let icon = '';
    
    switch (type) {
        case 'success':
            toastClasses += ' bg-green-500';
            icon = '<i class="fas fa-check-circle mr-2"></i>';
            break;
        case 'error':
            toastClasses += ' bg-red-500';
            icon = '<i class="fas fa-exclamation-circle mr-2"></i>';
            break;
        case 'warning':
            toastClasses += ' bg-yellow-500';
            icon = '<i class="fas fa-exclamation-triangle mr-2"></i>';
            break;
        case 'info':
            toastClasses += ' bg-blue-500';
            icon = '<i class="fas fa-info-circle mr-2"></i>';
            break;
        default:
            toastClasses += ' bg-gray-500';
            icon = '<i class="fas fa-bell mr-2"></i>';
    }
    
    toast.className = toastClasses;
    toast.innerHTML = `${icon}${message}`;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

/**
 * Loading State Management
 */
function initLoadingState() {
    // You can implement loading states for API calls or heavy operations
}

/**
 * Show loading spinner
 */
function showLoading() {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.classList.remove('hidden');
    }
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.classList.add('hidden');
    }
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage() {
    localStorage.setItem('noriCart', JSON.stringify(cart));
}

/**
 * Load cart from localStorage
 */
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