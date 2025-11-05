import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Store, Package, TrendingUp } from 'lucide-react';

const SellerDashboard = () => {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || !hasRole('seller'))) {
      navigate('/auth');
    }
  }, [user, hasRole, authLoading, navigate]);

  const { data: stores, isLoading: storesLoading } = useQuery({
    queryKey: ['seller-stores', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*, products(count)')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (authLoading || storesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const totalProducts = stores?.reduce((acc, store: any) => acc + (store.products?.[0]?.count || 0), 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Seller Dashboard</h1>
        <Link to="/seller/create-store">
          <Button className="bg-primary hover:bg-primary/90">
            <Store className="mr-2 h-4 w-4" />
            Create Store
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Stores</h2>
        {stores && stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store: any) => (
              <Card key={store.id}>
                <CardHeader>
                  {store.logo_url && (
                    <img
                      src={store.logo_url}
                      alt={store.slug}
                      className="w-16 h-16 rounded-lg object-cover mb-2"
                    />
                  )}
                  <CardTitle>{store.slug}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {store.products?.[0]?.count || 0} products
                  </p>
                  <Button variant="outline" className="w-full">
                    Manage Store
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No stores yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first store to start selling on GoCart
              </p>
              <Link to="/seller/create-store">
                <Button>Create Your First Store</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;