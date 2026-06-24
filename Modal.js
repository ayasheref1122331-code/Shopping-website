// مكون النافذة المنبثقة
class Modal {
    constructor(options = {}) {
        this.options = {
            title: '',
            content: '',
            size: 'medium',
            closable: true,
            onClose: null,
            onOpen: null,
            ...options
        };
        this.element = null;
        this.create();
    }
    
    create() {
        this.element = document.createElement('div');
        this.element.className = `modal modal-${this.options.size}`;
        
        this.element.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h3>${this.options.title}</h3>
                    ${this.options.closable ? '<button class="modal-close">&times;</button>' : ''}
                </div>
                <div class="modal-body">
                    ${this.options.content}
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-cancel">إلغاء</button>
                    <button class="btn-primary modal-confirm">تأكيد</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.element);
        this.attachEvents();
    }
    
    attachEvents() {
        if (this.options.closable) {
            const closeBtn = this.element.querySelector('.modal-close');
            const overlay = this.element.querySelector('.modal-overlay');
            const cancelBtn = this.element.querySelector('.modal-cancel');
            
            if (closeBtn) closeBtn.addEventListener('click', () => this.close());
            if (overlay) overlay.addEventListener('click', () => this.close());
            if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());
        }
        
        const confirmBtn = this.element.querySelector('.modal-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (this.options.onConfirm) this.options.onConfirm();
                this.close();
            });
        }
    }
    
    open() {
        this.element.classList.add('show');
        document.body.style.overflow = 'hidden';
        if (this.options.onOpen) this.options.onOpen();
    }
    
    close() {
        this.element.classList.remove('show');
        document.body.style.overflow = '';
        if (this.options.onClose) this.options.onClose();
        setTimeout(() => {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }, 300);
    }
    
    updateContent(content) {
        const body = this.element.querySelector('.modal-body');
        if (body) body.innerHTML = content;
    }
    
    updateTitle(title) {
        const header = this.element.querySelector('.modal-header h3');
        if (header) header.textContent = title;
    }
}

window.Modal = Modal;