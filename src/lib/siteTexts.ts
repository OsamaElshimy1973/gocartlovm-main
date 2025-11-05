import { supabase } from '@/integrations/supabase/client';

export async function fetchSiteTexts(languageCode: string): Promise<Record<string, string>> {
  try {
    // `site_texts` may not be present in the generated Supabase types yet
    const { data, error } = await (supabase as any)
      .from('site_texts')
      .select('key, value')
      .eq('language_code', languageCode);

    if (error) throw error;

    const map: Record<string, string> = {};
    if (Array.isArray(data)) {
      data.forEach((row: any) => {
        if (row?.key) map[row.key] = row.value;
      });
    }

    return map;
  } catch (err) {
    console.error('fetchSiteTexts error', err);
    return {};
  }
}
