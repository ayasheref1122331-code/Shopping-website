// صفحة حساب المستخدم
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    initProfilePage();
});

function initProfilePage() {
    currentUser = authService.getUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    renderProfileInfo();
    renderOrders();
    attachProfileEvents();
    analytics.trackPageView('profile');
}

function renderProfileInfo() {
    const container = document.getElementById('profileInfo');
    if (!container) return;
    
    container.innerHTML = `
        <div class="profile-avatar">
            <img src="${currentUser.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}" alt="صورة المستخدم">
            <button id="changeAvatar" class="btn-secondary">تغيير الصورة</button>
        </div>
        <div class="profile-details">
            <div class="form-group">
                <label>الاسم</label>
                <input type="text" id="profileName" value="${currentUser.name || ''}">
            </div>
            <div class="form-group">
                <label>البريد الإلكتروني</label>
                <input type="email" id="profileEmail" value="${currentUser.email || ''}">
            </div>
            <div class="form-group">
                <label>رقم الهاتف</label>
                <input type="tel" id="profilePhone" value="${currentUser.phone || ''}">
            </div>
            <button id="saveProfile" class="btn-primary">حفظ التغييرات</button>
        </div>
    `;
}

function renderOrders() {
    const container = document.getElementById('ordersList');
    if (!container) return;
    
    const orders = storage.get(STORAGE_KEYS.ORDERS, []);
    
    if (orders.length === 0) {
        container.innerHTML = '<div class="no-orders">لا توجد طلبات سابقة</div>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">طلب رقم: ${order.id}</span>
                <span class="order-date">${new Date(order.date).toLocaleDateString('ar-EG')}</span>
                <span class="order-status delivered">تم التوصيل</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div>${item.name}</div>
                        <div>${item.quantity} × ${Formatters.formatPrice(item.price)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <div class="order-total">الإجمالي: ${Formatters.formatPrice(order.total)}</div>
                <button class="btn-outline reorder-btn" data-order='${JSON.stringify(order.items)}'>إعادة الطلب</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.reorder-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const items = JSON.parse(btn.dataset.order);
            items.forEach(item => {
                const product = ALL_PRODUCTS.find(p => p.id === item.id);
                if (product) cartService.addItem(product, item.quantity);
            });
            toast.success('تم إضافة المنتجات إلى السلة');
            window.location.href = 'cart.html';
        });
    });
}

function attachProfileEvents() {
    const saveBtn = document.getElementById('saveProfile');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const updates = {
                name: document.getElementById('profileName')?.value,
                email: document.getElementById('profileEmail')?.value,
                phone: document.getElementById('profilePhone')?.value
            };
            const result = authService.updateProfile(updates);
            if (result.success) {
                toast.success('تم تحديث الملف الشخصي');
                currentUser = result.user;
            }
        });
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authService.logout();
            window.location.href = 'index.html';
        });
    }
}