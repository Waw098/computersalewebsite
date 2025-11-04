document.addEventListener('DOMContentLoaded', () => {
    // Ensure script.js (which contains window.products and window.findProductById) is loaded
    if (!window.products || !window.findProductById) {
        console.error('Global product data not found. Ensure script.js is loaded before product-detail.js');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = window.findProductById(productId);

    if (product) {
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-image').alt = product.name;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;

        const addToCartDetailButton = document.getElementById('add-to-cart-detail-btn');
        if (addToCartDetailButton) {
            addToCartDetailButton.addEventListener('click', () => {
                window.addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image // Pass image for cart display
                });
            });
        }

        populateProductSpecifications(product);

    } else {
        // Handle product not found
        const productDetailContainer = document.querySelector('.product-detail-container');
        if (productDetailContainer) {
            productDetailContainer.innerHTML = '<p>Product not found.</p>';
        }
    }

    function populateProductSpecifications(product) {
        const specsList = document.getElementById('product-specs-list');
        if (!specsList) return; // Exit if the specs list element doesn't exist

        // Clear existing placeholder specs
        specsList.innerHTML = '';

        let specifications = [];
        const productNameLower = product.name.toLowerCase();

        if (productNameLower.includes('keyboard')) {
            specifications = [
                { label: 'Type', value: 'Mechanical' },
                { label: 'Layout', value: 'Full-size (104-key)' },
                { label: 'Switch Type', value: 'Cherry MX Red' },
                { label: 'Backlighting', value: 'RGB Per-key' },
                { label: 'Connectivity', value: 'USB-C (Detachable)' }
            ];
        } else if (productNameLower.includes('monitor')) {
            specifications = [
                { label: 'Screen Size', value: '27 inches' },
                { label: 'Resolution', value: '2560x1440 (QHD)' },
                { label: 'Refresh Rate', value: '144Hz' },
                { label: 'Panel Type', value: 'IPS' },
                { label: 'Response Time', value: '1ms GTG' }
            ];
        } else if (productNameLower.includes('mouse')) {
            specifications = [
                { label: 'Sensor', value: 'Optical' },
                { label: 'DPI', value: 'Max 16,000' },
                { label: 'Buttons', value: '6 programmable' },
                { label: 'Connectivity', value: 'Wireless (2.4GHz + Bluetooth)' },
                { label: 'Weight', value: '80g' }
            ];
        } else if (product.name === 'Alienware Aurora R15 Gaming Desktop') {
            specifications = [
                { label: 'Processor', value: 'Intel Core i9-13900KF' },
                { label: 'Graphics Card', value: 'NVIDIA GeForce RTX 4090' },
                { label: 'RAM', value: '64GB DDR5 4800MHz' },
                { label: 'Storage', value: '2TB NVMe M.2 PCIe SSD' },
                { label: 'Operating System', value: 'Windows 11 Home' },
                { label: 'Chassis', value: 'Dark Side of the Moon' },
                { label: 'Cooling', value: 'Liquid Cooling with 240mm radiator' }
            ];
        } else if (product.name === 'Dell XPS 15 Laptop') {
            specifications = [
                { label: 'Processor', value: 'Intel Core i7-13700H' },
                { label: 'Display', value: '15.6\" OLED 3.5K (3456x2160) InfinityEdge Touch' },
                { label: 'RAM', value: '32GB DDR5 4800MHz' },
                { label: 'Storage', value: '1TB PCIe 4 SSD' },
                { label: 'Graphics Card', value: 'NVIDIA GeForce RTX 4070' },
                { label: 'Operating System', value: 'Windows 11 Pro' },
                { label: 'Battery', value: '86Whr' }
            ];
        } else if (productNameLower.includes('computer') || productNameLower.includes('pc')) {
            specifications = [
                { label: 'Processor', value: 'Intel Core i7-12700K' },
                { label: 'RAM', value: '16GB DDR4 3200MHz' },
                { label: 'Storage', value: '1TB NVMe SSD + 2TB HDD' },
                { label: 'Graphics Card', value: 'NVIDIA GeForce RTX 3070' },
                { label: 'Operating System', value: 'Windows 11 Home' },
                { label: 'Power Supply', value: '750W 80+ Gold' },
                { label: 'Connectivity', value: 'Wi-Fi 6, Bluetooth 5.2, Gigabit Ethernet' }
            ];
        } else {
            // Default or general specifications if no specific type is matched
            specifications = [
                { label: 'Category', value: 'Computer Accessory' },
                { label: 'Compatibility', value: 'Universal' },
                { label: 'Warranty', value: '1 Year Manufacturer' }
            ];
        }

        specifications.forEach(spec => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${spec.label}:</strong> ${spec.value}`;
            specsList.appendChild(li);
        });
    }
});
