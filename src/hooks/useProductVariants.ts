import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useLanguage } from '@/contexts/LanguageContext'
import type { ProductAttributeWithTranslations } from '@/types/product'

export function useProductAttributes() {
  const { language } = useLanguage()

  return useQuery({
    queryKey: ['productAttributes', language],
    queryFn: async () => {
      const { data: attributes, error } = await (supabase as any).from('product_attributes')
        .select(`
          *,
          translations (
            *
          ),
          values: product_attribute_values (
            *,
            translations (
              *
            )
          )
        `)
        .order('name')

      if (error) throw error

      return attributes.map((attr: ProductAttributeWithTranslations) => ({
        ...attr,
        // Get translation in current language, fallback to first available
        name: attr.translations.find(t => t.language_code === language)?.name 
          || attr.translations[0]?.name 
          || attr.name,
        values: attr.values?.map(value => ({
          ...value,
          // Get translation in current language, fallback to first available
          value: value.translations.find(t => t.language_code === language)?.value 
            || value.translations[0]?.value 
            || value.value
        }))
      }))
    }
  })
}

export function useProductVariants(productId: string) {
  const { language } = useLanguage()

  return useQuery({
    queryKey: ['productVariants', productId, language],
    queryFn: async () => {
      const { data: variants, error } = await (supabase as any).from('product_variants')
        .select(`
          *,
          attributes: product_variant_attributes (
            *,
            attribute: product_attributes (
              *,
              translations (
                *
              ),
              values: product_attribute_values (
                *,
                translations (
                  *
                )
              )
            )
          )
        `)
        .eq('product_id', productId)
        .order('created_at')

      if (error) throw error

      return variants.map(variant => ({
        ...variant,
        attributes: variant.attributes.map(attr => ({
          ...attr,
          attribute: {
            ...attr.attribute,
            name: attr.attribute.translations.find(t => t.language_code === language)?.name 
              || attr.attribute.translations[0]?.name 
              || attr.attribute.name,
            values: attr.attribute.values?.map(value => ({
              ...value,
              value: value.translations.find(t => t.language_code === language)?.value 
                || value.translations[0]?.value 
                || value.value
            }))
          }
        }))
      }))
    },
    enabled: !!productId
  })
}