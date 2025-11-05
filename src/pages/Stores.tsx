import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import StoreCard from '@/components/StoreCard';
import { Skeleton } from '@/components/ui/skeleton';

const Stores = () => {
  const { language, t } = useLanguage();

  const { data: stores, isLoading } = useQuery({
    queryKey: ['stores', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*, store_translations(*)');
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('stores')}</h1>
        <p className="text-sm text-muted-foreground">
          Discover our trusted vendor partners
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => (
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
    </div>
  );
};

export default Stores;
