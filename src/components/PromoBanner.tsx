import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-[hsl(var(--promo-gradient-start))] to-[hsl(var(--promo-gradient-end))] text-white py-3">
      <div className="container mx-auto px-4 flex items-center justify-center gap-4">
        <p className="text-sm font-medium">Get 20% OFF on Your First Order!</p>
        <Button 
          size="sm" 
          variant="secondary"
          className="bg-white text-foreground hover:bg-white/90"
        >
          Claim Offer
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-4 h-6 w-6 text-white hover:bg-white/20"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromoBanner;
