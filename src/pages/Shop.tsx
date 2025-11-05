import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

const Shop = () => {
  const { language, t } = useLanguage();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_translations(*)');
      if (error) throw error;
      return data;
    },
  });

  const getTranslation = (translations: any[], fallback: string) => {
    const translation = translations?.find((t) => t.language_code === language);
    return translation?.name || fallback;
  };

  return (
    <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('allProducts')}</h1>
        <p className="text-sm text-muted-foreground">
          Browse our complete collection of products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-lg" />
            ))
          : products?.map((product) => (
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
    </div>
  );
};

export default Shop;
