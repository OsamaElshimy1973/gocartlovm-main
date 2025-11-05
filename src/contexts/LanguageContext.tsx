import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSiteTexts } from '@/lib/siteTexts';

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
  latest_products: 'Latest Products',
  best_products: 'Best products',
  best_selling: 'Best selling',
  discounts_20: '20% discounts',
  showing_of_products: 'Showing {count} of {total} products',
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
    // Footer & UI extras
    footer_brand: 'gocart.',
    footer_description: "Welcome to gocart, your ultimate destination for the latest and smartest gadgets. From smartphones and smartwatches to essential accessories, we bring you the best in innovation — all in one place.",
    footer_contact_phone: '+1-212-456-7890',
    footer_contact_email: 'contact@example.com',
    footer_contact_address: '794 Francisco, 94102',
    create_store: 'Create Your Store',
  product_earphones: 'Earphones',
  product_headphones: 'Headphones',
  product_smartphones: 'Smartphones',
  product_laptops: 'Laptops',
    become_seller: 'Become a Seller',
    seller_dashboard: 'Seller Dashboard',
    admin_dashboard: 'Admin Dashboard',
    manage_profile: 'Manage Profile',
    my_orders: 'My Orders',
    website: 'Website',
    privacy_policy: 'Privacy Policy',
    become_plus_member: 'Become Plus Member',
    contact: 'Contact',
    our_specifications: 'Our Specifications',
    spec_free_shipping_title: 'Free Shipping',
    spec_free_shipping_desc: 'Enjoy fast, free delivery on every order no conditions, just reliable doorstep.',
    spec_easy_return_title: '7 Days easy Return',
    spec_easy_return_desc: "Change your mind? No worries. Return any item within 7 days.",
    spec_support_title: '24/7 Customer Support',
    spec_support_desc: "We're here for you. Get expert help with our customer support.",
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
  latest_products: 'أحدث المنتجات',
  best_products: 'أفضل المنتجات',
  best_selling: 'الأكثر مبيعًا',
  discounts_20: 'خصومات 20%',
  showing_of_products: 'عرض {count} من {total} منتج',
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
    // Footer & UI extras
    footer_brand: 'gocart.',
    footer_description: 'مرحبًا بك في gocart، وجهتك المفضلة لأحدث وأذكى الأدوات. من الهواتف الذكية والساعات الذكية إلى الملحقات الأساسية، نقدم لك الأفضل في الابتكار — كل ذلك في مكان واحد.',
    footer_contact_phone: '+1-212-456-7890',
    footer_contact_email: 'contact@example.com',
    footer_contact_address: '794 Francisco, 94102',
    create_store: 'إنشاء متجرك',
  product_earphones: 'سماعات أذن',
  product_headphones: 'سماعات رأس',
  product_smartphones: 'هواتف ذكية',
  product_laptops: 'أجهزة كمبيوتر محمولة',
    become_seller: 'التسجيل كبائع',
    seller_dashboard: 'لوحة البائع',
    admin_dashboard: 'لوحة المشرف',
    manage_profile: 'إدارة الملف',
    my_orders: 'طلباتي',
    website: 'الموقع',
    privacy_policy: 'سياسة الخصوصية',
    become_plus_member: 'انضم كعضو بلس',
    contact: 'اتصل بنا',
    our_specifications: 'مواصفاتنا',
    spec_free_shipping_title: 'شحن مجاني',
    spec_free_shipping_desc: 'استمتع بتوصيل سريع ومجاني على كل طلب دون شروط، فقط توصيل موثوق إلى عتبة دارك.',
    spec_easy_return_title: 'إرجاع سهل خلال 7 أيام',
    spec_easy_return_desc: 'غيرت رأيك؟ لا مشكلة. أعد أي سلعة خلال 7 أيام.',
    spec_support_title: 'دعم العملاء 24/7',
    spec_support_desc: 'نحن هنا من أجلك. احصل على مساعدة خبراء من دعم العملاء لدينا.',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [remoteTexts, setRemoteTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      setLanguage(savedLang);
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLang;
    }
    // load remote site texts for the saved language
    (async () => {
      try {
        const texts = await fetchSiteTexts(savedLang || 'en');
        setRemoteTexts(texts || {});
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    // fetch remote site texts for selected language
    (async () => {
      const texts = await fetchSiteTexts(lang);
      setRemoteTexts(texts || {});
    })();
  };

  const t = (key: string) => {
    return remoteTexts[key] || translations[language][key] || key;
  };

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
