import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Newsletter from '../Newsletter';

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="mt-auto">
      <Newsletter />
      
      <div className="bg-background border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <h3 className="font-bold text-2xl mb-4 text-[#10b981]">gocart.</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Welcome to gocart, your ultimate destination for the latest and smartest gadgets. From smartphones and smartwatches to essential accessories, we bring you the best in innovation — all in one place.
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
              <h4 className="font-semibold text-lg mb-4">PRODUCTS</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/shop?category=earphones" className="text-muted-foreground hover:text-[#10b981] transition-colors">Earphones</Link></li>
                <li><Link to="/shop?category=headphones" className="text-muted-foreground hover:text-[#10b981] transition-colors">Headphones</Link></li>
                <li><Link to="/shop?category=smartphones" className="text-muted-foreground hover:text-[#10b981] transition-colors">Smartphones</Link></li>
                <li><Link to="/shop?category=laptops" className="text-muted-foreground hover:text-[#10b981] transition-colors">Laptops</Link></li>
              </ul>
            </div>

            {/* Website */}
            <div>
              <h4 className="font-semibold text-lg mb-4">WEBSITE?</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-[#10b981] transition-colors">Home</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-[#10b981] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/membership" className="text-muted-foreground hover:text-[#10b981] transition-colors">Become Plus Member</Link></li>
                {user ? (
                  <li><Link to="/seller/create-store" className="text-muted-foreground hover:text-[#10b981] transition-colors">Create Your Store</Link></li>
                ) : (
                  <li><Link to="/auth" className="text-muted-foreground hover:text-[#10b981] transition-colors">Create Your Store</Link></li>
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-lg mb-4">CONTACT</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>+1-212-456-7890</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>contact@example.com</span>
                </li>
                <li className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>794 Francisco, 94102</span>
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
