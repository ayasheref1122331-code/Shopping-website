// مكون أزرار التصفح
class PaginationComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            totalItems: 0,
            itemsPerPage: 12,
            currentPage: 1,
            onPageChange: null,
            maxButtons: 5,
            ...options
        };
        this.render();
    }
    
    get totalPages() {
        return Math.ceil(this.options.totalItems / this.options.itemsPerPage);
    }
    
    render() {
        if (!this.container) return;
        if (this.totalPages <= 1) {
            this.container.innerHTML = '';
            return;
        }
        
        let html = '<div class="pagination">';
        
        // زر السابق
        if (this.options.currentPage > 1) {
            html += `<button class="page-btn prev" data-page="${this.options.currentPage - 1}">« السابق</button>`;
        }
        
        // أرقام الصفحات
        const startPage = Math.max(1, this.options.currentPage - Math.floor(this.options.maxButtons / 2));
        const endPage = Math.min(this.totalPages, startPage + this.options.maxButtons - 1);
        
        if (startPage > 1) {
            html += `<button class="page-btn" data-page="1">1</button>`;
            if (startPage > 2) html += `<span class="page-dots">...</span>`;
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="page-btn ${i === this.options.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) html += `<span class="page-dots">...</span>`;
            html += `<button class="page-btn" data-page="${this.totalPages}">${this.totalPages}</button>`;
        }
        
        // زر التالي
        if (this.options.currentPage < this.totalPages) {
            html += `<button class="page-btn next" data-page="${this.options.currentPage + 1}">التالي »</button>`;
        }
        
        html += '</div>';
        
        this.container.innerHTML = html;
        this.attachEvents();
    }
    
    attachEvents() {
        this.container.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (!isNaN(page) && page !== this.options.currentPage) {
                    this.goToPage(page);
                }
            });
        });
    }
    
    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.options.currentPage = page;
        this.render();
        if (this.options.onPageChange) {
            this.options.onPageChange(page);
        }
    }
    
    update(totalItems, currentPage = 1) {
        this.options.totalItems = totalItems;
        this.options.currentPage = currentPage;
        this.render();
    }
}