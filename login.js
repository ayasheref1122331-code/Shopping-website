// صفحة تسجيل الدخول
document.addEventListener('DOMContentLoaded', () => {
    initLoginPage();
});

function initLoginPage() {
    if (authService.isLoggedIn()) {
        window.location.href = 'profile.html';
        return;
    }
    
    attachLoginEvents();
}

function attachLoginEvents() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;
            
            if (!email || !password) {
                toast.error('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
                return;
            }
            
            loader.show('جاري تسجيل الدخول...');
            const result = await authService.login(email, password);
            loader.hide();
            
            if (result.success) {
                toast.success('تم تسجيل الدخول بنجاح');
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1000);
            } else {
                toast.error(result.message);
            }
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('regName')?.value;
            const email = document.getElementById('regEmail')?.value;
            const password = document.getElementById('regPassword')?.value;
            const confirmPassword = document.getElementById('regConfirmPassword')?.value;
            
            if (!name || !email || !password) {
                toast.error('الرجاء إكمال جميع الحقول');
                return;
            }
            
            if (password !== confirmPassword) {
                toast.error('كلمة المرور غير متطابقة');
                return;
            }
            
            loader.show('جاري إنشاء الحساب...');
            const result = await authService.register({ name, email, password });
            loader.hide();
            
            if (result.success) {
                toast.success('تم إنشاء الحساب بنجاح');
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1000);
            } else {
                toast.error(result.message);
            }
        });
    }
}