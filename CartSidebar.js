// مcomponent السلة الجانبية
class CartSidebarComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isOpen = false;
        this.render();
        this.attachEvents();
        this.update();
        
        cartService.addListener(() => this.update());
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="cart-sidebar">
                <div class="cart-header">
                    <h3>🛒 سلة التسوق</h3>
                    <button class="close-cart-sidebar">&times;</button>
                </div>
                <div class="cart-items-list"></div>
                <div class="cart-footer">
                    <div class="cart-subtotal">
                        <span>المجموع الفرعي:</span>
                        <span class="subtotal-amount">0 ج.م</span>
                    </div>
                    <div class="cart-shipping">
                        <span>الشحن:</span>
                        <span class="shipping-amount">0 ج.م</span>
                    </div>
                    <div class="cart-tax">
                        <span>الضريبة (14%):</span>
                        <span class="tax-amount">0 ج.م</span>
                    </div>
                    <div class="cart-total">
                        <span>الإجمالي:</span>
                        <span class="total-amount">0 ج.م</span>
                    </div>
                    <button class="view-cart-btn">عرض السلة</button>
                    <button class="checkout-btn-sidebar">إتمام الشراء</button>
                </div>
            </div>
        `;
        
        this.itemsList = this.container.querySelector('.cart-items-list');
        this.subtotalSpan = this.container.querySelector('.subtotal-amount');
        this.shippingSpan = this.container.querySelector('.shipping-amount');
        this.taxSpan = this.container.querySelector('.tax-amount');
        this.totalSpan = this.container.querySelector('.total-amount');
    }
    
    attachEvents() {
        const closeBtn = this.container.querySelector('.close-cart-sidebar');
        const viewCartBtn = this.container.querySelector('.view-cart-btn');
        const checkoutBtn = this.container.querySelector('.checkout-btn-sidebar');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        if (viewCartBtn) {
            viewCartBtn.addEventListener('click', () => {
                window.location.href = 'pages/cart.html';
            });
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                window.location.href = 'pages/checkout.html';
            });
        }
    }
    
    update() {
        const cart = cartService.getCart();
        
        if (cart.length === 0) {
            this.itemsList.innerHTML = '<div class="empty-cart-sidebar">🛒 سلة التسوق فارغة<br><small>أضف بعض المنتجات!</small></div>';
        } else {
            this.itemsList.innerHTML = cart.map(item => `
                <div class="cart-sidebar-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <div class="item-name">${Helpers.truncate(item.name, 20)}</div>
                        <div class="item-price">${Formatters.formatPrice(item.price)}</div>
                        <div class="item-quantity">
                            <button class="qty-minus" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-plus" data-id="${item.id}">+</button>
                            <button class="item-remove" data-id="${item.id}">🗑️</button>
                        </div>
                    </div>
                    <div class="item-total">${Formatters.formatPrice(item.price * item.quantity)}</div>
                </div>
            `).join('');
            
            // إضافة مستمعات للأزرار
            this.itemsList.querySelectorAll('.qty-minus').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id);
                    const item = cart.find(i => i.id === id);
                    if (item && item.quantity > 1) {
                        cartService.updateQuantity(id, item.quantity - 1);
                    } else {
                        cartService.removeItem(id);
                    }
                });
            });
            
            this.itemsList.querySelectorAll('.qty-plus').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id);
                    const item = cart.find(i => i.id === id);
                    if (item && item.quantity < item.stock) {
                        cartService.updateQuantity(id, item.quantity + 1);
                    } else {
                        toast.warning('لا يوجد كمية كافية');
                    }
                });
            });
            
            this.itemsList.querySelectorAll('.item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id);
                    cartService.removeItem(id);
                });
            });
        }
        
        // تحديث الأسعار
        const subtotal = cartService.getSubtotal();
        const shipping = cartService.getShippingCost();
        const tax = cartService.getTax();
        const total = cartService.getTotal();
        
        this.subtotalSpan.textContent = Formatters.formatPrice(subtotal);
        this.shippingSpan.textContent = shipping === 0 ? 'مجاني' : Formatters.formatPrice(shipping);
        this.taxSpan.textContent = Formatters.formatPrice(tax);
        this.totalSpan.textContent = Formatters.formatPrice(total);
    }
    
    open() {
        this.container.classList.add('open');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.container.classList.remove('open');
        this.isOpen = false;
        document.body.style.overflow = '';
    }
    
    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }
}