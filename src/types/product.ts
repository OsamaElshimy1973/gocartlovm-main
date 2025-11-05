import { Database } from './supabase'

export type ProductAttribute = Database['public']['Tables']['product_attributes']['Row']
export type ProductAttributeTranslation = Database['public']['Tables']['product_attribute_translations']['Row']
export type ProductAttributeValue = Database['public']['Tables']['product_attribute_values']['Row']
export type ProductAttributeValueTranslation = Database['public']['Tables']['product_attribute_value_translations']['Row']
export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type ProductVariantAttribute = Database['public']['Tables']['product_variant_attributes']['Row']

export type ProductAttributeWithTranslations = ProductAttribute & {
  translations: ProductAttributeTranslation[]
  values?: (ProductAttributeValue & {
    translations: ProductAttributeValueTranslation[]
  })[]
}

export type ProductWithTranslations = Database['public']['Tables']['products']['Row'] & { product_translations?: any[] }

export type ProductVariantWithAttributes = ProductVariant & {
  attributes: (ProductVariantAttribute & {
    attribute: ProductAttributeWithTranslations
  })[]
}