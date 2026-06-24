// دوال مساعدة عامة
const Helpers = {
    // توليد ID فريد
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // تنسيق التاريخ
    formatDate(date, format = 'ar') {
        const d = new Date(date);
        if (format === 'ar') {
            return d.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return d.toISOString().split('T')[0];
    },
    
    // تأخير (sleep)
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // نسخ النص
    copyToClipboard(text) {
        navigator.clipboard.writeText(text);
    },
    
    // الحصول على معلمات URL
    getUrlParams() {
        const params = {};
        new URLSearchParams(window.location.search).forEach((value, key) => {
            params[key] = value;
        });
        return params;
    },
    
    // منع التكرار
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // تحديد عدد مرات التنفيذ
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // التحقق من البريد الإلكتروني
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // التحقق من رقم الهاتف المصري
    isValidEgyptianPhone(phone) {
        const re = /^(010|011|012|015)[0-9]{8}$/;
        return re.test(phone);
    },
    
    // التحقق من فارغ
    isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    },
    
    // تصغير النص
    truncate(str, length = 50) {
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },
    
    // حرف أول كبير
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    // إزالة التشكيل من النص العربي
    removeDiacritics(text) {
        return text.normalize('NFD').replace(/[\u064B-\u065F]/g, '');
    },
    
    // البحث في النص
    searchInText(text, searchTerm) {
        const normalizedText = this.removeDiacritics(text.toLowerCase());
        const normalizedTerm = this.removeDiacritics(searchTerm.toLowerCase());
        return normalizedText.includes(normalizedTerm);
    },
    
    // الحصول على اسم اليوم بالعربية
    getDayName(date) {
        const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        return days[new Date(date).getDay()];
    },
    
    // حساب المدة بين تاريخين
    timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' سنة';
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' شهر';
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' يوم';
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' ساعة';
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' دقيقة';
        return Math.floor(seconds) + ' ثانية';
    }
};

// تصدير
window.Helpers = Helpers;