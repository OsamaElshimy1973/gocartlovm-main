import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { t } = useLanguage();

  // TODO: Implement cart functionality
  const cartItems: any[] = [];

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center p-8">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some products to get started
          </p>
          <Link to="/shop">
            <Button>{t('shop')}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('cart')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cart items will go here */}
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              {/* Summary will go here */}
              <Button className="w-full mt-4">{t('checkout')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
