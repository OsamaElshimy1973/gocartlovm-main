import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminTranslations: React.FC = () => {
  const { user, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && (!user || !hasRole('admin'))) {
      navigate('/auth');
    }
  }, [user, hasRole, authLoading, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ['site_texts_all'],
    queryFn: async () => {
      const { data: rows, error } = await (supabase as any).from('site_texts').select('id, key, language_code, value');
      if (error) throw error;
      return rows || [];
    },
    enabled: !!user,
  });

  const [edits, setEdits] = useState<Record<string, { en?: string; ar?: string }>>({});

  useEffect(() => {
    if (data) {
      const map: Record<string, { en?: string; ar?: string }> = {};
      (data as any[]).forEach((r) => {
        if (!map[r.key]) map[r.key] = {};
        map[r.key][r.language_code] = r.value;
      });
      setEdits(map);
    }
  }, [data]);

  const handleChange = (key: string, lang: 'en' | 'ar', value: string) => {
    setEdits((s) => ({ ...s, [key]: { ...(s[key] || {}), [lang]: value } }));
  };

  const saveKey = async (key: string) => {
    const entry = edits[key];
    if (!entry) return;

    try {
      // upsert both en and ar values if present
      const ops: Array<Promise<any>> = [];
      if (entry.en !== undefined) {
        ops.push(
          (supabase as any).from('site_texts').upsert({ key, language_code: 'en', value: entry.en }, { onConflict: '(key, language_code)' }),
        );
      }
      if (entry.ar !== undefined) {
        ops.push(
          (supabase as any).from('site_texts').upsert({ key, language_code: 'ar', value: entry.ar }, { onConflict: '(key, language_code)' }),
        );
      }

      const results = await Promise.all(ops);
      const err = results.find((r) => r.error)?.error;
      if (err) throw err;

      toast({ title: 'Saved', description: `Saved translations for ${key}` });
  await queryClient.invalidateQueries({ queryKey: ['site_texts_all'] });
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Error', description: e.message || 'Failed to save' });
    }
  };

  if (authLoading || isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-4">Site Translations</h1>
      <p className="mb-6 text-sm text-muted-foreground">Edit site UI strings. Changes are saved to the database and will override built-in translations.</p>

      <div className="space-y-4">
        {Object.keys(edits).map((key) => (
          <div key={key} className="p-4 border rounded-md bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{key}</div>
              <button
                className="px-3 py-1 bg-primary text-white rounded"
                onClick={() => saveKey(key)}
              >
                Save
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">English (en)</label>
                <textarea
                  className="w-full mt-1 p-2 border rounded h-24"
                  value={edits[key]?.en ?? ''}
                  onChange={(e) => handleChange(key, 'en', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Arabic (ar)</label>
                <textarea
                  dir="rtl"
                  className="w-full mt-1 p-2 border rounded h-24"
                  value={edits[key]?.ar ?? ''}
                  onChange={(e) => handleChange(key, 'ar', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTranslations;
