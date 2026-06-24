// صفحة سلة التسوق
document.addEventListener('DOMContentLoaded', () => {
    initCartPage();
    cartService.addListener(() => renderCart());
});

function initCartPage() {
    renderCart();
    attachCartEvents();
    analytics.trackPageView('cart');
}

function renderCart() {
    const cart = cartService.getCart();
    const container = document.getElementById('cartItems');
    const summaryContainer = document.getElementById('cartSummary');
    
    if (!container || !summaryContainer) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-page">
                <div class="empty-icon">🛒</div>
                <h2>سلة التسوق فارغة</h2>
                <p>أضف بعض المنتجات إلى سلتك</p>
                <button class="btn-primary" onclick="window.location.href='shop.html'">تسوق الآن</button>
            </div>
        `;
        summaryContainer.innerHTML = '';
        return;
    }
    
    // عرض عناصر السلة
    container.innerHTML = `
        <table class="cart-table">
            <thead>
                <tr><th>المنتج</th><th>السعر</th><th>الكمية</th><th>الإجمالي</th><th></th></tr>
            </thead>
            <tbody>
                ${cart.map(item => `
                    <tr data-id="${item.id}">
                        <td class="cart-product">
                            <img src="${item.image}" alt="${item.name}">
                            <span>${item.name}</span>
                        </td>
                        <td>${Formatters.formatPrice(item.price)}</td>
                        <td>
                            <div class="cart-quantity">
                                <button class="qty-minus" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-plus" data-id="${item.id}">+</button>
                            </div>
                        </td>
                        <td class="item-total">${Formatters.formatPrice(item.price * item.quantity)}</td>
                        <td><button class="remove-item" data-id="${item.id}">🗑️</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // عرض الملخص
    const subtotal = cartService.getSubtotal();
    const shipping = cartService.getShippingCost();
    const tax = cartService.getTax();
    const total = cartService.getTotal();
    
    summaryContainer.innerHTML = `
        <div class="cart-summary-box">
            <h3>ملخص الطلب</h3>
            <div class="summary-row">
                <span>المجموع الفرعي:</span>
                <span>${Formatters.formatPrice(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>الشحن:</span>
                <span>${shipping === 0 ? 'مجاني' : Formatters.formatPrice(shipping)}</span>
            </div>
            <div class="summary-row">
                <span>الضريبة (14%):</span>
                <span>${Formatters.formatPrice(tax)}</span>
            </div>
            <div class="summary-row total">
                <span>الإجمالي:</span>
                <span>${Formatters.formatPrice(total)}</span>
            </div>
            <div class="coupon-section">
                <input type="text" id="couponCode" placeholder="كود الخصم">
                <button id="applyCoupon" class="btn-secondary">تطبيق</button>
            </div>
            <button id="proceedCheckout" class="btn-primary btn-block">إتمام الشراء →</button>
        </div>
    `;
    
    // إضافة أحداث العناصر
    attachCartItemEvents();
}

function attachCartItemEvents() {
    // أزرار ناقص
    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = cartService.getCart().find(i => i.id === id);
            if (item && item.quantity > 1) {
                cartService.updateQuantity(id, item.quantity - 1);
            } else {
                cartService.removeItem(id);
            }
        });
    });
    
    // أزرار زائد
    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const item = cartService.getCart().find(i => i.id === id);
            if (item && item.quantity < item.stock) {
                cartService.updateQuantity(id, item.quantity + 1);
            } else {
                toast.warning('لا يوجد كمية كافية');
            }
        });
    });
    
    // أزرار إزالة
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            cartService.removeItem(id);
        });
    });
}

function attachCartEvents() {
    const continueBtn = document.getElementById('continueShopping');
    const proceedBtn = document.getElementById('proceedCheckout');
    const applyCouponBtn = document.getElementById('applyCoupon');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            window.location.href = 'shop.html';
        });
    }
    
    if (proceedBtn) {
        proceedBtn.addEventListener('click', () => {
            if (!cartService.isEmpty()) {
                analytics.trackCheckoutStart(cartService.getTotal(), cartService.getItemCount());
                window.location.href = 'checkout.html';
            }
        });
    }
    
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', () => {
            const code = document.getElementById('couponCode').value;
            if (code) {
                toast.info('كود خصم تجريبي: تم تطبيق خصم 10%');
            } else {
                toast.warning('الرجاء إدخال كود الخصم');
            }
        });
    }
}