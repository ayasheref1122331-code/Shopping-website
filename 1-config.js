// تكوينات التطبيق العامة
const CONFIG = {
    APP_NAME: 'متجري المثالي',
    APP_VERSION: '3.0.0',
    API_URL: 'https://api.myshop.com/v1',
    CURRENCY: 'EGP',
    CURRENCY_SYMBOL: 'ج.م',
    TAX_RATE: 0.14,
    SHIPPING_COST: 45,
    FREE_SHIPPING_MIN: 500,
    ITEMS_PER_PAGE: 12,
    MAX_CART_ITEMS: 50,
    DEFAULT_IMAGE: 'https://via.placeholder.com/300x300?text=No+Image',
    SUPPORTED_CATEGORIES: ['electronics', 'fashion', 'books', 'home', 'sports', 'beauty', 'toys'],
    PAYMENT_METHODS: ['cash', 'card', 'vodafone-cash', 'instapay'],
    DELIVERY_TIMES: {
        standard: '3-5 أيام',
        express: '1-2 يوم',
        same_day: 'نفس اليوم (القاهرة)'
    },
    SOCIAL_LINKS: {
        facebook: 'https://facebook.com/myshop',
        instagram: 'https://instagram.com/myshop',
        twitter: 'https://twitter.com/myshop',
        whatsapp: 'https://wa.me/20123456789'
    }
};

// إعدادات التخزين
const STORAGE_KEYS = {
    CART: 'myshop_cart',
    WISHLIST: 'myshop_wishlist',
    USER: 'myshop_user',
    THEME: 'myshop_theme',
    ORDERS: 'myshop_orders',
    ADDRESSES: 'myshop_addresses',
    COUPONS: 'myshop_coupons',
    SEARCH_HISTORY: 'myshop_search_history',
    RECENTLY_VIEWED: 'myshop_recently_viewed',
    NOTIFICATIONS: 'myshop_notifications'
};

// رسائل الخطأ
const ERROR_MESSAGES = {
    NETWORK: 'حدث خطأ في الشبكة، يرجى المحاولة مرة أخرى',
    SERVER: 'خطأ في الخادم، يرجى المحاولة لاحقاً',
    NOT_FOUND: 'المنتج غير موجود',
    OUT_OF_STOCK: 'المنتج غير متوفر حالياً',
    INVALID_COUPON: 'كوبون الخصم غير صالح',
    CART_FULL: 'السلة ممتلئة، أقصى عدد هو 50 منتج',
    INVALID_QUANTITY: 'الكمية غير صالحة',
    REQUIRED_FIELD: 'هذا الحقل مطلوب',
    INVALID_EMAIL: 'البريد الإلكتروني غير صالح',
    INVALID_PHONE: 'رقم الهاتف غير صالح',
    PASSWORD_MISMATCH: 'كلمة المرور غير متطابقة'
};

// الرسائل الناجحة
const SUCCESS_MESSAGES = {
    ADDED_TO_CART: 'تم إضافة المنتج إلى السلة',
    REMOVED_FROM_CART: 'تم إزالة المنتج من السلة',
    ADDED_TO_WISHLIST: 'تم إضافة المنتج إلى المفضلة',
    REMOVED_FROM_WISHLIST: 'تم إزالة المنتج من المفضلة',
    COUPON_APPLIED: 'تم تطبيق كوبون الخصم بنجاح',
    ORDER_PLACED: 'تم تقديم الطلب بنجاح',
    REVIEW_SUBMITTED: 'تم إضافة تقييمك بنجاح'
};