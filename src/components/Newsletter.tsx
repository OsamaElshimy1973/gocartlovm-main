import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail('');
    }
  };

  return (
    <div className="bg-muted/30 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Newsletter</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Subscribe to get exclusive deals, new arrivals, and insider updates delivered
          straight to your inbox every week.
        </p>
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto gap-2">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-background"
            required
          />
          <Button type="submit" className="bg-[#10b981] hover:bg-[#059669] text-white px-8">
            Get Updates
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
