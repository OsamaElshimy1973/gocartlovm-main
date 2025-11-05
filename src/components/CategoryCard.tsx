import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface CategoryCardProps {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string;
  icon?: string;
  productsCount?: number;
}

const CategoryCard = ({ slug, name, imageUrl, icon, productsCount = 0 }: CategoryCardProps) => {
  return (
    <Link to={`/shop?category=${slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group bg-white dark:bg-card shadow-sm">
        <div className="aspect-square bg-muted relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {icon || '📦'}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <div className="text-white">
              <h3 className="font-bold text-lg">{name}</h3>
              <p className="text-sm text-white/80">{productsCount} items</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;
