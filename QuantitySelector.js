// مكون اختيار الكمية
class QuantitySelectorComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            quantity: 1,
            min: 1,
            max: 99,
            stock: 99,
            onchange: null,
            ...options
        };
        this.render();
        this.attachEvents();
    }
    
    render() {
        if (!this.container) return;
        
        this.container.className = 'quantity-selector';
        this.container.innerHTML = `
            <button class="qty-btn qty-minus" ${this.options.quantity <= this.options.min ? 'disabled' : ''}>-</button>
            <input type="number" class="qty-input" value="${this.options.quantity}" 
                   min="${this.options.min}" max="${Math.min(this.options.max, this.options.stock)}">
            <button class="qty-btn qty-plus" ${this.options.quantity >= Math.min(this.options.max, this.options.stock) ? 'disabled' : ''}>+</button>
        `;
        
        this.input = this.container.querySelector('.qty-input');
        this.minusBtn = this.container.querySelector('.qty-minus');
        this.plusBtn = this.container.querySelector('.qty-plus');
    }
    
    attachEvents() {
        this.minusBtn.addEventListener('click', () => {
            let val = parseInt(this.input.value) - 1;
            if (val >= this.options.min) {
                this.setQuantity(val);
            }
        });
        
        this.plusBtn.addEventListener('click', () => {
            let val = parseInt(this.input.value) + 1;
            if (val <= Math.min(this.options.max, this.options.stock)) {
                this.setQuantity(val);
            }
        });
        
        this.input.addEventListener('change', () => {
            let val = parseInt(this.input.value);
            if (isNaN(val)) val = this.options.min;
            val = Math.max(this.options.min, Math.min(val, this.options.stock, this.options.max));
            this.setQuantity(val);
        });
    }
    
    setQuantity(quantity) {
        if (quantity === this.options.quantity) return;
        
        this.options.quantity = quantity;
        this.input.value = quantity;
        
        this.minusBtn.disabled = quantity <= this.options.min;
        this.plusBtn.disabled = quantity >= Math.min(this.options.max, this.options.stock);
        
        if (this.options.onchange) {
            this.options.onchange(quantity);
        }
    }
    
    getQuantity() {
        return parseInt(this.input.value);
    }
    
    setMaxStock(stock) {
        this.options.stock = stock;
        this.input.max = Math.min(this.options.max, stock);
        if (this.getQuantity() > stock) {
            this.setQuantity(stock);
        }
    }
}