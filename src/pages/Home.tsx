import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import StoreCard from '@/components/StoreCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Home = () => {
  const { language, t } = useLanguage();

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*, category_translations(*)')
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_translations(*)')
        .eq('is_featured', true)
        .limit(8);
      if (error) throw error;
      return data;
    },
  });

  const { data: stores, isLoading: storesLoading } = useQuery({
    queryKey: ['stores', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*, store_translations(*)')
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const getTranslation = (translations: any[], fallback: string) => {
    const translation = translations?.find((t) => t.language_code === language);
    return translation?.name || fallback;
  };

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <section className="lg:col-span-2 rounded-3xl bg-[hsl(var(--hero-mint))] p-8 md:p-12 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 bg-[hsl(var(--accent))] text-accent-foreground px-4 py-1 rounded-full text-xs font-medium mb-6">
            <span className="font-bold">NEWS</span>
            <span>Free Shipping on Orders Above $50!</span>
          </div>
          
          <div className="max-w-md">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Gadgets <span className="text-primary">you'll love.</span>
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prices you'll trust.
            </h2>
            
            <p className="text-sm text-muted-foreground mb-2">Starts from</p>
            <p className="text-4xl font-bold mb-6">$4.90</p>
            
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 rounded-lg"
            >
              LEARN MORE
            </Button>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          <Link to="/shop" className="block">
            <div className="rounded-3xl bg-[hsl(var(--hero-peach))] p-8 h-full hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-2">Best products</h3>
              <p className="text-sm text-muted-foreground mb-4">View more →</p>
            </div>
          </Link>
          
          <Link to="/shop" className="block">
            <div className="rounded-3xl bg-[hsl(var(--hero-blue))] p-8 h-full hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold mb-2">20% discounts</h3>
              <p className="text-sm text-muted-foreground mb-4">View more →</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Categories Carousel */}
      <section className="mb-12 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categoriesLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="min-w-[120px] h-10 rounded-full" />
              ))
            : categories?.map((category) => (
                <Link 
                  key={category.id}
                  to={`/shop?category=${category.slug}`}
                  className="min-w-fit"
                >
                  <div className="px-6 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors whitespace-nowrap">
                    <span className="text-sm font-medium">
                      {getTranslation(category.category_translations, 'Category')}
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">Latest Products</h2>
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-muted-foreground">
              Showing {featuredProducts?.length || 0} of 12 products
            </span>
            <Link to="/shop" className="flex items-center gap-1 text-primary hover:underline font-medium">
              View more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productsLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-lg" />
              ))
            : featuredProducts?.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={getTranslation(product.product_translations, 'Product')}
                  price={Number(product.price)}
                  originalPrice={product.original_price ? Number(product.original_price) : undefined}
                  imageUrl={product.image_url}
                  rating={Number(product.rating)}
                  reviewsCount={product.reviews_count}
                  stock={product.stock}
                  isFeatured={product.is_featured}
                />
              ))}
        </div>
      </section>

      {/* Featured Stores */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">{t('stores')}</h2>
          <Link to="/stores">
            <Button variant="ghost">
              {t('viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {storesLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))
            : stores?.map((store) => (
                <StoreCard
                  key={store.id}
                  id={store.id}
                  slug={store.slug}
                  name={getTranslation(store.store_translations, 'Store')}
                  description={store.store_translations?.find((t) => t.language_code === language)?.description}
                  logoUrl={store.logo_url}
                  coverUrl={store.cover_url}
                  rating={Number(store.rating)}
                  totalProducts={store.total_products}
                />
              ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
