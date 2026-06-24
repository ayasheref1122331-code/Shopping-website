// الثوابت والبيانات الثابتة - 50 منتج

const CATEGORIES = [
    { id: 'all', name: 'الكل', icon: '📦', color: '#6b7280', count: 150 },
    { id: 'electronics', name: 'الإلكترونيات', icon: '📱', color: '#3b82f6', count: 45 },
    { id: 'fashion', name: 'الموضة', icon: '👗', color: '#ec4899', count: 38 },
    { id: 'books', name: 'الكتب', icon: '📚', color: '#8b5cf6', count: 52 },
    { id: 'home', name: 'المنزل', icon: '🏠', color: '#10b981', count: 28 },
    { id: 'sports', name: 'الرياضة', icon: '⚽', color: '#f59e0b', count: 22 },
    { id: 'beauty', name: 'التجميل', icon: '💄', color: '#f43f5e', count: 35 },
    { id: 'toys', name: 'الألعاب', icon: '🎮', color: '#14b8a6', count: 18 }
];

const BRANDS = [
    'Apple', 'Samsung', 'Xiaomi', 'Nike', 'Adidas', 'Zara', 'Sony', 'Dell',
    'HP', 'Lenovo', 'Huawei', 'OnePlus', 'Google', 'Microsoft', 'Logitech'
];

const COLORS = [
    { name: 'أسود', code: '#1a1a1a' },
    { name: 'أبيض', code: '#ffffff' },
    { name: 'أحمر', code: '#ef4444' },
    { name: 'أزرق', code: '#3b82f6' },
    { name: 'أخضر', code: '#10b981' },
    { name: 'أصفر', code: '#f59e0b' },
    { name: 'وردي', code: '#ec4899' },
    { name: 'رمادي', code: '#6b7280' }
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const SORT_OPTIONS = [
    { value: 'default', label: 'الترتيب الافتراضي' },
    { value: 'price-asc', label: 'السعر: من الأقل للأعلى' },
    { value: 'price-desc', label: 'السعر: من الأعلى للأقل' },
    { value: 'rating', label: 'التقييم' },
    { value: 'popularity', label: 'الأكثر مبيعاً' },
    { value: 'newest', label: 'الأحدث' }
];

// 50 منتج افتراضي
const ALL_PRODUCTS = [];

for (let i = 1; i <= 50; i++) {
    const categories = ['electronics', 'fashion', 'books', 'home', 'sports', 'beauty', 'toys'];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const price = Math.floor(Math.random() * 2000) + 50;
    const oldPrice = price + Math.floor(Math.random() * 1000) + 100;
    const rating = (Math.random() * 2 + 3).toFixed(1);
    
    ALL_PRODUCTS.push({
        id: i,
        name: `منتج مميز ${i} - ${['احترافي', 'كلاسيك', 'حديث', 'فاخر', 'مريح'][Math.floor(Math.random() * 5)]}`,
        price: price,
        oldPrice: oldPrice,
        discount: Math.round(((oldPrice - price) / oldPrice) * 100),
        image: `https://picsum.photos/id/${i + 100}/400/400`,
        category: randomCat,
        rating: parseFloat(rating),
        reviews: Math.floor(Math.random() * 500) + 10,
        stock: Math.floor(Math.random() * 100) + 1,
        sold: Math.floor(Math.random() * 1000),
        brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
        description: `هذا منتج رائع وعالي الجودة. منتج رقم ${i} من متجرنا المثالي. يتميز بجودة عالية وسعر ممتاز.`,
        features: [
            'جودة عالية',
            'ضمان لمدة عام',
            'شحن سريع',
            'توصيل مجاني للطلبات فوق 500 ج.م'
        ],
        images: [
            `https://picsum.photos/id/${i + 100}/800/800`,
            `https://picsum.photos/id/${i + 200}/800/800`,
            `https://picsum.photos/id/${i + 300}/800/800`
        ]
    });
}

// كوبونات الخصم
const COUPONS = [
    { code: 'WELCOME20', discount: 20, type: 'percentage', minOrder: 100, maxDiscount: 500 },
    { code: 'SAVE50', discount: 50, type: 'fixed', minOrder: 300, maxDiscount: 50 },
    { code: 'FREESHIP', discount: 0, type: 'free_shipping', minOrder: 200 },
    { code: 'SUMMER25', discount: 25, type: 'percentage', minOrder: 200, maxDiscount: 1000 },
    { code: 'FLASH10', discount: 10, type: 'percentage', minOrder: 0, maxDiscount: 200 }
];