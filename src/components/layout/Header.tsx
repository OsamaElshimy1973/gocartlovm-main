import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import PromoBanner from '@/components/PromoBanner';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { t } = useLanguage();
  const { user, signOut, hasRole } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <PromoBanner />
      <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link to="/" className="text-2xl font-bold text-primary flex-shrink-0">
              gocart<span className="text-accent">.</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                {t('home')}
              </Link>
              <Link to="/shop" className="text-sm font-medium hover:text-primary transition-colors">
                {t('shop')}
              </Link>
              <Link to="/stores" className="text-sm font-medium hover:text-primary transition-colors">
                Seller
              </Link>
              <Link to="/account" className="text-sm font-medium hover:text-primary transition-colors">
                Admin
              </Link>
            </nav>

            <div className="flex-1 max-w-lg hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products"
                  className="pl-10 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              
              <Link to="/cart">
                <Button variant="ghost" className="relative gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-sm font-medium">Cart</span>
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-xs text-accent-foreground flex items-center justify-center">
                    0
                  </span>
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                      {user.email?.charAt(0).toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/account')}>
                      My Account
                    </DropdownMenuItem>
                    {hasRole('seller') && (
                      <DropdownMenuItem onClick={() => navigate('/seller')}>
                        Seller Dashboard
                      </DropdownMenuItem>
                    )}
                    {hasRole('admin') && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
