// الملف الرئيسي للتطبيق
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // تهيئة الوضع المظلم
    initDarkMode();
    
    // تحديث العدادات
    updateCounters();
    
    // إضافة مستمعي الأحداث العامة
    attachGlobalEvents();
    
    // تحميل المنتجات إذا لم تكن محملة
    if (typeof ALL_PRODUCTS === 'undefined') {
        console.warn('المنتجات غير محملة');
    }
    
    console.log(`✅ ${CONFIG.APP_NAME} v${CONFIG.APP_VERSION} جاهز`);
    analytics.track('app_loaded', { version: CONFIG.APP_VERSION });
}

function initDarkMode() {
    const savedTheme = storage.get(STORAGE_KEYS.THEME, 'light');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const darkBtn = document.getElementById('darkModeToggle');
        if (darkBtn) darkBtn.textContent = '☀️';
    }
}

function updateCounters() {
    const cartCount = document.getElementById('cartCount');
    const wishlistCount = document.getElementById('wishlistCount');
    
    if (cartCount) cartCount.textContent = cartService.getItemCount();
    if (wishlistCount) wishlistCount.textContent = wishlistService.getCount();
}

function attachGlobalEvents() {
    // إغلاق القوائم الجانبية عند الضغط خارجها
    document.addEventListener('click', (e) => {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const wishlistSidebar = document.querySelector('.wishlist-sidebar');
        
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            if (!cartSidebar.contains(e.target) && !e.target.closest('#cartBtn')) {
                cartSidebar.classList.remove('open');
            }
        }
        
        if (wishlistSidebar && wishlistSidebar.classList.contains('open')) {
            if (!wishlistSidebar.contains(e.target) && !e.target.closest('#wishlistBtn')) {
                wishlistSidebar.classList.remove('open');
            }
        }
    });
    
    // حفظ آخر صفحة
    window.addEventListener('beforeunload', () => {
        storage.set('last_page', window.location.pathname);
    });
}

// دوال عامة للاستخدام العالمي
window.scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.goBack = function() {
    window.history.back();
};