// خدمة التحليلات والتتبع
class AnalyticsService {
    constructor() {
        this.events = [];
        this.sessionId = Helpers.generateId();
        this.startTime = Date.now();
    }
    
    track(eventName, eventData = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            url: window.location.href,
            ...eventData
        };
        
        this.events.push(event);
        console.log('[Analytics]', event);
        
        // حفظ في localStorage
        const storedEvents = storage.get('analytics_events', []);
        storedEvents.push(event);
        storage.set('analytics_events', storedEvents.slice(-100)); // آخر 100 حدث فقط
    }
    
    trackPageView(pageName) {
        this.track('page_view', { page: pageName });
    }
    
    trackProductView(productId, productName) {
        this.track('product_view', { productId, productName });
    }
    
    trackAddToCart(productId, productName, price, quantity) {
        this.track('add_to_cart', { productId, productName, price, quantity });
    }
    
    trackRemoveFromCart(productId, productName) {
        this.track('remove_from_cart', { productId, productName });
    }
    
    trackSearch(searchTerm, resultsCount) {
        this.track('search', { searchTerm, resultsCount });
    }
    
    trackCheckoutStart(cartTotal, itemCount) {
        this.track('checkout_start', { cartTotal, itemCount });
    }
    
    trackPurchase(orderId, total, items) {
        this.track('purchase', { orderId, total, itemsCount: items.length });
    }
    
    getSessionDuration() {
        return Math.floor((Date.now() - this.startTime) / 1000);
    }
    
    getEvents() {
        return [...this.events];
    }
    
    clearEvents() {
        this.events = [];
        storage.remove('analytics_events');
    }
}

const analytics = new AnalyticsService();
window.analytics = analytics;