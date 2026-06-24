// مكون الفوتر
class FooterComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
        this.attachEvents();
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <footer class="footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <h4>🛍️ متجري المثالي</h4>
                        <p>أفضل تجربة تسوق إلكتروني في مصر. نوفر لك أفضل المنتجات بأفضل الأسعار مع توصيل سريع.</p>
                        <div class="social-links">
                            <a href="${CONFIG.SOCIAL_LINKS.facebook}" target="_blank">📘</a>
                            <a href="${CONFIG.SOCIAL_LINKS.instagram}" target="_blank">📷</a>
                            <a href="${CONFIG.SOCIAL_LINKS.twitter}" target="_blank">🐦</a>
                            <a href="${CONFIG.SOCIAL_LINKS.whatsapp}" target="_blank">💬</a>
                        </div>
                    </div>
                    <div class="footer-section">
                        <h4>روابط سريعة</h4>
                        <ul>
                            <li><a href="../index.html">الرئيسية</a></li>
                            <li><a href="shop.html">المتجر</a></li>
                            <li><a href="#">العروض</a></li>
                            <li><a href="#">المدونة</a></li>
                            <li><a href="#">اتصل بنا</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>خدمات العملاء</h4>
                        <ul>
                            <li><a href="#">سياسة الاستبدال</a></li>
                            <li><a href="#">الشحن والتوصيل</a></li>
                            <li><a href="#">طرق الدفع</a></li>
                            <li><a href="#">الأسئلة الشائعة</a></li>
                            <li><a href="#">الشروط والأحكام</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>اشترك في النشرة البريدية</h4>
                        <p>احصل على أحدث العروض والخصومات</p>
                        <div class="newsletter-form">
                            <input type="email" id="newsletterEmail" placeholder="بريدك الإلكتروني">
                            <button id="newsletterSubscribe">اشتراك</button>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>© 2025 متجري المثالي - جميع الحقوق محفوظة</p>
                </div>
            </footer>
        `;
    }
    
    attachEvents() {
        const subscribeBtn = document.getElementById('newsletterSubscribe');
        const emailInput = document.getElementById('newsletterEmail');
        
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', () => {
                const email = emailInput.value;
                if (Validators.validateEmail(email)) {
                    notification.success('تم الاشتراك بنجاح! ستصل أحدث العروض لبريدك');
                    emailInput.value = '';
                } else {
                    notification.error('يرجى إدخال بريد إلكتروني صحيح');
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FooterComponent('main-footer');
});