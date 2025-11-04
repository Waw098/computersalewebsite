document.addEventListener('DOMContentLoaded', () => {
    // Ensure global product data is available
    if (!window.products) {
        console.error('Global product data not found. Ensure script.js is loaded.');
        return;
    }

    const productGrid = document.getElementById('product-grid');

    const renderProducts = (productsToRender) => {
        productGrid.innerHTML = ''; // Clear existing products
        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<p>No products found matching your criteria.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                </a>
                <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            `;
            productGrid.appendChild(productCard);
        });

        // Attach Add to Cart event listeners to new buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.productId;
                const productToAdd = window.findProductById(productId);
                if (productToAdd) {
                    window.addToCart({
                        id: productToAdd.id,
                        name: productToAdd.name,
                        price: productToAdd.price,
                        image: productToAdd.image // Pass image for cart display
                    });
                }
            });
        });
    };

    // Initial render of all products from global data
    renderProducts(window.products);

    // --- Search and Filter Logic ---

    // Search Bar
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');

    // Filter Elements
    const categoryFilter = document.getElementById('category');
    const priceRangeFilter = document.getElementById('price-range');
    const priceValueDisplay = document.getElementById('price-value');
    const brandFilter = document.getElementById('brand');
    const applyFiltersButton = document.querySelector('.apply-filters');

    // Update price display as range slider moves
    if (priceRangeFilter && priceValueDisplay) {
        priceValueDisplay.textContent = `$${priceRangeFilter.value}`;
        priceRangeFilter.addEventListener('input', () => {
            priceValueDisplay.textContent = `$${priceRangeFilter.value}`;
        });
    }

    const applySearchAndFilters = () => {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const maxPrice = parseFloat(priceRangeFilter.value);
        const searchBrand = brandFilter.value.toLowerCase();

        const filteredProducts = window.products.filter(product => {
            const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm) ||
                                      product.description.toLowerCase().includes(searchTerm);

            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

            const matchesPrice = product.price <= maxPrice;

            const matchesBrand = searchBrand === '' || product.brand.toLowerCase().includes(searchBrand);

            return matchesSearchTerm && matchesCategory && matchesPrice && matchesBrand;
        });

        renderProducts(filteredProducts);
    };

    // Event Listeners for search and filter
    if (searchButton) {
        searchButton.addEventListener('click', applySearchAndFilters);
    }
    if (searchBar) {
        searchBar.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                applySearchAndFilters();
            }
        });
    }
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', applySearchAndFilters);
    }
    // Optional: Apply filters on change for select/range without needing a button click
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applySearchAndFilters);
    }
    if (priceRangeFilter) {
        priceRangeFilter.addEventListener('change', applySearchAndFilters); // or 'input' for live filtering
    }
    if (brandFilter) {
        brandFilter.addEventListener('input', applySearchAndFilters); // Live filter on brand input
    }
});
