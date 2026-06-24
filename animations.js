// دوال الحركات والأنيميشن
const Animations = {
    // تأثير الظهور
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms`;
        setTimeout(() => element.style.opacity = '1', 10);
    },
    
    // تأثير الاختفاء
    fadeOut(element, duration = 300) {
        element.style.opacity = '1';
        element.style.transition = `opacity ${duration}ms`;
        element.style.opacity = '0';
        setTimeout(() => element.style.display = 'none', duration);
    },
    
    // تأثير النبض
    pulse(element) {
        element.style.transform = 'scale(1.05)';
        setTimeout(() => element.style.transform = 'scale(1)', 200);
    },
    
    // تأثير الاهتزاز
    shake(element) {
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => element.style.animation = '', 500);
    },
    
    // تمرير سلس
    scrollTo(element, offset = 0) {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    },
    
    // تأثير تحميل
    showLoader(container) {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        container.appendChild(loader);
        return loader;
    },
    
    hideLoader(loader) {
        if (loader && loader.remove) loader.remove();
    },
    
    // تأثير نوعي
    typeText(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);
    },
    
    // تأثير العد التنازلي
    animateNumber(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = Math.floor(end);
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
};

// إضافة CSS للحركات
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

window.Animations = Animations;