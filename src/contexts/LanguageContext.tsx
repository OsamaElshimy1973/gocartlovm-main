import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    shop: 'Shop',
    stores: 'Stores',
    cart: 'Cart',
    account: 'Account',
    search: 'Search products...',
    categories: 'Categories',
    featuredProducts: 'Featured Products',
    allProducts: 'All Products',
    viewAll: 'View All',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    reviews: 'Reviews',
    writeReview: 'Write a Review',
    checkout: 'Checkout',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    discount: 'Discount',
    total: 'Total',
    applyCoupon: 'Apply Coupon',
    placeOrder: 'Place Order',
    myOrders: 'My Orders',
    addresses: 'Addresses',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    price: 'Price',
    rating: 'Rating',
    products: 'Products',
  },
  ar: {
    home: 'الرئيسية',
    shop: 'تسوق',
    stores: 'المتاجر',
    cart: 'السلة',
    account: 'الحساب',
    search: 'ابحث عن المنتجات...',
    categories: 'الفئات',
    featuredProducts: 'المنتجات المميزة',
    allProducts: 'جميع المنتجات',
    viewAll: 'عرض الكل',
    addToCart: 'أضف إلى السلة',
    buyNow: 'اشتر الآن',
    reviews: 'التقييمات',
    writeReview: 'اكتب تقييم',
    checkout: 'إتمام الطلب',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    discount: 'الخصم',
    total: 'الإجمالي',
    applyCoupon: 'تطبيق القسيمة',
    placeOrder: 'تأكيد الطلب',
    myOrders: 'طلباتي',
    addresses: 'العناوين',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    inStock: 'متوفر',
    outOfStock: 'غير متوفر',
    price: 'السعر',
    rating: 'التقييم',
    products: 'المنتجات',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      setLanguage(savedLang);
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLang;
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
