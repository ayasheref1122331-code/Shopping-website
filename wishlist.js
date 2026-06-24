// صفحة المفضلة
document.addEventListener('DOMContentLoaded', () => {
    initWishlistPage();
    wishlistService.addListener(() => renderWishlist());
});


function initWishlistPage() {
    renderWishlist();
    attachWishlistEvents();
    analytics.trackPageView('wishlist');
}

function renderWishlist() {
    const wishlist = wishlistService.getWishlist();
    const container = document.getElementById('wishlistGrid');
    
    if (!container) return;
    
    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist-page">
                <div class="empty-icon">❤️</div>
                <h2>قائمة المفضلة فارغة</h2>
                <p>أضف المنتجات التي تعجبك إلى قائمة المفضلة</p>
                <button class="btn-primary" onclick="window.location.href='shop.html'">تسوق الآن</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = wishlist.map(product => `
        <div class="wishlist-card" data-id="${product.id}">
            <div class="wishlist-image" onclick="window.location.href='product-detail.html?id=${product.id}'">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="wishlist-info">
                <h3 onclick="window.location.href='product-detail.html?id=${product.id}">${product.name}</h3>
                <div class="price">${Formatters.formatPrice(product.price)}</div>
                <div class="wishlist-actions">
                    <button class="btn-primary move-to-cart" data-id="${product.id}">🛒 أضف للسلة</button>
                    <button class="btn-outline remove-wishlist" data-id="${product.id}">🗑️ إزالة</button>
                </div>
            </div>
        </div>
    `).join('');
    
    attachWishlistItemEvents();
}

function attachWishlistItemEvents() {
    document.querySelectorAll('.move-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const product = ALL_PRODUCTS.find(p => p.id === id);
            if (product) {
                const result = cartService.addItem(product);
                toast.show(result.message, result.success ? 'success' : 'error');
                if (result.success) {
                    wishlistService.removeItem(id);
                }
            }
        });
    });
    
    document.querySelectorAll('.remove-wishlist').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            wishlistService.removeItem(id);
            toast.show('تم إزالة المنتج من المفضلة', 'info');
        });
    });
}

function attachWishlistEvents() {
    const clearAllBtn = document.getElementById('clearWishlist');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('هل تريد إزالة جميع المنتجات من المفضلة؟')) {
                wishlistService.clear();
                toast.show('تم تفريغ قائمة المفضلة', 'success');
            }
        });
    }
}