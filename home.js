// الصفحة الرئيسية
document.addEventListener('DOMContentLoaded', () => {
    initHomePage();
});

async function initHomePage() {
    // عرض أقسام التحميل
    showLoadingSkeletons();
    
    // تحميل التصنيفات
    renderCategories();
    
    // تحميل المنتجات المميزة
    const featuredProducts = ALL_PRODUCTS.filter(p => p.id <= 12);
    renderProducts(featuredProducts, 'featuredProductsGrid');
    
    // تحميل الأكثر مبيعاً
    const bestsellers = [...ALL_PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 8);
    renderProducts(bestsellers, 'bestsellersGrid');
    
    // تحميل العروض الخاصة
    const offers = ALL_PRODUCTS.filter(p => p.discount >= 40).slice(0, 4);
    renderProducts(offers, 'offersGrid');
    
    // عرض البانر
    renderHeroSlider();
    
    analytics.trackPageView('home');
}

function showLoadingSkeletons() {
    const grids = ['featuredProductsGrid', 'bestsellersGrid', 'offersGrid'];
    grids.forEach(gridId => {
        const grid = document.getElementById(gridId);
        if (grid) {
            grid.innerHTML = Array(4).fill(0).map(() => `
                <div class="product-card skeleton-card">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-title"></div>
                    <div class="skeleton-price"></div>
                </div>
            `).join('');
        }
    });
}

function renderCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    container.innerHTML = CATEGORIES.map(cat => `
        <div class="category-card" onclick="filterByCategory('${cat.id}')">
            <div class="category-icon" style="background: ${cat.color}20; color: ${cat.color}">
                ${cat.icon}
            </div>
            <h4>${cat.name}</h4>
            <span class="category-count">${cat.count} منتج</span>
        </div>
    `).join('');
}

function renderHeroSlider() {
    const container = document.getElementById('heroSlider');
    if (!container) return;
    
    const slides = [
        {
            title: '🔥 عروض الصيف',
            subtitle: 'خصم يصل إلى 50% على جميع المنتجات',
            bg: 'linear-gradient(135deg, #ff6b35, #f43f00)',
            btnText: 'تسوق الآن',
            btnLink: '#'
        },
        {
            title: '📱 أحدث الأجهزة',
            subtitle: 'هواتف وتابلت بأفضل الأسعار',
            bg: 'linear-gradient(135deg, #3b82f6, #1e40af)',
            btnText: 'اكتشف المزيد',
            btnLink: '#'
        },
        {
            title: '👗 موضة الصيف',
            subtitle: 'أحدث التشكيلات بخصم 40%',
            bg: 'linear-gradient(135deg, #ec4899, #be185d)',
            btnText: 'تسوق الآن',
            btnLink: '#'
        }
    ];
    
    container.innerHTML = `
        <div class="hero-slider-container">
            <div class="hero-slides">
                ${slides.map((slide, index) => `
                    <div class="hero-slide ${index === 0 ? 'active' : ''}" style="background: ${slide.bg}">
                        <div class="hero-content">
                            <h1>${slide.title}</h1>
                            <p>${slide.subtitle}</p>
                            <button class="hero-btn" onclick="window.location.href='pages/shop.html'">${slide.btnText} →</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="slider-prev">❮</button>
            <button class="slider-next">❯</button>
            <div class="slider-dots">
                ${slides.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('')}
            </div>
        </div>
    `;
    
    // إضافة أحداث السلايدر
    let currentSlide = 0;
    const slidesCount = slides.length;
    const slideElements = container.querySelectorAll('.hero-slide');
    const dots = container.querySelectorAll('.dot');
    const prevBtn = container.querySelector('.slider-prev');
    const nextBtn = container.querySelector('.slider-next');
    
    function showSlide(index) {
        slideElements.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slidesCount;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slidesCount) % slidesCount;
        showSlide(currentSlide);
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => showSlide(i));
    });
    
    setInterval(nextSlide, 5000);
}

function filterByCategory(categoryId) {
    window.location.href = `pages/shop.html?category=${categoryId}`;
}