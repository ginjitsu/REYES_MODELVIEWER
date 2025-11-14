// Product Data
const products = {
    carousel: {
        name: 'Carousel',
        description: 'Vintage carousel model with intricate details. Perfect for architectural visualization, game development, or 3D rendering projects. Includes high-resolution textures and optimized geometry.',
        price: 29.99,
        file: 'assets/carousel.glb',
        specs: {
            format: 'GLB',
            polygons: 'High Quality',
            textures: 'Included'
        }
    },
    circus: {
        name: 'Circus',
        description: 'Classic circus tent model with vibrant colors and detailed fabric simulation. Ideal for creating nostalgic scenes or carnival-themed environments. Fully textured and ready to use.',
        price: 34.99,
        file: 'assets/circus.glb',
        specs: {
            format: 'GLB',
            polygons: 'High Quality',
            textures: 'Included'
        }
    },
    lantern: {
        name: 'Lantern',
        description: 'Elegant lantern model with realistic lighting effects. Features detailed metalwork and glass elements. Perfect for ambient lighting in scenes or as a decorative element.',
        price: 24.99,
        file: 'assets/lanterm.glb',
        specs: {
            format: 'GLB',
            polygons: 'High Quality',
            textures: 'Included'
        }
    }
};

// Cart State
let cart = [];

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const addToCartBtn = document.getElementById('addToCartBtn');
const productCards = document.querySelectorAll('.product-card');
const viewerContainer = document.getElementById('viewerContainer');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

// Current selected product
let currentProduct = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadCart();
    updateCartUI();
});

// Event Listeners
function initializeEventListeners() {
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking on backdrop
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                // Check if click is outside the menu
                const isClickInsideMenu = navLinks.contains(e.target);
                const isClickOnToggle = mobileMenuToggle.contains(e.target);
                
                if (!isClickInsideMenu && !isClickOnToggle) {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    // Cart toggle
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        // Close mobile menu if open
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        }
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // Close cart when clicking outside
    cartSidebar.addEventListener('click', (e) => {
        if (e.target === cartSidebar) {
            cartSidebar.classList.remove('active');
        }
    });

    // Product card clicks
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.product;
            openProductModal(productId);
        });
    });

    // Modal close
    closeModal.addEventListener('click', () => {
        closeProductModal();
    });

    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });

    // Add to cart
    addToCartBtn.addEventListener('click', () => {
        if (currentProduct) {
            addToCart(currentProduct);
        }
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            handleCheckout();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
            cartSidebar.classList.remove('active');
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

// Product Modal Functions
function openProductModal(productId) {
    const product = products[productId];
    if (!product) return;

    currentProduct = productId;

    // Update modal content
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;

    // Update specs
    const specItems = document.querySelectorAll('.spec-item');
    specItems[0].querySelector('.spec-value').textContent = product.specs.format;
    specItems[1].querySelector('.spec-value').textContent = product.specs.polygons;
    specItems[2].querySelector('.spec-value').textContent = product.specs.textures;

    // Load 3D model (placeholder for now - you can integrate Three.js or similar)
    load3DModel(product.file);

    // Show modal
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clean up model-viewer to prevent memory leaks
    const modelViewer = viewerContainer.querySelector('model-viewer');
    if (modelViewer) {
        modelViewer.remove();
    }
    
    currentProduct = null;
}

function load3DModel(filePath) {
    const product = products[currentProduct];
    const productName = product ? product.name : '3D Model';
    
    // Create model-viewer element with full interactive controls and AR
    viewerContainer.innerHTML = `
        <model-viewer 
            src="${filePath}" 
            alt="${productName} 3D Model"
            auto-rotate
            auto-rotate-delay="0"
            camera-controls
            touch-action="none"
            interaction-policy="allow-when-focused"
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="auto"
            ar-placement="floor"
            shadow-intensity="1"
            exposure="1"
            environment-image="neutral"
            style="width: 100%; height: 100%; border-radius: 0; background: #fafafa;"
        >
            <div slot="poster" class="viewer-loading">
                <div class="loading-spinner"></div>
                <p>Loading 3D Model...</p>
            </div>
            <button slot="ar-button" class="ar-button">
                View in AR
            </button>
        </model-viewer>
    `;
}

// Cart Functions
function addToCart(productId) {
    const product = products[productId];
    if (!product) return;

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showAddToCartAnimation();
    
    // Close modal after adding
    setTimeout(() => {
        closeProductModal();
    }, 500);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = `(${totalItems})`;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.3;">
                        <box width="20" height="20" depth="20" />
                    </svg>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function showAddToCartAnimation() {
    addToCartBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        addToCartBtn.style.transform = '';
    }, 200);
}

function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `Checkout\n\nItems: ${cart.length}\nTotal: $${total.toFixed(2)}\n\nThank you for your purchase!`;
    
    alert(message);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    cartSidebar.classList.remove('active');
}

// Local Storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Smooth scrolling for anchor links
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

