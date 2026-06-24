// صفحة إتمام الشراء
let currentStep = 1;

document.addEventListener('DOMContentLoaded', () => {
    initCheckoutPage();
});

function initCheckoutPage() {
    if (cartService.isEmpty()) {
        window.location.href = 'cart.html';
        return;
    }
    
    renderCheckoutSteps();
    renderStepContent();
    renderOrderSummary();
    attachCheckoutEvents();
    
    analytics.trackPageView('checkout');
}

function renderCheckoutSteps() {
    const container = document.getElementById('checkoutSteps');
    if (!container) return;
    
    const steps = ['المعلومات الشخصية', 'عنوان الشحن', 'طريقة الدفع', 'تأكيد الطلب'];
    
    container.innerHTML = steps.map((step, index) => `
        <div class="step ${index + 1 === currentStep ? 'active' : ''} ${index + 1 < currentStep ? 'completed' : ''}">
            ${index + 1 < currentStep ? '✓' : index + 1}
            <span>${step}</span>
        </div>
    `).join('');
}

function renderStepContent() {
    const container = document.getElementById('checkoutForm');
    if (!container) return;
    
    let content = '';
    
    switch(currentStep) {
        case 1:
            content = `
                <h3>المعلومات الشخصية</h3>
                <div class="form-group">
                    <label>الاسم الكامل *</label>
                    <input type="text" id="fullName" placeholder="أحمد محمد علي">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>البريد الإلكتروني *</label>
                        <input type="email" id="email" placeholder="ahmed@example.com">
                    </div>
                    <div class="form-group">
                        <label>رقم الهاتف *</label>
                        <input type="tel" id="phone" placeholder="0123456789">
                    </div>
                </div>
            `;
            break;
        case 2:
            content = `
                <h3>عنوان الشحن</h3>
                <div class="form-group">
                    <label>العنوان التفصيلي *</label>
                    <input type="text" id="address" placeholder="الشارع، المنطقة، المدينة">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>المدينة *</label>
                        <input type="text" id="city" placeholder="القاهرة">
                    </div>
                    <div class="form-group">
                        <label>الرمز البريدي</label>
                        <input type="text" id="postalCode" placeholder="11311">
                    </div>
                </div>
            `;
            break;
        case 3:
            content = `
                <h3>طريقة الدفع</h3>
                <div class="payment-methods">
                    <label class="payment-method">
                        <input type="radio" name="payment" value="cash" checked>
                        <span>💰 الدفع عند الاستلام</span>
                    </label>
                    <label class="payment-method">
                        <input type="radio" name="payment" value="card">
                        <span>💳 بطاقة ائتمان</span>
                    </label>
                    <label class="payment-method">
                        <input type="radio" name="payment" value="vodafone">
                        <span>📱 فودافون كاش</span>
                    </label>
                </div>
            `;
            break;
        case 4:
            content = `
                <h3>تأكيد الطلب</h3>
                <div class="order-confirmation">
                    <p>شكراً لتسوقك معنا!</p>
                    <p>سيتم مراجعة طلبك والتواصل معك خلال 24 ساعة</p>
                    <div class="order-details-summary" id="orderDetailsSummary"></div>
                </div>
            `;
            break;
    }
    
    content += `
        <div class="checkout-navigation">
            ${currentStep > 1 ? '<button id="prevStep" class="btn-secondary">السابق</button>' : ''}
            <button id="nextStep" class="btn-primary">${currentStep === 4 ? 'تأكيد الطلب' : 'التالي'}</button>
        </div>
    `;
    
    container.innerHTML = content;
}

function renderOrderSummary() {
    const container = document.getElementById('orderSummary');
    if (!container) return;
    
    const cart = cartService.getCart();
    const subtotal = cartService.getSubtotal();
    const shipping = cartService.getShippingCost();
    const tax = cartService.getTax();
    const total = cartService.getTotal();
    
    container.innerHTML = `
        <div class="order-summary-box">
            <h3>ملخص الطلب</h3>
            <div class="order-items">
                ${cart.map(item => `
                    <div class="order-summary-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <div>${item.name}</div>
                            <div>${item.quantity} × ${Formatters.formatPrice(item.price)}</div>
                        </div>
                        <div>${Formatters.formatPrice(item.price * item.quantity)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="summary-details">
                <div class="summary-row"><span>المجموع الفرعي:</span><span>${Formatters.formatPrice(subtotal)}</span></div>
                <div class="summary-row"><span>الشحن:</span><span>${shipping === 0 ? 'مجاني' : Formatters.formatPrice(shipping)}</span></div>
                <div class="summary-row"><span>الضريبة:</span><span>${Formatters.formatPrice(tax)}</span></div>
                <div class="summary-row total"><span>الإجمالي:</span><span>${Formatters.formatPrice(total)}</span></div>
            </div>
        </div>
    `;
}

function attachCheckoutEvents() {
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                if (currentStep === 4) {
                    placeOrder();
                } else {
                    currentStep++;
                    renderCheckoutSteps();
                    renderStepContent();
                    renderOrderSummary();
                    attachCheckoutEvents();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentStep--;
            renderCheckoutSteps();
            renderStepContent();
            renderOrderSummary();
            attachCheckoutEvents();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            const name = document.getElementById('fullName')?.value;
            const email = document.getElementById('email')?.value;
            const phone = document.getElementById('phone')?.value;
            
            if (!name) { toast.error('الرجاء إدخال الاسم'); return false; }
            if (!Validators.validateEmail(email)) { toast.error('البريد الإلكتروني غير صحيح'); return false; }
            if (!Validators.validateEgyptianPhone(phone)) { toast.error('رقم الهاتف غير صحيح'); return false; }
            break;
        case 2:
            const address = document.getElementById('address')?.value;
            const city = document.getElementById('city')?.value;
            if (!address || !city) { toast.error('الرجاء إكمال عنوان الشحن'); return false; }
            break;
    }
    return true;
}

function placeOrder() {
    const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        items: cartService.getCart(),
        subtotal: cartService.getSubtotal(),
        shipping: cartService.getShippingCost(),
        tax: cartService.getTax(),
        total: cartService.getTotal(),
        customer: {
            name: document.getElementById('fullName')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value,
            address: document.getElementById('address')?.value,
            city: document.getElementById('city')?.value
        },
        payment: document.querySelector('input[name="payment"]:checked')?.value
    };
    
    // حفظ الطلب
    const orders = storage.get(STORAGE_KEYS.ORDERS, []);
    orders.unshift(order);
    storage.set(STORAGE_KEYS.ORDERS, orders);
    
    // تفريغ السلة
    cartService.clear();
    
    analytics.trackPurchase(order.id, order.total, order.items);
    
    toast.success('تم تقديم الطلب بنجاح!');
    
    setTimeout(() => {
        window.location.href = `order-confirmation.html?id=${order.id}`;
    }, 1500);
}