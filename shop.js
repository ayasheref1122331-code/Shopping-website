// صفحة المتجر
let currentPage = 1;
let currentCategory = 'all';
let currentSort = 'default';
let currentSearch = '';
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    initShopPage();
});

function initShopPage() {
    // قراءة معلمات URL
    const params = new URLSearchParams(window.location.search);
    currentCategory = params.get('category') || 'all';
    currentSearch = params.get('search') || '';
    currentSort = params.get('sort') || 'default';
    currentPage = parseInt(params.get('page')) || 1;
    
    // تعيين القيم في الواجهة
    const categorySelect = document.getElementById('categoryFilter');
    if (categorySelect && currentCategory !== 'all') {
        categorySelect.value = currentCategory;
    }
    
    const searchInput = document.getElementById('shopSearch');
    if (searchInput && currentSearch) {
        searchInput.value = currentSearch;
    }
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = currentSort;
    }
    
    // تحميل المنتجات
    loadShopProducts();
    
    // إضافة مستمعي الأحداث
    attachShopEvents();
    
    analytics.trackPageView('shop');
}

function loadShopProducts() {
    // تصفية المنتجات
    filteredProducts = [...ALL_PRODUCTS];
    
    // تصفية حسب التصنيف
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
    }
    
    // تصفية حسب البحث
    if (currentSearch) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
            p.brand?.toLowerCase().includes(currentSearch.toLowerCase())
        );
        analytics.trackSearch(currentSearch, filteredProducts.length);
    }
    
    // ترتيب المنتجات
    filteredProducts = sortProducts(filteredProducts, currentSort);
    
    // تحديث عدد النتائج
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `عرض ${filteredProducts.length} منتج`;
    }
    
    // حساب التصفح
    const start = (currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
    const paginated = filteredProducts.slice(start, start + CONFIG.ITEMS_PER_PAGE);
    
    // عرض المنتجات
    renderProducts(paginated, 'productsGrid');
    
    // تحديث التصفح
    updatePagination();
    
    // تحديث الفلاتر الجانبية
    updateSidebarFilters();
}

function sortProducts(products, sortType) {
    switch(sortType) {
        case 'price-asc':
            return products.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return products.sort((a, b) => b.price - a.price);
        case 'rating':
            return products.sort((a, b) => b.rating - a.rating);
        case 'popularity':
            return products.sort((a, b) => b.sold - a.sold);
        case 'newest':
            return products.sort((a, b) => b.id - a.id);
        default:
            return products;
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / CONFIG.ITEMS_PER_PAGE);
    const container = document.getElementById('pagination');
    
    if (!container || totalPages <= 1) {
        if (container) container.innerHTML = '';
        return;
    }
    
    let html = '<div class="pagination">';
    
    if (currentPage > 1) {
        html += `<button class="page-btn" data-page="${currentPage - 1}">« السابق</button>`;
    }
    
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    if (currentPage < totalPages) {
        html += `<button class="page-btn" data-page="${currentPage + 1}">التالي »</button>`;
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    container.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (!isNaN(page)) {
                changePage(page);
            }
        });
    });
}

function changePage(page) {
    currentPage = page;
    updateURL();
    loadShopProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateURL() {
    const params = new URLSearchParams();
    if (currentCategory !== 'all') params.set('category', currentCategory);
    if (currentSearch) params.set('search', currentSearch);
    if (currentSort !== 'default') params.set('sort', currentSort);
    if (currentPage > 1) params.set('page', currentPage);
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newURL);
}

function attachShopEvents() {
    // حدث تغيير التصنيف
    const categorySelect = document.getElementById('categoryFilter');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            currentPage = 1;
            updateURL();
            loadShopProducts();
        });
    }
    
    // حدث البحث
    const searchBtn = document.getElementById('shopSearchBtn');
    const searchInput = document.getElementById('shopSearch');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            currentSearch = searchInput.value;
            currentPage = 1;
            updateURL();
            loadShopProducts();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                currentSearch = searchInput.value;
                currentPage = 1;
                updateURL();
                loadShopProducts();
            }
        });
    }
    
    // حدث الترتيب
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            currentPage = 1;
            updateURL();
            loadShopProducts();
        });
    }
    
    // أحداث العرض (شبكة/قائمة)
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    const productsGrid = document.getElementById('productsGrid');
    
    if (gridView && listView && productsGrid) {
        gridView.addEventListener('click', () => {
            productsGrid.classList.remove('list-view');
            productsGrid.classList.add('products-grid');
            gridView.classList.add('active');
            listView.classList.remove('active');
            storage.set('shop_view', 'grid');
        });
        
        listView.addEventListener('click', () => {
            productsGrid.classList.add('list-view');
            productsGrid.classList.remove('products-grid');
            listView.classList.add('active');
            gridView.classList.remove('active');
            storage.set('shop_view', 'list');
        });
        
        // استعادة العرض المحفوظ
        const savedView = storage.get('shop_view', 'grid');
        if (savedView === 'list') {
            listView.click();
        }
    }
}

function updateSidebarFilters() {
    // تحديث أسعار الفلتر
    const minPrice = Math.min(...ALL_PRODUCTS.map(p => p.price));
    const maxPrice = Math.max(...ALL_PRODUCTS.map(p => p.price));
    
    const priceRange = document.getElementById('priceRange');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (priceRange) {
        priceRange.min = minPrice;
        priceRange.max = maxPrice;
        priceRange.value = maxPrice;
    }
}

function clearAllFilters() {
    currentCategory = 'all';
    currentSearch = '';
    currentSort = 'default';
    currentPage = 1;
    
    const categorySelect = document.getElementById('categoryFilter');
    if (categorySelect) categorySelect.value = 'all';
    
    const searchInput = document.getElementById('shopSearch');
    if (searchInput) searchInput.value = '';
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'default';
    
    updateURL();
    loadShopProducts();
}