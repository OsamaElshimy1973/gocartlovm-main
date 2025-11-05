import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CreateStore = () => {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    // support bilingual fields
    name_en: '',
    description_en: '',
    name_ar: '',
    description_ar: '',
    email: '',
    contactNumber: '',
    address: '',
  });

  useEffect(() => {
    if (!authLoading && (!user || !hasRole('seller'))) {
      navigate('/auth');
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

      // Check if slug is available
      const { data: existingStore, error: slugCheckError } = await supabase
        .from('stores')
        .select('id')
        .eq('slug', formData.username)
        .maybeSingle();

      if (slugCheckError) throw slugCheckError;
      if (existingStore) throw new Error('Store username is already taken');

      // Create store row with all fields
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .insert({
          slug: formData.username,
          user_id: user.id,
          email: formData.email,
          contact_number: formData.contactNumber,
          address: formData.address
        })
        .select()
        .single();

      if (storeError) throw storeError;
      if (!storeData) throw new Error('Failed to create store');

      const translationsToInsert: any[] = [];
      if (formData.name_en || formData.description_en) {
        translationsToInsert.push({
          store_id: storeData.id,
          language_code: 'en',
          name: formData.name_en || formData.name_ar || formData.username,
          description: formData.description_en || null,
        });
      }
      if (formData.name_ar || formData.description_ar) {
        translationsToInsert.push({
          store_id: storeData.id,
          language_code: 'ar',
          name: formData.name_ar || formData.name_en || formData.username,
          description: formData.description_ar || null,
        });
      }

      // Always insert at least one translation
      if (translationsToInsert.length === 0) {
        throw new Error('At least one language translation is required');
      }

      const { error: transError } = await supabase
        .from('store_translations')
        .insert(translationsToInsert);

      if (transError) throw transError;

      // Verify the store was created successfully by trying to read it back
      const { data: verifyStore, error: verifyError } = await supabase
        .from('stores')
        .select(`
          *,
          store_translations (*)
        `)
        .eq('id', storeData.id)
        .single();

      if (verifyError || !verifyStore) {
        throw new Error('Failed to verify store creation. Please try again.');
      }

      toast({
        title: 'Success',
        description: 'Your store has been submitted for admin verification.',
      });

      navigate('/seller/dashboard');
    } catch (error: any) {
      console.error('Store creation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create store. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  const { language, t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-2">{language === 'ar' ? 'إضافة متجرك' : 'Add Your Store'}</h1>
      <p className="text-muted-foreground mb-8">
        {language === 'ar'
          ? 'لتصبح بائعًا على GoCart، قم بتقديم تفاصيل متجرك للمراجعة. سيتم تفعيل متجرك بعد موافقة المسؤول.'
          : 'To become a seller on GoCart, submit your store details for review. Your store will be activated after admin verification.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="logo">Store Logo</Label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Click to upload logo</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your store username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name_en">{language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'}</Label>
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
          <Label htmlFor="description_en">{language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
          <Textarea
            id="description_en"
            placeholder={language === 'ar' ? 'أدخل وصف المتجر بالإنجليزية' : 'Enter your store description in English'}
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name_ar">{language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}</Label>
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
          <Label htmlFor="description_ar">{language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
          <Textarea
            id="description_ar"
            placeholder={language === 'ar' ? 'أدخل وصف المتجر بالعربية' : 'Enter your store description in Arabic'}
            value={formData.description_ar}
            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your store email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            type="tel"
            placeholder="Enter your store contact number"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter your store address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={3}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default CreateStore;