import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Account = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('account')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('myOrders')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">View your order history</p>
            <Button>View Orders</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('addresses')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Manage your delivery addresses</p>
            <Button>Manage Addresses</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Account;
