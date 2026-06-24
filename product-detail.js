// صفحة تفاصيل المنتج
let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
    initProductDetail();
});

async function initProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    
    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }
    
    currentProduct = ALL_PRODUCTS.find(p => p.id === productId);
    
    if (!currentProduct) {
        notification.error('المنتج غير موجود');
        setTimeout(() => window.location.href = 'shop.html', 2000);
        return;
    }
    
    renderProductDetail();
    renderRelatedProducts();
    
    analytics.trackProductView(currentProduct.id, currentProduct.name);
    
    // إضافة للمشاهدات الأخيرة
    addToRecentlyViewed(currentProduct);
}

function renderProductDetail() {
    // عنوان الصفحة
    document.title = `${currentProduct.name} | متجري المثالي`;
    
    // مسار التنقل
    renderBreadcrumb();
    
    // معرض الصور
    renderGallery();
    
    // معلومات المنتج
    renderProductInfo();
    
    // علامات التبويب
    renderTabs();
}

function renderBreadcrumb() {
    const container = document.getElementById('breadcrumb');
    if (!container) return;
    
    container.innerHTML = `
        <div class="breadcrumb">
            <a href="../index.html">الرئيسية</a>
            <span>›</span>
            <a href="shop.html">المتجر</a>
            <span>›</span>
            <span>${currentProduct.name}</span>
        </div>
    `;
}

function renderGallery() {
    const container = document.getElementById('productGallery');
    if (!container) return;
    
    const images = currentProduct.images || [currentProduct.image];
    
    container.innerHTML = `
        <div class="product-gallery">
            <div class="main-image">
                <img id="mainProductImage" src="${images[0]}" alt="${currentProduct.name}">
            </div>
            <div class="thumbnail-list">
                ${images.map((img, i) => `
                    <div class="thumbnail ${i === 0 ? 'active' : ''}" data-img="${img}">
                        <img src="${img}" alt="صورة ${i + 1}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // إضافة أحداث الصور المصغرة
    container.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const imgSrc = thumb.dataset.img;
            document.getElementById('mainProductImage').src = imgSrc;
            
            container.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
}

function renderProductInfo() {
    const container = document.getElementById('productInfo');
    if (!container) return;
    
    const discount = currentProduct.discount;
    const isInWishlist = wishlistService.isInWishlist(currentProduct.id);
    
    container.innerHTML = `
        <div class="product-info-detail">
            <h1>${currentProduct.name}</h1>
            <div class="product-brand">العلامة التجارية: ${currentProduct.brand || 'متجري'}</div>
            <div class="product-rating-large">
                <div class="stars">${renderStars(currentProduct.rating)}</div>
                <span class="reviews-count">${currentProduct.reviews} تقييم</span>
                <span class="sold-count">| تم بيع ${currentProduct.sold}+</span>
            </div>
            <div class="product-price-section">
                <div class="product-price-large">
                    <span class="current-price-large">${Formatters.formatPrice(currentProduct.price)}</span>
                    ${currentProduct.oldPrice ? `<span class="old-price-large">${Formatters.formatPrice(currentProduct.oldPrice)}</span>` : ''}
                    ${discount > 0 ? `<span class="discount-badge-large">-${discount}%</span>` : ''}
                </div>
                <div class="price-note">الأسعار تشمل الضريبة</div>
            </div>
            <div class="product-stock-info ${currentProduct.stock > 0 ? 'in-stock' : 'out-stock'}">
                ${currentProduct.stock > 0 ? `✅ متوفر (${currentProduct.stock} قطعة)` : '❌ غير متوفر حالياً'}
                ${currentProduct.stock < 10 && currentProduct.stock > 0 ? '<span class="low-stock-warning">⚠️ كمية محدودة!</span>' : ''}
            </div>
            <div class="product-short-description">
                <p>${currentProduct.description || 'منتج عالي الجودة من متجرنا المثالي. يتميز بجودة ممتازة وسعر مناسب.'}</p>
            </div>
            <div class="product-features">
                <h4>المميزات:</h4>
                <ul>
                    ${currentProduct.features.map(f => `<li>✓ ${f}</li>`).join('')}
                </ul>
            </div>
            <div class="quantity-section">
                <label>الكمية:</label>
                <div id="quantitySelector"></div>
            </div>
            <div class="product-actions-detail">
                <button class="btn-primary add-to-cart-detail" id="detailAddToCart" ${currentProduct.stock === 0 ? 'disabled' : ''}>
                    🛒 أضف إلى السلة
                </button>
                <button class="btn-outline add-to-wishlist-detail" id="detailAddToWishlist">
                    ${isInWishlist ? '❤️ تم الإضافة' : '🤍 أضف للمفضلة'}
                </button>
            </div>
            <div class="product-meta">
                <div class="meta-item">📦 SKU: #${currentProduct.id}</div>
                <div class="meta-item">📅 التصنيف: ${CATEGORIES.find(c => c.id === currentProduct.category)?.name || currentProduct.category}</div>
                <div class="meta-item">🚚 التوصيل: 3-5 أيام عمل</div>
            </div>
        </div>
    `;
    
    // إضافة منتقي الكمية
    const quantityContainer = document.getElementById('quantitySelector');
    if (quantityContainer) {
        new QuantitySelectorComponent('quantitySelector', {
            quantity: 1,
            min: 1,
            stock: currentProduct.stock,
            onchange: (qty) => {
                console.log('الكمية:', qty);
            }
        });
    }
    
    // إضافة أحداث الأزرار
    const addToCartBtn = document.getElementById('detailAddToCart');
    const addToWishlistBtn = document.getElementById('detailAddToWishlist');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const qtySelector = document.querySelector('#quantitySelector .qty-input');
            const quantity = qtySelector ? parseInt(qtySelector.value) : 1;
            const result = cartService.addItem(currentProduct, quantity);
            notification.show(result.message, result.success ? 'success' : 'error');
            if (result.success) {
                Animations.pulse(addToCartBtn);
            }
        });
    }
    
    if (addToWishlistBtn) {
        addToWishlistBtn.addEventListener('click', () => {
            const result = wishlistService.toggleItem(currentProduct);
            if (result.success) {
                addToWishlistBtn.innerHTML = wishlistService.isInWishlist(currentProduct.id) ? '❤️ تم الإضافة' : '🤍 أضف للمفضلة';
                notification.show(result.message, 'success');
            }
        });
    }
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '⭐';
    if (hasHalfStar) stars += '½⭐';
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) stars += '☆';
    return stars;
}

