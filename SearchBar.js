// مكون شريط البحث - النسخة النهائية مع سجل البحث
class SearchBarComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            placeholder: 'ابحث عن منتجات...',
            onSearch: null,
            debounceDelay: 300,
            saveHistory: true,
            maxHistoryItems: 10,
            ...options
        };
        this.suggestions = [];
        this.searchHistory = this.loadSearchHistory();
        this.render();
        this.attachEvents();
    }
    
    loadSearchHistory() {
        return storage.get('search_history', []);
    }
    
    saveSearchHistory() {
        storage.set('search_history', this.searchHistory.slice(0, this.options.maxHistoryItems));
    }
    
    addToHistory(term) {
        if (!term.trim()) return;
        
        // إزالة التكرارات
        this.searchHistory = this.searchHistory.filter(item => item.term !== term);
        
        // إضافة في البداية
        this.searchHistory.unshift({
            term: term,
            date: new Date().toISOString()
        });
        
        // قص إلى أقصى عدد
        if (this.searchHistory.length > this.options.maxHistoryItems) {
            this.searchHistory = this.searchHistory.slice(0, this.options.maxHistoryItems);
        }
        
        this.saveSearchHistory();
    }
    
    clearHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
        this.hideSuggestions();
        toast.success('تم مسح سجل البحث');
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="search-bar-component">
                <div class="search-input-wrapper">
                    <input type="text" 
                           class="search-input" 
                           id="searchInputField"
                           placeholder="${this.options.placeholder}"
                           autocomplete="off">
                    <button class="search-button" id="searchButton">🔍 بحث</button>
                </div>
                <div class="search-suggestions" id="searchSuggestions" style="display: none;"></div>
            </div>
        `;
        
        this.input = document.getElementById('searchInputField');
        this.suggestionsContainer = document.getElementById('searchSuggestions');
        this.searchBtn = document.getElementById('searchButton');
    }
    
    attachEvents() {
        // زر البحث
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.performSearch());
        }
        
        // البحث عند الكتابة
        if (this.input) {
            this.input.addEventListener('input', Helpers.debounce(() => {
                const term = this.input.value.trim();
                if (term.length >= 2) {
                    this.showSuggestions(term);
                } else if (term.length === 0) {
                    this.showHistorySuggestions();
                } else {
                    this.hideSuggestions();
                }
            }, this.options.debounceDelay));
            
            // البحث عند الضغط على Enter
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch();
                }
            });
            
            // عند الضغط على الحقل، عرض سجل البحث
            this.input.addEventListener('focus', () => {
                if (this.input.value.trim() === '') {
                    this.showHistorySuggestions();
                }
            });
        }
        
        // إغلاق الاقتراحات عند الضغط خارجها
        document.addEventListener('click', (e) => {
            if (this.container && !this.container.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }
    
    showHistorySuggestions() {
        if (this.searchHistory.length === 0) {
            this.suggestionsContainer.innerHTML = '<div class="suggestion-empty">📭 لا توجد عمليات بحث سابقة</div>';
            this.suggestionsContainer.style.display = 'block';
            return;
        }
        
        this.suggestionsContainer.innerHTML = `
            <div class="suggestions-header">
                <span>🕐 عمليات البحث الأخيرة</span>
                <button class="clear-history-btn" id="clearHistoryBtn">مسح الكل</button>
            </div>
            ${this.searchHistory.map(item => `
                <div class="suggestion-item history-item" data-term="${item.term}">
                    <span class="history-icon">🕐</span>
                    <span class="suggestion-term">${item.term}</span>
                    <button class="delete-history-item" data-term="${item.term}">🗑️</button>
                </div>
            `).join('')}
        `;
        
        // إضافة حدث مسح الكل
        const clearBtn = this.suggestionsContainer.querySelector('#clearHistoryBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearHistory();
                this.showHistorySuggestions();
            });
        }
        
        // إضافة حدث لكل عنصر في السجل
        this.suggestionsContainer.querySelectorAll('.history-item').forEach(item => {
            const term = item.dataset.term;
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-history-item')) {
                    this.input.value = term;
                    this.performSearch();
                }
            });
        });
        
        // إضافة حدث حذف عنصر فردي
        this.suggestionsContainer.querySelectorAll('.delete-history-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const term = btn.dataset.term;
                this.searchHistory = this.searchHistory.filter(h => h.term !== term);
                this.saveSearchHistory();
                this.showHistorySuggestions();
                toast.info(`تم حذف "${term}" من سجل البحث`);
            });
        });
        
        this.suggestionsContainer.style.display = 'block';
    }
    
    showSuggestions(term) {
        // البحث في المنتجات
        const suggestions = ALL_PRODUCTS
            .filter(p => p.name.toLowerCase().includes(term.toLowerCase()) || 
                        (p.brand && p.brand.toLowerCase().includes(term.toLowerCase())))
            .slice(0, 5);
        
        // البحث في سجل البحث السابق
        const historyMatches = this.searchHistory
            .filter(h => h.term.toLowerCase().includes(term.toLowerCase()))
            .slice(0, 3);
        
        if (suggestions.length === 0 && historyMatches.length === 0) {
            this.suggestionsContainer.innerHTML = `
                <div class="suggestion-no-results">
                    🔍 لا توجد نتائج لـ "${term}"
                    <br>
                    <small>جرب كلمات أخرى</small>
                </div>
            `;
            this.suggestionsContainer.style.display = 'block';
            return;
        }
        
        let html = '';
        
        // اقتراحات من سجل البحث
        if (historyMatches.length > 0) {
            html += `<div class="suggestions-section">
                        <div class="section-title">🕐 من سجل البحث</div>
                        ${historyMatches.map(item => `
                            <div class="suggestion-item history-suggestion" data-term="${item.term}">
                                <span class="history-icon">🕐</span>
                                <span>${item.term}</span>
                            </div>
                        `).join('')}
                    </div>`;
        }
        
        // اقتراحات من المنتجات
        if (suggestions.length > 0) {
            html += `<div class="suggestions-section">
                        <div class="section-title">📦 منتجات</div>
                        ${suggestions.map(product => `
                            <div class="suggestion-item" data-id="${product.id}">
                                <img src="${product.image}" alt="${product.name}" width="40" height="40">
                                <div class="suggestion-info">
                                    <div class="suggestion-name">${product.name}</div>
                                    <div class="suggestion-price">${Formatters.formatPrice(product.price)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`;
        }
        
        this.suggestionsContainer.innerHTML = html;
        
        // أحداث اقتراحات سجل البحث
        this.suggestionsContainer.querySelectorAll('.history-suggestion').forEach(item => {
            const term = item.dataset.term;
            item.addEventListener('click', () => {
                this.input.value = term;
                this.performSearch();
            });
        });
        
        // أحداث اقتراحات المنتجات
        this.suggestionsContainer.querySelectorAll('.suggestion-item[data-id]').forEach(item => {
            const id = parseInt(item.dataset.id);
            item.addEventListener('click', () => {
                window.location.href = `pages/product-detail.html?id=${id}`;
            });
        });
        
        this.suggestionsContainer.style.display = 'block';
    }
    
    hideSuggestions() {
        if (this.suggestionsContainer) {
            this.suggestionsContainer.style.display = 'none';
        }
    }
    
    performSearch() {
        const term = this.input.value.trim();
        if (term) {
            // حفظ في سجل البحث
            this.addToHistory(term);
            
            // تحليل البحث
            analytics.trackSearch(term, 0);
            
            // التوجيه لصفحة البحث
            if (this.options.onSearch) {
                this.options.onSearch(term);
            } else {
                window.location.href = `pages/shop.html?search=${encodeURIComponent(term)}`;
            }
        } else {
            toast.warning('الرجاء إدخال كلمة البحث');
        }
    }
    
    setValue(value) {
        if (this.input) this.input.value = value;
    }
    
    getValue() {
        return this.input ? this.input.value : '';
    }
    
    clear() {
        if (this.input) this.input.value = '';
        this.hideSuggestions();
    }
}

window.SearchBarComponent = SearchBarComponent;