// مكون بطاقة المنتج
class ProductCard {
    constructor(product, container, options = {}) {
        this.product = product;
        this.container = container;
        this.options = options;
        this.render();
    }
    
    render() {
        const discount = this.product.discount;
        const isInWishlist = wishlistService.isInWishlist(this.product.id);
        const stockStatus = this.product.stock > 0 ? 'in-stock' : 'out-stock';
        const stockText = this.product.stock > 0 ? `✅ متوفر (${this.product.stock})` : '❌ غير متوفر';
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-id', this.product.id);
        
        card.innerHTML = `
            ${discount > 0 ? `<div class="product-badge">-${discount}%</div>` : ''}
            <div class="product-wishlist ${isInWishlist ? 'active' : ''}" data-id="${this.product.id}">
                ${isInWishlist ? '❤️' : '🤍'}
            </div>
            <div class="product-image" data-id="${this.product.id}">
                <img src="${this.product.image}" alt="${this.product.name}" loading="lazy">
                <div class="product-quick-view" data-id="${this.product.id}">👁️ معاينة سريعة</div>
            </div>
            <div class="product-info" data-id="${this.product.id}">
                <h3 class="product-title">${Helpers.truncate(this.product.name, 30)}</h3>
                <div class="product-brand">${this.product.brand || 'متجري'}</div>
                <div class="product-rating">
                    <div class="stars">${this.renderStars(this.product.rating)}</div>
                    <span class="reviews-count">(${this.product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${Formatters.formatPrice(this.product.price)}</span>
                    ${this.product.oldPrice ? `<span class="old-price">${Formatters.formatPrice(this.product.oldPrice)}</span>` : ''}
                </div>
                <div class="product-stock ${stockStatus}">${stockText}</div>
            </div>
            <div class="product-actions">
                <button class="add-to-cart-btn" data-id="${this.product.id}" ${this.product.stock === 0 ? 'disabled' : ''}>
                    ${this.product.stock > 0 ? '🛒 أضف إلى السلة' : '🚫 نفد من المخزون'}
                </button>
            </div>
        `;
        
        this.container.appendChild(card);
        this.attachEvents(card);
    }
    
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '⭐';
        if (hasHalfStar) stars += '½⭐';
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) stars += '☆';
        return stars;
    }
    
    attachEvents(card) {
        const wishlistBtn = card.querySelector('.product-wishlist');
        const imageDiv = card.querySelector('.product-image');
        const infoDiv = card.querySelector('.product-info');
        const quickView = card.querySelector('.product-quick-view');
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const result = wishlistService.toggleItem(this.product);
                if (result.success) {
                    notification.show(result.message, 'success', 1500);
                    wishlistBtn.innerHTML = wishlistService.isInWishlist(this.product.id) ? '❤️' : '🤍';
                    wishlistBtn.classList.toggle('active');
                }
            });
        }
        
        if (imageDiv) {
            imageDiv.addEventListener('click', () => {
                window.location.href = `product-detail.html?id=${this.product.id}`;
            });
        }
        
        if (infoDiv) {
            infoDiv.addEventListener('click', () => {
                window.location.href = `product-detail.html?id=${this.product.id}`;
            });
        }
        
        if (quickView) {
            quickView.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showQuickView();
            });
        }
        
        if (addToCartBtn && this.product.stock > 0) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const result = cartService.addItem(this.product);
                notification.show(result.message, result.success ? 'success' : 'error');
                if (result.success) {
                    Animations.pulse(addToCartBtn);
                }
            });
        }
    }
    
    showQuickView() {
        const modal = new Modal({
            title: this.product.name,
            size: 'lg',
            content: `
                <div class="quick-view-container">
                    <div class="quick-view-image">
                        <img src="${this.product.image}" alt="${this.product.name}">
                    </div>
                    <div class="quick-view-info">
                        <div class="product-rating">${this.renderStars(this.product.rating)} (${this.product.reviews} تقييم)</div>
                        <div class="product-price-large">
                            <span class="current-price-large">${Formatters.formatPrice(this.product.price)}</span>
                            ${this.product.oldPrice ? `<span class="old-price-large">${Formatters.formatPrice(this.product.oldPrice)}</span>` : ''}
                        </div>
                        <p class="product-description">${this.product.description || 'منتج عالي الجودة من متجرنا المثالي'}</p>
                        <div class="product-stock ${this.product.stock > 0 ? 'in-stock' : 'out-stock'}">
                            ${this.product.stock > 0 ? `✅ متوفر (${this.product.stock} قطعة)` : '❌ غير متوفر'}
                        </div>
                        <div class="product-actions-large">
                            <button class="btn-primary" id="quickAddToCart">🛒 أضف إلى السلة</button>
                            <button class="btn-outline" id="quickViewDetails">📖 تفاصيل</button>
                        </div>
                    </div>
                </div>
            `
        });
        
        modal.open();
        
        setTimeout(() => {
            const addBtn = document.getElementById('quickAddToCart');
            const detailsBtn = document.getElementById('quickViewDetails');
            
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    const result = cartService.addItem(this.product);
                    notification.show(result.message, result.success ? 'success' : 'error');
                    if (result.success) modal.close();
                });
            }
            
            if (detailsBtn) {
                detailsBtn.addEventListener('click', () => {
                    modal.close();
                    window.location.href = `product-detail.html?id=${this.product.id}`;
                });
            }
        }, 100);
    }
}

// دالة لعرض منتجات متعددة
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    products.forEach(product => {
        new ProductCard(product, container);
    });
}

window.renderProducts = renderProducts;