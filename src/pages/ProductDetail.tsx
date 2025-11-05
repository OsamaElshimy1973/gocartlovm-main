import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Package, CreditCard, Users, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VariantSelector } from '@/components/VariantSelector';
import { useState } from 'react';
import type { ProductVariantWithAttributes, ProductWithTranslations } from '@/types/product';

const ProductDetail = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantWithAttributes | null>(null);

  const { data: product, isLoading } = useQuery<ProductWithTranslations>({
    queryKey: ['product', slug, language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_translations(*)
        `)
        .eq('slug', slug)
        .single();
      if (error) throw error;
      return data as ProductWithTranslations;
    },
  });

  const getTranslation = (translations: any[], fallback: string) => {
    const translation = translations?.find((t) => t.language_code === language);
    return translation?.name || fallback;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Product not found</p>
      </div>
    );
  }

  const productName = getTranslation(product.product_translations, 'Product');
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/shop" className="hover:text-foreground">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{productName}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted/30">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={productName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">{productName}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-green-500 text-green-500'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.reviews_count} Reviews
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              {product.has_variants ? (
                selectedVariant ? (
                  <>
                    <span className="text-4xl font-bold">
                      ${Number(selectedVariant.price).toFixed(0)}
                    </span>
                    {selectedVariant.original_price && (
                      <>
                        <span className="text-xl text-muted-foreground line-through">
                          ${Number(selectedVariant.original_price).toFixed(0)}
                        </span>
                        <span className="text-sm text-green-600">
                          Save {Math.round(((selectedVariant.original_price - selectedVariant.price) / selectedVariant.original_price) * 100)}% right now
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-4xl font-bold">
                    From ${Number(product.base_price || product.price).toFixed(0)}
                  </span>
                )
              ) : (
                <>
                  <span className="text-4xl font-bold">${Number(product.price).toFixed(0)}</span>
                  {product.original_price && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">
                        ${Number(product.original_price).toFixed(0)}
                      </span>
                      <span className="text-sm text-green-600">
                        Save {discount}% right now
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Variant Selector */}
          {product.has_variants && (
            <VariantSelector
              productId={product.id}
              onVariantChange={setSelectedVariant}
            />
          )}

          {/* Stock and Price Info */}
          <div className="text-sm text-muted-foreground">
            {product.has_variants ? (
              selectedVariant ? (
                <span>
                  {selectedVariant.stock > 0 
                    ? `${selectedVariant.stock} in stock` 
                    : 'Out of stock'}
                </span>
              ) : (
                <span>Select options to check availability</span>
              )
            ) : (
              <span>
                {product.stock > 0 
                  ? `${product.stock} in stock` 
                  : 'Out of stock'}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button 
            size="lg" 
            className="w-full md:w-auto px-12 bg-[#1a1f2e] hover:bg-[#2a2f3e] text-white"
            disabled={
              product.has_variants
                ? !selectedVariant || selectedVariant.stock === 0
                : product.stock === 0
            }
          >
            {product.has_variants && !selectedVariant ? (
              'Select Options'
            ) : (
              'Add to Cart'
            )}
          </Button>

          {/* Features */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Package className="h-5 w-5" />
              <span>Free shipping worldwide</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <CreditCard className="h-5 w-5" />
              <span>100% Secured Payment</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Users className="h-5 w-5" />
              <span>Trusted by top brands</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <p className="text-muted-foreground leading-relaxed">
              {productName} with a sleek design. It's perfect for any room. It's made of high-quality
              materials and comes with a lifetime warranty.
            </p>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <p className="text-muted-foreground">
              {product.reviews_count} customer reviews for this product.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
