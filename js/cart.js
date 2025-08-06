// Discobeak Shopping Cart Management
class DiscobeakCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('discobeak-cart') || '[]');
        this.init();
    }

    init() {
        this.renderCart();
        this.bindEvents();
        this.updateCartCounter();
    }

    addItem(product) {
        const existingItem = this.items.find(item => 
            item.id === product.id && 
            item.size === product.size && 
            item.color === product.color
        );

        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: product.size || 'Standard',
                color: product.color || 'Default',
                quantity: product.quantity || 1
            });
        }

        this.saveCart();
        this.renderCart();
        this.updateCartCounter();
        this.showAddedNotification(product.name);
    }

    removeItem(itemId, size, color) {
        this.items = this.items.filter(item => 
            !(item.id === itemId && item.size === size && item.color === color)
        );
        this.saveCart();
        this.renderCart();
        this.updateCartCounter();
    }

    updateQuantity(itemId, size, color, newQuantity) {
        const item = this.items.find(item => 
            item.id === itemId && item.size === size && item.color === color
        );
        
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(itemId, size, color);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.renderCart();
                this.updateCartCounter();
            }
        }
    }

    getCartTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('discobeak-cart', JSON.stringify(this.items));
    }

    renderCart() {
        const cartContainer = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const checkoutButtons = document.getElementById('checkout-buttons');
        
        if (!cartContainer) return;

        if (this.items.length === 0) {
            emptyCart.style.display = 'block';
            checkoutButtons.style.display = 'none';
            cartContainer.innerHTML = '';
        } else {
            emptyCart.style.display = 'none';
            checkoutButtons.style.display = 'block';
            
            cartContainer.innerHTML = this.items.map(item => `
                <div class="bg-gray-800 rounded-xl p-6 cart-item" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                    <div class="flex items-center space-x-6">
                        <div class="w-20 h-20 bg-gradient-to-br from-disco-pink to-disco-purple rounded-lg flex items-center justify-center">
                            <i class="fas fa-tshirt text-3xl text-white/80"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-disco-gold">${item.name}</h3>
                            <p class="text-gray-400">Size: ${item.size} | Color: ${item.color}</p>
                            <p class="text-2xl font-bold text-disco-pink">$${item.price.toFixed(2)}</p>
                        </div>
                        <div class="flex items-center space-x-4">
                            <div class="flex items-center space-x-2 bg-gray-700 rounded-lg">
                                <button class="quantity-decrease px-3 py-2 hover:bg-gray-600 rounded-l-lg transition-colors">-</button>
                                <span class="px-4 py-2 font-semibold">${item.quantity}</span>
                                <button class="quantity-increase px-3 py-2 hover:bg-gray-600 rounded-r-lg transition-colors">+</button>
                            </div>
                            <button class="remove-item text-red-400 hover:text-red-300 p-2">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        this.updateTotals();
    }

    updateTotals() {
        const subtotal = this.getCartTotal();
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;

        const elements = {
            subtotal: document.getElementById('subtotal'),
            tax: document.getElementById('tax'),
            total: document.getElementById('total')
        };

        if (elements.subtotal) elements.subtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (elements.tax) elements.tax.textContent = `$${tax.toFixed(2)}`;
        if (elements.total) elements.total.textContent = `$${total.toFixed(2)}`;
    }

    updateCartCounter() {
        const counters = document.querySelectorAll('.cart-counter');
        const count = this.getCartCount();
        
        counters.forEach(counter => {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'block' : 'none';
        });
    }

    bindEvents() {
        // Quantity controls and Add to Cart
        document.addEventListener('click', (e) => {
            // Handle Add to Cart buttons
            if (e.target.dataset.productId) {
                e.preventDefault();
                this.handleAddToCart(e.target);
            }

            if (e.target.classList.contains('quantity-increase')) {
                const cartItem = e.target.closest('.cart-item');
                const id = cartItem.dataset.id;
                const size = cartItem.dataset.size;
                const color = cartItem.dataset.color;
                const currentQty = parseInt(cartItem.querySelector('span').textContent);
                this.updateQuantity(id, size, color, currentQty + 1);
            }

            if (e.target.classList.contains('quantity-decrease')) {
                const cartItem = e.target.closest('.cart-item');
                const id = cartItem.dataset.id;
                const size = cartItem.dataset.size;
                const color = cartItem.dataset.color;
                const currentQty = parseInt(cartItem.querySelector('span').textContent);
                this.updateQuantity(id, size, color, currentQty - 1);
            }

            if (e.target.closest('.remove-item')) {
                const cartItem = e.target.closest('.cart-item');
                const id = cartItem.dataset.id;
                const size = cartItem.dataset.size;
                const color = cartItem.dataset.color;
                this.removeItem(id, size, color);
            }
        });

        // PayPal checkout
        const paypalButton = document.getElementById('paypal-checkout');
        if (paypalButton) {
            paypalButton.addEventListener('click', () => {
                this.initiatePayPalCheckout();
            });
        }

        // Bank transfer checkout
        const bankButton = document.getElementById('bank-transfer-checkout');
        if (bankButton) {
            bankButton.addEventListener('click', () => {
                this.initiateBankTransfer();
            });
        }
    }

    handleAddToCart(button) {
        // Get selected size and color from the product page
        const selectedSizeBtn = document.querySelector('button[class*="border-disco-pink"]:not([data-product-id])');
        const quantityElement = document.querySelector('.border-x span');
        
        const product = {
            id: button.dataset.productId,
            name: button.dataset.productName,
            price: parseFloat(button.dataset.productPrice),
            size: selectedSizeBtn ? selectedSizeBtn.textContent.trim() : 'M',
            color: 'Default',
            quantity: quantityElement ? parseInt(quantityElement.textContent) : 1
        };

        this.addItem(product);
    }

    async initiatePayPalCheckout() {
        const total = this.getCartTotal() + (this.getCartTotal() * 0.08);
        
        try {
            const response = await fetch('/paypal/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    intent: 'CAPTURE',
                    amount: total.toFixed(2),
                    currency: 'USD'
                })
            });

            const orderData = await response.json();
            
            if (orderData.id) {
                // Redirect to PayPal for approval
                window.location.href = orderData.links.find(link => link.rel === 'approve').href;
            }
        } catch (error) {
            console.error('PayPal checkout error:', error);
            alert('PayPal checkout failed. Please try again.');
        }
    }

    async initiateBankTransfer() {
        const total = this.getCartTotal() + (this.getCartTotal() * 0.08);
        
        try {
            const response = await fetch('/bank-transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: total.toFixed(2),
                    currency: 'USD',
                    orderDetails: this.items
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showBankTransferDetails(result);
            }
        } catch (error) {
            console.error('Bank transfer error:', error);
            alert('Bank transfer setup failed. Please try again.');
        }
    }

    showBankTransferDetails(bankData) {
        alert(`Bank Transfer Details:
        
Account: ${bankData.bankDetails.accountName}
Account Number: ${bankData.bankDetails.accountNumber}
Routing: ${bankData.bankDetails.routingNumber}
Bank: ${bankData.bankDetails.bankName}
Reference: ${bankData.bankDetails.reference}
Amount: $${bankData.bankDetails.amount}

Please include the reference number in your transfer.`);
    }

    showAddedNotification(itemName) {
        // Create floating notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-6 bg-disco-purple text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-check text-disco-lime"></i>
                <span>${itemName} added to cart!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.renderCart();
        this.updateCartCounter();
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.discobeakCart = new DiscobeakCart();
    
    // Add product to cart functionality for product pages
    const addToCartButtons = document.querySelectorAll('[data-product-id]');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productData = {
                id: button.dataset.productId,
                name: button.dataset.productName,
                price: parseFloat(button.dataset.productPrice),
                image: button.dataset.productImage || '',
                size: document.querySelector('select[name="size"]')?.value || 'Standard',
                color: document.querySelector('select[name="color"]')?.value || 'Default',
                quantity: parseInt(document.querySelector('input[name="quantity"]')?.value || '1')
            };
            
            window.discobeakCart.addItem(productData);
        });
    });
});