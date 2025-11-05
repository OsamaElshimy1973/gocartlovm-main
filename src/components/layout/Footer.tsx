import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Newsletter from '../Newsletter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { language } = useLanguage();

  const { data: footerCategories } = useQuery({
    queryKey: ['footer-categories', language],
    queryFn: async () => {
      const slugs = ['earphones', 'headphones', 'smartphones', 'laptops'];
      const { data, error } = await supabase
        .from('categories')
        .select('slug, category_translations(*)')
        .in('slug', slugs);
      if (error) throw error;
      return data || [];
    },
  });

  const getCategoryLabel = (slug: string) => {
    const cat = (footerCategories || []).find((c: any) => c.slug === slug);
    const fallback = t(`product_${slug}`);
    if (!cat) return fallback;
    const tr = cat.category_translations?.find((x: any) => x.language_code === language);
    return tr?.name || fallback;
  };

  return (
    <footer className="mt-auto">
      <Newsletter />
      
      <div className="bg-background border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <h3 className="font-bold text-2xl mb-4 text-[#10b981]">{t('footer_brand')}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {t('footer_description')}
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-muted hover:bg-[#10b981] hover:text-white flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-muted hover:bg-[#10b981] hover:text-white flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-muted hover:bg-[#10b981] hover:text-white flex items-center justify-center transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-muted hover:bg-[#10b981] hover:text-white flex items-center justify-center transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('products')}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/shop?category=earphones" className="text-muted-foreground hover:text-[#10b981] transition-colors">{t('product_earphones')}</Link></li>
                <li><Link to="/shop?category=headphones" className="text-muted-foreground hover:text-[#10b981] transition-colors">{t('product_headphones')}</Link></li>
                <li><Link to="/shop?category=smartphones" className="text-muted-foreground hover:text-[#10b981] transition-colors">{t('product_smartphones')}</Link></li>
                <li><Link to="/shop?category=laptops" className="text-muted-foreground hover:text-[#10b981] transition-colors">{t('product_laptops')}</Link></li>
              </ul>
            </div>

            {/* Website */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('website')}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-[#10b981] transition-colors">{t('home')}</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-[#10b981] transition-colors">{t('privacy_policy')}</Link></li>
                <li><Link to="/membership" className="text-muted-foreground hover:text-[#10b981] transition-colors">{t('become_plus_member')}</Link></li>
                {user ? (
                  <li><Link to="/create-store" className="text-muted-foreground hover:text-[#10b981] transition-colors">{t('create_store')}</Link></li>
                ) : (
                  <li><Link to="/auth" className="text-muted-foreground hover:text-[#10b981] transition-colors">{t('create_store')}</Link></li>
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('contact')}</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{t('footer_contact_phone')}</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{t('footer_contact_email')}</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{t('footer_contact_address')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            Copyright 2025 © gocart All Right Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
