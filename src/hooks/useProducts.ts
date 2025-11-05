import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ProductRow = Database['public']['Tables']['products']['Row'];

export function useProducts(options?: { limit?: number; featured?: boolean }) {
  return useQuery<ProductRow[]>({
    queryKey: ['products', options?.limit, options?.featured],
    queryFn: async () => {
      let query = supabase.from('products').select('*, product_translations(*)');
      if (options?.featured) query = (query as any).eq('is_featured', true);
      if (options?.limit) query = (query as any).limit(options.limit);

      const { data, error } = await query;
      if (error) throw error;
      return data as ProductRow[];
    },
  });
}

export default useProducts;
