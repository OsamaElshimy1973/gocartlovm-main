import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, LogOut, Settings, Package, PlusCircle, User } from 'lucide-react';
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
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import AccountDialog from '@/components/account/AccountDialog';

const Header = () => {
  const { t } = useLanguage();
  const { user, signOut, hasRole } = useAuth();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);

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
              {/* Show Seller link only to approved sellers, otherwise show Become a Seller */}
              {hasRole('seller_approved') ? (
                <Link to="/stores" className="text-sm font-medium hover:text-primary transition-colors">
                  {t('stores')}
                </Link>
              ) : (
                <Link to="/create-store" className="text-sm font-medium hover:text-primary transition-colors">
                  {t('become_seller')}
                </Link>
              )}

              {/* Show Admin link only to admins */}
              {hasRole('admin') && (
                <Link to="/account" className="text-sm font-medium hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex-1 max-w-lg hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('search')}
                  className="pl-10 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              
              <Link to="/cart">
                  <Button variant="ghost" className="relative gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-sm font-medium">{t('cart')}</span>
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-xs text-accent-foreground flex items-center justify-center">
                    0
                  </span>
                </Button>
              </Link>

              {user ? (
                <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                      {user.email?.charAt(0).toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    {/* User header */}
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-muted-foreground flex items-center justify-center text-muted"> 
                          {((user.user_metadata as any)?.avatar_url) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={(user.user_metadata as any).avatar_url} alt="avatar" className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{(user.user_metadata as any)?.full_name || user.email}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="px-2">
                          <DropdownMenuItem onClick={() => setAccountOpen(true)}>
                            <Settings className="mr-2 h-4 w-4" />
                            {t('manage_profile')}
                          </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => navigate('/account')}>
                        <Package className="mr-2 h-4 w-4" />
                        {t('myOrders')}
                      </DropdownMenuItem>

                      {hasRole('seller_approved') && (
                        <DropdownMenuItem onClick={() => navigate('/seller')}>
                          <User className="mr-2 h-4 w-4" />
                          {t('seller_dashboard')}
                        </DropdownMenuItem>
                      )}

                      {hasRole('admin') && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <User className="mr-2 h-4 w-4" />
                          {t('admin_dashboard')}
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('logout')}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => navigate('/auth?add=1')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('add_account') || 'Add account'}
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                  </DropdownMenu>
                  <AccountDialog open={accountOpen} onOpenChange={setAccountOpen} />
                </>
              ) : (
                <Link to="/auth">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                    {t('login')}
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
