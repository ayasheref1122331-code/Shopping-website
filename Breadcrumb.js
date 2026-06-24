// مكون مسار التنقل
class BreadcrumbComponent {
    constructor(containerId, items) {
        this.container = document.getElementById(containerId);
        this.items = items;
        this.render();
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="breadcrumb">
                <a href="../index.html">🏠 الرئيسية</a>
                ${this.items.map((item, index) => `
                    ${index < this.items.length - 1 ? 
                        `<span>›</span><a href="${item.link}">${item.name}</a>` : 
                        `<span>›</span><span class="current">${item.name}</span>`
                    }
                `).join('')}
            </div>
        `;
    }
}