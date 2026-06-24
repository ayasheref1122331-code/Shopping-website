// مكون العد التنازلي
class CountdownTimerComponent {
    constructor(containerId, targetDate, options = {}) {
        this.container = document.getElementById(containerId);
        this.targetDate = new Date(targetDate);
        this.options = {
            onComplete: null,
            format: 'days|hours|minutes|seconds',
            ...options
        };
        this.interval = null;
        this.render();
        this.start();
    }
    
    render() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="countdown-timer">
                <div class="countdown-item"><span class="days">00</span><span>يوم</span></div>
                <div class="countdown-sep">:</div>
                <div class="countdown-item"><span class="hours">00</span><span>ساعة</span></div>
                <div class="countdown-sep">:</div>
                <div class="countdown-item"><span class="minutes">00</span><span>دقيقة</span></div>
                <div class="countdown-sep">:</div>
                <div class="countdown-item"><span class="seconds">00</span><span>ثانية</span></div>
            </div>
        `;
    }
    
    start() {
        this.interval = setInterval(() => this.update(), 1000);
    }
    
    update() {
        const now = new Date();
        const diff = this.targetDate - now;
        
        if (diff <= 0) {
            clearInterval(this.interval);
            if (this.options.onComplete) this.options.onComplete();
            this.container.innerHTML = '<div class="countdown-ended">انتهى العرض!</div>';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (86400000)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (3600000)) / (1000 * 60));
        const seconds = Math.floor((diff % (60000)) / 1000);
        
        const daysSpan = this.container.querySelector('.days');
        const hoursSpan = this.container.querySelector('.hours');
        const minutesSpan = this.container.querySelector('.minutes');
        const secondsSpan = this.container.querySelector('.seconds');
        
        if (daysSpan) daysSpan.textContent = String(days).padStart(2, '0');
        if (hoursSpan) hoursSpan.textContent = String(hours).padStart(2, '0');
        if (minutesSpan) minutesSpan.textContent = String(minutes).padStart(2, '0');
        if (secondsSpan) secondsSpan.textContent = String(seconds).padStart(2, '0');
    }
    
    stop() {
        if (this.interval) clearInterval(this.interval);
    }
}