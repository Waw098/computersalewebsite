// Function to update the cart count display in the header
window.updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        // Calculate total quantity, defaulting item.quantity to 0 if it's not a number
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        cartCountElement.textContent = totalItems;
        if (totalItems > 0) {
            cartCountElement.classList.add('count-bubble');
        } else {
            cartCountElement.classList.remove('count-bubble');
        }
    }
};

// Function to add item to cart
window.addToCart = (productToAdd) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === productToAdd.id);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity++;
    } else {
        // Add the product with quantity 1
        cart.push({ ...productToAdd, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productToAdd.name} has been added to your cart!`);
    window.updateCartCount(); // Update cart count after adding item
};

// --- Global Product Data ---
window.products = [
    // Specific Computer Models
    {
        id: '101',
        name: 'Alienware Aurora R15 Gaming Desktop',
        description: 'Unleash extreme gaming performance with Intel Core i9 and NVIDIA RTX 4090.',
        price: 3499.99,
        image: 'images/product1.jpg',
        category: 'desktop',
            brand: 'Alienware'
    },
    {
        id: '102',
        name: 'Dell XPS 15 Laptop',
        description: 'Sleek and powerful laptop for creativity and productivity, featuring a stunning OLED display.',
        price: 2199.00,
        image: 'images/product2.jpg',
        category: 'laptop',
            brand: 'Dell'
    },

    // Accessories
    {
        id: '201',
        name: 'Razer BlackWidow V3 Pro Mechanical Keyboard',
        description: 'Wireless mechanical gaming keyboard with Razer Green Mechanical Switches.',
        price: 229.99,
        image: 'images/product3.jpg',
        category: 'accessories',
            brand: 'Razer'
    },
    {
        id: '202',
        name: 'Logitech MX Master 3S Wireless Mouse',
        description: 'Advanced ergonomic mouse for ultimate precision and control.',
        price: 99.99,
        image: 'images/product4.jpg',
        category: 'accessories',
            brand: 'Logitech'
    },
    {
        id: '203',
        name: 'Samsung Odyssey G9 Neo Curved Gaming Monitor',
        description: 'Immersive 49-inch curved display with 240Hz refresh rate and Mini LED technology.',
        price: 1999.99,
        image: 'images/product5.jpg',
        category: 'accessories',
            brand: 'Samsung'
    }
];

// Helper to find a product by ID
window.findProductById = (id) => {
    return window.products.find(p => p.id === id);
};

// Function to render cart items on cart.html (defined globally for access from cart.html's DOMContentLoaded)
window.renderCart = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const purchaseConfirmation = document.getElementById('purchase-confirmation');
    
    // Get current cart state. Fallback to empty array if null.
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Set display for purchase confirmation
    if (purchaseConfirmation) {
        purchaseConfirmation.style.display = 'none';
    }

    if (!cartItemsContainer || !cartTotalPrice) { // Safety check if not on cart page
        return;
    }

    cartItemsContainer.innerHTML = ''; // Clear existing products
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        cartTotalPrice.textContent = '$0.00';
        if (checkoutButton) checkoutButton.disabled = true;
        return;
    }
    if (checkoutButton) checkoutButton.disabled = false; // Enable if cart has items

    cart.forEach((item, index) => {
        // Use findProductById to get full product details including original price and image for rendering
        const fullProduct = window.findProductById(item.id);
        const displayImage = fullProduct ? fullProduct.image : ('images/placeholder.png'); // Fallback image
        const displayPrice = fullProduct ? fullProduct.price : item.price; // Use original price from full product if available

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <img src="${displayImage}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">$${(displayPrice * item.quantity).toFixed(2)}</p>
                <div class="quantity-control">
                    <button class="quantity-minus" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item-btn" data-id="${item.id}">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
        total += displayPrice * item.quantity;
    });
    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
};

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    window.updateCartCount();

    // Handle header scroll effect
    const header = document.querySelector('header');
    const body = document.body;
    const scrollThreshold = 50; // Pixels to scroll before the header shrinks

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('header-scrolled');
            body.classList.add('header-scrolled-padding');
        } else {
            header.classList.remove('header-scrolled');
            body.classList.remove('header-scrolled-padding');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Also run on load to set initial state if page is loaded already scrolled
    
    // Cart page specific logic
    if (window.location.pathname.includes('cart.html')) {
        window.renderCart();

        const cartItemsContainer = document.getElementById('cart-items');
        const checkoutButton = document.getElementById('checkout-button');
        const purchaseConfirmation = document.getElementById('purchase-confirmation');

        // Event delegation for cart item interactions
        if (cartItemsContainer) {
            cartItemsContainer.addEventListener('click', (event) => {
                const target = event.target;
                const productId = target.dataset.id;
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const itemIndex = cart.findIndex(item => item.id === productId);

                if (itemIndex > -1) {
                    if (target.classList.contains('remove-item-btn')) {
                        cart.splice(itemIndex, 1);
                    } else if (target.classList.contains('quantity-minus')) {
                        if (cart[itemIndex].quantity > 1) {
                            cart[itemIndex].quantity--;
                        } else {
                            cart.splice(itemIndex, 1); // Remove if quantity goes to 0
                        }
                    } else if (target.classList.contains('quantity-plus')) {
                        cart[itemIndex].quantity++;
                    }
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                window.updateCartCount();
                window.renderCart(); // Re-render cart after changes
            });
        }
        
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                alert('Simulating checkout...');
                localStorage.removeItem('cart'); // Clear cart
                window.updateCartCount();
                if (purchaseConfirmation) {
                    purchaseConfirmation.style.display = 'block';
                }
                if (checkoutButton) {
                    checkoutButton.style.display = 'none';
                }
                window.renderCart(); // Re-render to show empty cart
            });
        }
    }
});
