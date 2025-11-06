import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormData {
  name_en: string;
  description_en: string;
  name_ar: string;
  description_ar: string;
}

const CreateStore = () => {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  
  const [formData, setFormData] = useState<FormData>({
    name_en: '',
    description_en: '',
    name_ar: '',
    description_ar: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    // Redirect if user is already a pending or approved seller
    if (!authLoading && user) {
      if (hasRole('seller_approved')) {
        navigate('/seller');
      } else if (hasRole('seller_pending')) {
        navigate('/seller');
      }
    }
  }, [user, hasRole, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Check if we have at least one language filled out
      if (!formData.name_en && !formData.name_ar) {
        throw new Error('Store name is required in at least one language');
      }

      // Apply for seller status
      // The generated Supabase types may not include the RPC signature for
      // `apply_for_seller`, which makes the `args` parameter typed as `never`.
      // Cast the args to `any` to keep runtime behavior while removing the
      // TypeScript overload error. For a long-term fix, add the RPC to
      // `src/types/supabase.ts` (or regenerate types) so the RPC is typed.
      // Use an any-cast on the client when the generated types don't include
      // RPC signatures. This avoids the 'parameter of type never' compile error.
      const { error: applicationError } = await (supabase as any).rpc('apply_for_seller', {
        store_name: formData.name_en || formData.name_ar,
        store_description: formData.description_en || formData.description_ar
      });

      if (applicationError) throw applicationError;

      toast({
        title: 'Application Submitted',
        description: 'Your seller application has been submitted for review. You will be notified once it is approved.',
      });

      // Redirect to seller page which will show the pending status
      navigate('/seller');

    } catch (error: any) {
      console.error('Application error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-2">
        {language === 'ar' ? 'التقدم كبائع' : 'Apply as Seller'}
      </h1>
      <p className="text-muted-foreground mb-8">
        {language === 'ar'
          ? 'لتصبح بائعًا على GoCart، يرجى تقديم معلومات متجرك للمراجعة. سيتم إخطارك بمجرد الموافقة على طلبك.'
          : 'To become a seller on GoCart, please submit your store information for review. You will be notified once your application is approved.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name_en">
            {language === 'ar' ? 'اسم المتجر (إنجليزي)' : 'Store Name (English)'}
          </Label>
          <Input
            id="name_en"
            type="text"
            placeholder={language === 'ar' ? 'أدخل اسم متجرك بالإنجليزية' : 'Enter your store name in English'}
            value={formData.name_en}
            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
            required={!formData.name_ar}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description_en">
            {language === 'ar' ? 'وصف المتجر (إنجليزي)' : 'Store Description (English)'}
          </Label>
          <Textarea
            id="description_en"
            placeholder={language === 'ar' ? 'أدخل وصف المتجر بالإنجليزية' : 'Enter your store description in English'}
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name_ar">
            {language === 'ar' ? 'اسم المتجر (عربي)' : 'Store Name (Arabic)'}
          </Label>
          <Input
            id="name_ar"
            type="text"
            placeholder={language === 'ar' ? 'أدخل اسم متجرك بالعربية' : 'Enter your store name in Arabic'}
            value={formData.name_ar}
            onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
            required={!formData.name_en}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description_ar">
            {language === 'ar' ? 'وصف المتجر (عربي)' : 'Store Description (Arabic)'}
          </Label>
          <Textarea
            id="description_ar"
            placeholder={language === 'ar' ? 'أدخل وصف المتجر بالعربية' : 'Enter your store description in Arabic'}
            value={formData.description_ar}
            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
            rows={4}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            language === 'ar' ? 'جارٍ التقديم...' : 'Submitting...'
          ) : (
            language === 'ar' ? 'تقديم الطلب' : 'Submit Application'
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateStore;