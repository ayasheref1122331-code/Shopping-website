// مcomponent علامات التبويب
class TabsComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            tabs: [],
            activeTab: 0,
            onTabChange: null,
            ...options
        };
        this.render();
        this.attachEvents();
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="tabs-header">
                ${this.options.tabs.map((tab, index) => `
                    <button class="tab-btn ${index === this.options.activeTab ? 'active' : ''}" data-tab="${index}">
                        ${tab.icon ? `<span class="tab-icon">${tab.icon}</span>` : ''}
                        ${tab.title}
                    </button>
                `).join('')}
            </div>
            <div class="tabs-content">
                ${this.options.tabs.map((tab, index) => `
                    <div class="tab-pane ${index === this.options.activeTab ? 'active' : ''}" data-pane="${index}">
                        ${tab.content}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    attachEvents() {
        this.container.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabIndex = parseInt(btn.dataset.tab);
                this.switchTab(tabIndex);
            });
        });
    }
    
    switchTab(tabIndex) {
        if (tabIndex === this.options.activeTab) return;
        
        // تحديث الأزرار
        this.container.querySelectorAll('.tab-btn').forEach((btn, i) => {
            if (i === tabIndex) btn.classList.add('active');
            else btn.classList.remove('active');
        });
        
        // تحديث المحتوى
        this.container.querySelectorAll('.tab-pane').forEach((pane, i) => {
            if (i === tabIndex) pane.classList.add('active');
            else pane.classList.remove('active');
        });
        
        this.options.activeTab = tabIndex;
        if (this.options.onTabChange) {
            this.options.onTabChange(tabIndex);
        }
    }
    
    updateContent(tabIndex, content) {
        const pane = this.container.querySelector(`.tab-pane[data-pane="${tabIndex}"]`);
        if (pane) pane.innerHTML = content;
    }
    
    getActiveTab() {
        return this.options.activeTab;
    }
}