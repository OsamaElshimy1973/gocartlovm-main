import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Package } from 'lucide-react';

interface StoreCardProps {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  rating?: number;
  totalProducts?: number;
}

const StoreCard = ({
  slug,
  name,
  description,
  logoUrl,
  coverUrl,
  rating = 0,
  totalProducts = 0,
}: StoreCardProps) => {
  return (
    <Link to={`/store/${slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group bg-white dark:bg-card shadow-sm">
        <div className="h-32 bg-muted relative overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 -mt-12 rounded-lg border-4 border-background bg-background overflow-hidden flex-shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-2xl">
                  🏪
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {name}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{totalProducts} products</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StoreCard;
