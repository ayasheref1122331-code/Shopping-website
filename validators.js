// دوال التحقق من صحة البيانات
const Validators = {
    // التحقق من البريد
    validateEmail(email) {
        const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        return re.test(email);
    },
    
    // التحقق من رقم الهاتف المصري
    validateEgyptianPhone(phone) {
        const re = /^(010|011|012|015)[0-9]{8}$/;
        return re.test(phone);
    },
    
    // التحقق من الرقم القومي
    validateNationalId(id) {
        const re = /^[0-9]{14}$/;
        return re.test(id);
    },
    
    // التحقق من كلمة المرور (8 أحرف على الأقل، رقم وحرف كبير)
    validatePassword(password) {
        return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    },
    
    // التحقق من تطابق كلمتي المرور
    validatePasswordMatch(password, confirmPassword) {
        return password === confirmPassword;
    },
    
    // التحقق من الرقم
    validateNumber(value, min = null, max = null) {
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        if (min !== null && num < min) return false;
        if (max !== null && num > max) return false;
        return true;
    },
    
    // التحقق من التاريخ
    validateDate(date) {
        return !isNaN(new Date(date).getTime());
    },
    
    // التحقق من وجود قيمة
    validateRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    
    // التحقق من طول النص
    validateLength(value, min, max) {
        const len = value.toString().length;
        return len >= min && len <= max;
    },
    
    // التحقق من الرمز البريدي المصري
    validatePostalCode(code) {
        const re = /^[0-9]{5}$/;
        return re.test(code);
    },
    
    // التحقق من اسم المستخدم
    validateUsername(username) {
        const re = /^[a-zA-Z0-9_\u0600-\u06FF]{3,20}$/;
        return re.test(username);
    },
    
    // التحقق من URL
    validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

window.Validators = Validators;