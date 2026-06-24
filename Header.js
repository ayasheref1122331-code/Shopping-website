// مكون الهيدر
class HeaderComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.attachEvents();
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <nav class="navbar">
                <div class="nav-container">
                    <div class="logo" onclick="window.location.href='index.html'">
                        <span class="logo-icon">🛍️</span>
                        <span class="logo-text">متجري المثالي</span>
                    </div>
                    <div class="search-bar">
                        <input type="text" id="headerSearch" placeholder="ابحث عن منتج...">
                        <button id="headerSearchBtn">🔍</button>
                    </div>
                    <div class="nav-icons">
                        <button class="nav-icon" id="darkModeToggle" title="الوضع المظلم">🌙</button>
                        <button class="nav-icon" id="wishlistNavBtn" title="المفضلة">
                            ❤️ <span id="wishlistCount">0</span>
                        </button>
                        <button class="nav-icon" id="cartNavBtn" title="السلة">
                            🛒 <span id="cartCount">0</span>
                        </button>
                        <button class="nav-icon" id="userNavBtn" title="حسابي">
                            👤
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }
    
    attachEvents() {
        const searchInput = document.getElementById('headerSearch');
        const searchBtn = document.getElementById('headerSearchBtn');
        const darkModeToggle = document.getElementById('darkModeToggle');
        const wishlistBtn = document.getElementById('wishlistNavBtn');
        const cartBtn = document.getElementById('cartNavBtn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const term = searchInput.value;
                if (term) window.location.href = `pages/shop.html?search=${encodeURIComponent(term)}`;
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const term = searchInput.value;
                    if (term) window.location.href = `pages/shop.html?search=${encodeURIComponent(term)}`;
                }
            });
        }
        
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                storage.set(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
                darkModeToggle.textContent = isDark ? '☀️' : '🌙';
                notification.show(isDark ? 'تم تفعيل الوضع المظلم' : 'تم تفعيل الوضع المضيء', 'info', 2000);
            });
        }
        
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                window.location.href = 'pages/wishlist.html';
            });
        }
        
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                window.location.href = 'pages/cart.html';
            });
        }
        
        // تحديث العداد
        cartService.addListener(() => {
            const count = document.getElementById('cartCount');
            if (count) count.textContent = cartService.getItemCount();
        });
        
        wishlistService.addListener(() => {
            const count = document.getElementById('wishlistCount');
            if (count) count.textContent = wishlistService.getCount();
        });
    }
}

// تهيئة الهيدر
document.addEventListener('DOMContentLoaded', () => {
    new HeaderComponent('main-header');
});