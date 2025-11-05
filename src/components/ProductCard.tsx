import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  stock: number;
  isFeatured?: boolean;
}

const ProductCard = ({
  id,
  slug,
  name,
  price,
  originalPrice,
  imageUrl,
  rating = 0,
  reviewsCount = 0,
  stock,
  isFeatured,
}: ProductCardProps) => {
  return (
    <Link to={`/product/${slug}`}>
      <Card className="overflow-hidden group hover:shadow-lg transition-all border bg-white dark:bg-card shadow-sm">
        <div className="aspect-square overflow-hidden bg-gray-50 dark:bg-muted/30">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
        
        <CardContent className="p-4 space-y-2">
          <h3 className="font-medium text-base line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem]">
            {name}
          </h3>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? 'fill-primary text-primary'
                    : 'fill-gray-200 text-gray-200 dark:fill-muted dark:text-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">${price.toFixed(0)}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(0)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
