// مcomponent نجوم التقييم
class RatingStarsComponent {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            rating: 0,
            readonly: false,
            size: 'medium',
            onRate: null,
            ...options
        };
        this.render();
        if (!this.options.readonly) this.attachEvents();
    }
    
    render() {
        if (!this.container) return;
        
        this.container.className = `rating-stars rating-stars-${this.options.size}`;
        this.container.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.setAttribute('data-value', i);
            
            if (i <= this.options.rating) {
                star.textContent = '★';
                star.classList.add('filled');
            } else if (i - 0.5 <= this.options.rating) {
                star.textContent = '½';
                star.classList.add('half');
            } else {
                star.textContent = '☆';
            }
            
            this.container.appendChild(star);
        }
        
        this.container.appendChild(document.createTextNode(` (${this.options.rating.toFixed(1)})`));
    }
    
    attachEvents() {
        const stars = this.container.querySelectorAll('.star');
        
        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const value = parseInt(star.dataset.value);
                this.highlightStars(value);
            });
            
            star.addEventListener('mouseleave', () => {
                this.highlightStars(this.options.rating);
            });
            
            star.addEventListener('click', () => {
                const value = parseInt(star.dataset.value);
                this.setRating(value);
                if (this.options.onRate) this.options.onRate(value);
            });
        });
    }
    
    highlightStars(value) {
        const stars = this.container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < value) {
                star.textContent = '★';
                star.classList.add('filled');
            } else {
                star.textContent = '☆';
                star.classList.remove('filled');
            }
        });
    }
    
    setRating(rating) {
        this.options.rating = rating;
        this.render();
    }
    
    getRating() {
        return this.options.rating;
    }
}