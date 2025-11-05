import { useState, useEffect } from 'react'
import { useProductVariants } from '@/hooks/useProductVariants'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/contexts/LanguageContext'
import type { ProductVariantWithAttributes } from '@/types/product'

interface VariantSelectorProps {
  productId: string
  onVariantChange: (variant: ProductVariantWithAttributes | null) => void
}

export function VariantSelector({ productId, onVariantChange }: VariantSelectorProps) {
  const { language } = useLanguage()
  const { data: variants, isLoading } = useProductVariants(productId)
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({})

  // Get unique attributes across all variants
  const attributes: Record<string, any> = variants?.reduce((acc, variant) => {
    variant.attributes.forEach(attr => {
      if (!acc[attr.attribute.id]) {
        acc[attr.attribute.id] = attr.attribute
      }
    })
    return acc
  }, {} as Record<string, any>) || {}

  // Get available values for each attribute based on currently selected values
  const getAvailableValues = (attributeId: string) => {
    if (!variants) return []

    // Filter variants based on currently selected values
    const filteredVariants = variants.filter(variant => {
      return Object.entries(selectedValues).every(([attrId, value]) => {
        if (attrId === attributeId) return true // Skip current attribute
        const attr = variant.attributes.find(a => a.attribute_id === attrId)
        return attr && attr.value === value
      })
    })

    // Get unique values for the current attribute from filtered variants
    const values = new Set<string>()
    filteredVariants.forEach(variant => {
      const attr = variant.attributes.find(a => a.attribute_id === attributeId)
      if (attr) values.add(attr.value)
    })

    return Array.from(values)
  }

  // Find matching variant based on selected values
  useEffect(() => {
    if (!variants) return

    const matchingVariant = variants.find(variant => {
      return Object.entries(selectedValues).every(([attrId, value]) => {
        const attr = variant.attributes.find(a => a.attribute_id === attrId)
        return attr && attr.value === value
      }) && variant.attributes.length === Object.keys(selectedValues).length
    })

    onVariantChange((matchingVariant as any) || null)
  }, [selectedValues, variants, onVariantChange])

  if (isLoading) return null

  if (!variants?.length) return null

  return (
    <div className="space-y-4">
      {Object.values(attributes).map(attribute => (
        <div key={attribute.id} className="space-y-2">
          <label className="font-medium">{attribute.name}</label>
          <Select
            value={selectedValues[attribute.id] || ''}
            onValueChange={(value) => {
              setSelectedValues(prev => ({ ...prev, [attribute.id]: value }))
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={language === 'ar' ? 'اختر قيمة' : 'Select a value'} />
            </SelectTrigger>
            <SelectContent>
              {getAvailableValues(attribute.id).map(value => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  )
}