// مكون شاشة التحميل
class LoaderComponent {
    constructor() {
        this.loader = null;
    }
    
    show(message = 'جاري التحميل...') {
        this.hide();
        
        this.loader = document.createElement('div');
        this.loader.className = 'global-loader';
        this.loader.innerHTML = `
            <div class="loader-overlay">
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <p class="loader-message">${message}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.loader);
        
        // إضافة CSS للـ loader
        if (!document.getElementById('loader-styles')) {
            const styles = document.createElement('style');
            styles.id = 'loader-styles';
            styles.textContent = `
                .global-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                }
                .loader-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .loader-content {
                    background: var(--bg-primary);
                    padding: 30px 40px;
                    border-radius: 16px;
                    text-align: center;
                    box-shadow: var(--shadow-xl);
                }
                .loader-spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid var(--gray-200);
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    animation: loaderSpin 1s linear infinite;
                    margin: 0 auto 16px;
                }
                @keyframes loaderSpin {
                    to { transform: rotate(360deg); }
                }
                .loader-message {
                    color: var(--text-primary);
                    font-size: 14px;
                }
            `;
            document.head.appendChild(styles);
        }
        
        return this.loader;
    }
    
    hide() {
        if (this.loader && this.loader.parentNode) {
            this.loader.parentNode.removeChild(this.loader);
            this.loader = null;
        }
    }
    
    async withLoader(promise, message = 'جاري التحميل...') {
        this.show(message);
        try {
            const result = await promise;
            return result;
        } finally {
            this.hide();
        }
    }
}

const loader = new LoaderComponent();
window.loader = loader;