// دوال تنسيق الأرقام والعملات
const Formatters = {
    // تنسيق السعر
    formatPrice(price, showSymbol = true) {
        const formatted = price.toLocaleString('ar-EG');
        return showSymbol ? `${formatted} ${CONFIG.CURRENCY_SYMBOL}` : formatted;
    },
    
    // تنسيق الخصم
    formatDiscount(discount) {
        return `-${discount}%`;
    },
    
    // تنسيق التقييم
    formatRating(rating) {
        return rating.toFixed(1);
    },
    
    // تنسيق عدد المشاهدات
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },
    
    // تنسيق التاريخ للعربية
    formatDateArabic(date) {
        const d = new Date(date);
        return `${d.getDate()} ${this.getMonthName(d.getMonth())} ${d.getFullYear()}`;
    },
    
    // اسم الشهر بالعربية
    getMonthName(month) {
        const months = [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        return months[month];
    },
    
    // تنسيق الوقت
    formatTime(date) {
        const d = new Date(date);
        return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    },
    
    // تنسيق رقم الهاتف
    formatPhone(phone) {
        if (phone.length === 11) {
            return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
        }
        return phone;
    },
    
    // تنسيق عنوان
    formatAddress(address) {
        return `${address.street}, ${address.city}, ${address.country}`;
    },
    
    // تنسيق كود الكوبون
    formatCouponCode(code) {
        return code.toUpperCase();
    }
};

window.Formatters = Formatters;