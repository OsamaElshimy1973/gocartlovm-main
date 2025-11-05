import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { ProductVariant, ProductVariantAttribute } from '@/types/product'

interface VariantInput {
  sku: string
  price: number
  original_price?: number | null
  stock: number
  image_url?: string | null
  attributes: {
    attribute_id: string
    value: string
  }[]
}

interface CreateVariantOptions {
  productId: string
  variants: VariantInput[]
}

export function useProductVariantMutations() {
  const queryClient = useQueryClient()

  const createVariants = useMutation({
    mutationFn: async ({ productId, variants }: CreateVariantOptions) => {
      // First create all variants
      const { data: createdVariants, error: variantsError } = await (supabase as any)
        .from('product_variants')
        .insert(
          variants.map(variant => ({
            product_id: productId,
            sku: variant.sku,
            price: variant.price,
            original_price: variant.original_price,
            stock: variant.stock,
            image_url: variant.image_url
          }))
        )
        .select()

      if (variantsError) throw variantsError
      if (!createdVariants) throw new Error('Failed to create variants')

      // Then create all variant attributes
      const variantAttributes: any[] = []
      for (let i = 0; i < createdVariants.length; i++) {
        const variant = createdVariants[i]
        const variantInput = variants[i]

        for (const attr of variantInput.attributes) {
          variantAttributes.push({
            variant_id: variant.id,
            attribute_id: attr.attribute_id,
            value: attr.value,
            created_at: new Date().toISOString()
          })
        }
      }

      const { error: attributesError } = await (supabase as any)
        .from('product_variant_attributes')
        .insert(variantAttributes)

      if (attributesError) throw attributesError

      // Update product to indicate it has variants
      const { error: productError } = await (supabase as any)
        .from('products')
        .update({
          has_variants: true,
          base_price: Math.min(...variants.map(v => v.price))
        })
        .eq('id', productId)

      if (productError) throw productError

      return createdVariants
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['productVariants', productId] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
    }
  })

  const updateVariant = useMutation({
    mutationFn: async (variant: ProductVariant) => {
      const { error } = await (supabase as any)
        .from('product_variants')
        .update({
          sku: variant.sku,
          price: variant.price,
          original_price: variant.original_price,
          stock: variant.stock,
          image_url: variant.image_url
        })
        .eq('id', variant.id)

      if (error) throw error
      return variant
    },
    onSuccess: (variant) => {
      queryClient.invalidateQueries({ queryKey: ['productVariants'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
    }
  })

  const deleteVariant = useMutation({
    mutationFn: async (variantId: string) => {
      const { error } = await (supabase as any)
        .from('product_variants')
        .delete()
        .eq('id', variantId)

      if (error) throw error
      return variantId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productVariants'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
    }
  })

  return {
    createVariants,
    updateVariant,
    deleteVariant
  }
}