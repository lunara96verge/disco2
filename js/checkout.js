// Discobeak Checkout Management
class DiscobeakCheckout {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('discobeak-cart') || '[]');
        this.selectedPaymentMethod = null;
        this.init();
    }

    init() {
        this.renderOrderSummary();
        this.bindEvents();
        this.setupPaymentMethodSelection();
        
        // Redirect if cart is empty
        if (this.cart.length === 0) {
            window.location.href = '/shop/';
        }
    }

    renderOrderSummary() {
        const orderItemsContainer = document.getElementById('order-items');
        
        if (!orderItemsContainer) return;

        orderItemsContainer.innerHTML = this.cart.map(item => `
            <div class="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                <div class="w-16 h-16 bg-gradient-to-br from-disco-pink to-disco-purple rounded-lg flex items-center justify-center">
                    <i class="fas fa-tshirt text-2xl text-white/80"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-sm text-gray-400">${item.size} | ${item.color}</p>
                    <p class="text-sm text-gray-400">Qty: ${item.quantity}</p>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-disco-pink">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        `).join('');

        this.updateOrderTotals();
    }

    updateOrderTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        const elements = {
            subtotal: document.getElementById('checkout-subtotal'),
            tax: document.getElementById('checkout-tax'),
            total: document.getElementById('checkout-total')
        };

        if (elements.subtotal) elements.subtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (elements.tax) elements.tax.textContent = `$${tax.toFixed(2)}`;
        if (elements.total) elements.total.textContent = `$${total.toFixed(2)}`;

        // Update bank transfer modal amounts
        const bankAmount = document.getElementById('bank-amount');
        if (bankAmount) bankAmount.textContent = `$${total.toFixed(2)}`;
    }

    setupPaymentMethodSelection() {
        const paymentOptions = document.querySelectorAll('.payment-option');
        const paypalContainer = document.getElementById('paypal-button-container');
        const bankContainer = document.getElementById('bank-transfer-container');
        const defaultButton = document.getElementById('complete-order-button');

        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Clear previous selections
                paymentOptions.forEach(opt => opt.classList.remove('border-disco-cyan'));
                
                // Select current option
                option.classList.add('border-disco-cyan');
                const radio = option.querySelector('input[type="radio"]');
                radio.checked = true;
                
                this.selectedPaymentMethod = radio.value;
                this.updatePaymentButtons();
            });
        });
    }

    updatePaymentButtons() {
        const paypalContainer = document.getElementById('paypal-button-container');
        const bankContainer = document.getElementById('bank-transfer-container');
        const defaultButton = document.getElementById('complete-order-button');

        // Hide all payment buttons first
        paypalContainer.classList.add('hidden');
        bankContainer.classList.add('hidden');
        defaultButton.style.display = 'block';

        // Show appropriate button based on selection
        if (this.selectedPaymentMethod === 'paypal') {
            paypalContainer.classList.remove('hidden');
            defaultButton.style.display = 'none';
        } else if (this.selectedPaymentMethod === 'bank') {
            bankContainer.classList.remove('hidden');
            defaultButton.style.display = 'none';
        }
    }

    bindEvents() {
        // PayPal payment button
        const paypalButton = document.getElementById('paypal-payment-button');
        if (paypalButton) {
            paypalButton.addEventListener('click', () => {
                this.processPayPalPayment();
            });
        }

        // Bank transfer button
        const bankButton = document.getElementById('bank-transfer-button');
        if (bankButton) {
            bankButton.addEventListener('click', () => {
                this.processBankTransfer();
            });
        }

        // Complete order button (default)
        const completeButton = document.getElementById('complete-order-button');
        if (completeButton) {
            completeButton.addEventListener('click', () => {
                this.completeOrder();
            });
        }

        // Bank transfer modal events
        const closeBankModal = document.getElementById('close-bank-modal');
        const confirmBankTransfer = document.getElementById('confirm-bank-transfer');
        
        if (closeBankModal) {
            closeBankModal.addEventListener('click', () => {
                this.closeBankTransferModal();
            });
        }

        if (confirmBankTransfer) {
            confirmBankTransfer.addEventListener('click', () => {
                this.confirmBankTransferOrder();
            });
        }

        // Form validation
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('input', () => {
                this.validateForm();
            });
        }
    }

    async processPayPalPayment() {
        if (!this.validateForm()) return;
        
        const total = this.getOrderTotal();
        
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
                // Store order data for completion
                sessionStorage.setItem('pending-order', JSON.stringify({
                    paypal_order_id: orderData.id,
                    customer_data: this.getCustomerData(),
                    cart_items: this.cart,
                    total: total
                }));
                
                // Redirect to PayPal
                const approvalUrl = orderData.links.find(link => link.rel === 'approve')?.href;
                if (approvalUrl) {
                    window.location.href = approvalUrl;
                } else {
                    throw new Error('PayPal approval URL not found');
                }
            } else {
                throw new Error('Failed to create PayPal order');
            }
        } catch (error) {
            console.error('PayPal payment error:', error);
            this.showErrorMessage('PayPal payment failed. Please try again or select a different payment method.');
        }
    }

    processBankTransfer() {
        if (!this.validateForm()) return;
        
        this.showBankTransferModal();
    }

    showBankTransferModal() {
        const modal = document.getElementById('bank-transfer-modal');
        const reference = document.getElementById('bank-reference');
        const amount = document.getElementById('bank-amount');
        
        // Generate unique reference
        const orderRef = 'DB-' + Date.now();
        reference.textContent = orderRef;
        amount.textContent = `$${this.getOrderTotal().toFixed(2)}`;
        
        modal.classList.remove('hidden');
    }

    closeBankTransferModal() {
        const modal = document.getElementById('bank-transfer-modal');
        modal.classList.add('hidden');
    }

    async confirmBankTransferOrder() {
        const total = this.getOrderTotal();
        const reference = document.getElementById('bank-reference').textContent;
        
        try {
            const response = await fetch('/bank-transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: total.toFixed(2),
                    currency: 'USD',
                    orderDetails: {
                        items: this.cart,
                        customer: this.getCustomerData(),
                        reference: reference
                    }
                })
            });

            const result = await response.json();
            
            if (result.success) {
                // Clear cart and redirect to success page
                localStorage.removeItem('discobeak-cart');
                this.showSuccessMessage(`Order ${reference} created! Please transfer $${total.toFixed(2)} using the provided bank details. We'll process your order once payment is received.`);
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            }
        } catch (error) {
            console.error('Bank transfer order error:', error);
            this.showErrorMessage('Failed to create bank transfer order. Please try again.');
        }
        
        this.closeBankTransferModal();
    }

    completeOrder() {
        if (!this.validateForm()) return;
        
        // For demo purposes, just show success message
        const orderId = 'DB-' + Date.now();
        
        // Clear cart
        localStorage.removeItem('discobeak-cart');
        
        this.showSuccessMessage(`Order ${orderId} completed successfully! Thank you for your groovy purchase. You'll receive a confirmation email shortly.`);
        
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    }

    validateForm() {
        const form = document.getElementById('checkout-form');
        if (!form) return false;
        
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                field.style.borderColor = '#4b5563';
            }
        });
        
        if (!isValid) {
            this.showErrorMessage('Please fill in all required fields.');
        }
        
        return isValid;
    }

    getCustomerData() {
        const form = document.getElementById('checkout-form');
        if (!form) return {};
        
        const formData = new FormData(form);
        const customerData = {};
        
        for (let [key, value] of formData.entries()) {
            customerData[key] = value;
        }
        
        return customerData;
    }

    getOrderTotal() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        return subtotal + tax;
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-6 bg-disco-lime text-gray-900 px-6 py-4 rounded-lg shadow-lg z-50 max-w-md';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-check-circle text-xl"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-6 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-exclamation-triangle text-xl"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.discobeakCheckout = new DiscobeakCheckout();
});