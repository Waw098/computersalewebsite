document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const purchaseConfirmation = document.getElementById('purchase-confirmation');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        // The global updateCartCount function should be available
        window.updateCartCount();
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = ''; // Clear existing items
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalPrice.textContent = '$0.00';
            checkoutButton.disabled = true;
            purchaseConfirmation.style.display = 'none'; // Hide confirmation if cart is empty
            return;
        }

        checkoutButton.disabled = false;

        cart.forEach((item, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.image || 'placeholder.png'}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">$${(parseFloat(item.price || 0) * parseInt(item.quantity || 0)).toFixed(2)}</p> <!-- Display total price per item -->
                    <div class="quantity-control">
                        <button class="quantity-minus" data-index="${index}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-plus" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-item-btn" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);

            total += parseFloat(item.price || 0) * parseInt(item.quantity || 0);
        });

        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        addCartEventListeners();
    };

    const addCartEventListeners = () => {
        document.querySelectorAll('.quantity-minus').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    // If quantity is 1 and minus is clicked, remove the item
                    cart.splice(index, 1); 
                }
                saveCart();
                renderCart();
            });
        });

        document.querySelectorAll('.quantity-plus').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                cart[index].quantity++;
                saveCart();
                renderCart();
            });
        });

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                cart.splice(index, 1); // Remove item from cart array
                saveCart();
                renderCart();
            });
        });
    };

    checkoutButton.addEventListener('click', () => {
        alert('Simulating checkout...');
        
        cart = []; // Clear cart
        saveCart(); // Save empty cart to localStorage
        renderCart(); // Re-render to show empty cart
        
        purchaseConfirmation.style.display = 'block'; // Show confirmation message
        checkoutButton.style.display = 'none'; // Hide checkout button
    });

    // Initial render and cart count update when page loads
    renderCart();
});