function renderTabs() {
    const container = document.getElementById('productTabs');
    if (!container) return;
    
    // وهمي للتقييمات
    const reviews = [
        { author: 'أحمد محمد', rating: 5, date: '2024-01-15', comment: 'منتج رائع جداً، أنصح به بشدة' },
        { author: 'سارة علي', rating: 4, date: '2024-01-10', comment: 'جودة ممتازة وسعر مناسب' },
        { author: 'محمد إبراهيم', rating: 5, date: '2024-01-05', comment: 'تسوق سريع ومنتج أصلي' }
    ];
    
    container.innerHTML = `
        <div class="product-tabs">
            <div class="tabs-header">
                <button class="tab-btn active" data-tab="description">📖 الوصف</button>
                <button class="tab-btn" data-tab="specs">📊 المواصفات</button>
                <button class="tab-btn" data-tab="reviews">⭐ التقييمات (${reviews.length})</button>
            </div>
            <div class="tabs-content">
                <div class="tab-pane active" data-pane="description">
                    <div class="full-description">
                        <h3>وصف المنتج</h3>
                        <p>${currentProduct.description || 'هذا منتج ممتاز وعالي الجودة من متجرنا المثالي. يتميز بتصميم عصري وجودة فائقة.'}</p>
                        <h4>لماذا تختار هذا المنتج؟</h4>
                        <ul>
                            <li>✓ جودة عالية ومواد أصلية</li>
                            <li>✓ ضمان لمدة عام كامل</li>
                            <li>✓ خدمة عملاء متوفرة 24/7</li>
                            <li>✓ شحن سريع لجميع المحافظات</li>
                        </ul>
                    </div>
                </div>
                <div class="tab-pane" data-pane="specs">
                    <table class="specs-table">
                        <tr><th>العلامة التجارية</th><td>${currentProduct.brand || 'متجري'}</td></tr>
                        <tr><th>التصنيف</th><td>${CATEGORIES.find(c => c.id === currentProduct.category)?.name || currentProduct.category}</td></tr>
                        <tr><th>الضمان</th><td>سنة كاملة</td></tr>
                        <tr><th>بلد المنشأ</th><td>مصر / الصين</td></tr>
                        <tr><th>رقم الموديل</th><td>MOD-${currentProduct.id}</td></tr>
                    </table>
                </div>
                <div class="tab-pane" data-pane="reviews">
                    <div class="reviews-summary">
                        <div class="average-rating">
                            <div class="big-rating">${currentProduct.rating.toFixed(1)}</div>
                            <div class="stars">${renderStars(currentProduct.rating)}</div>
                            <div>بناءً على ${currentProduct.reviews} تقييم</div>
                        </div>
                        <button class="btn-primary write-review-btn">✍️ كتابة تقييم</button>
                    </div>
                    <div class="reviews-list">
                        ${reviews.map(review => `
                            <div class="review-item">
                                <div class="review-header">
                                    <span class="review-author">${review.author}</span>
                                    <span class="review-date">${review.date}</span>
                                </div>
                                <div class="review-stars">${renderStars(review.rating)}</div>
                                <p class="review-comment">${review.comment}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // إضافة أحداث التبويبات
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            container.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.toggle('active', pane.dataset.pane === tab);
            });
        });
    });
}

function renderRelatedProducts() {
    const container = document.getElementById('relatedProducts');
    if (!container) return;
    
    const related = ALL_PRODUCTS
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    
    if (related.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = `
        <h3>🔄 منتجات مشابهة</h3>
        <div class="related-products-grid" id="relatedGrid"></div>
    `;
    
    const grid = container.querySelector('#relatedGrid');
    related.forEach(product => {
        new ProductCard(product, grid);
    });
}

function addToRecentlyViewed(product) {
    let recent = storage.get(STORAGE_KEYS.RECENTLY_VIEWED, []);
    recent = recent.filter(p => p.id !== product.id);
    recent.unshift({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        viewedAt: new Date().toISOString()
    });
    recent = recent.slice(0, 10);
    storage.set(STORAGE_KEYS.RECENTLY_VIEWED, recent);
}