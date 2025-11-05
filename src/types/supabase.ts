export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean
          postal_code: string | null
          state: string | null
          street: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          id?: string
          is_default?: boolean
          postal_code?: string | null
          state?: string | null
          street: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          postal_code?: string | null
          state?: string | null
          street?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          image_url: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      category_translations: {
        Row: {
          category_id: string
          description: string | null
          id: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
        }
        Insert: {
          category_id: string
          description?: string | null
          id?: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
        }
        Update: {
          category_id?: string
          description?: string | null
          id?: string
          language_code?: Database["public"]["Enums"]["language_code"]
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      product_attributes: {
        Row: {
          id: string
          name: string
          type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_attribute_translations: {
        Row: {
          id: string
          attribute_id: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
        }
        Insert: {
          id?: string
          attribute_id: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
        }
        Update: {
          id?: string
          attribute_id?: string
          language_code?: Database["public"]["Enums"]["language_code"]
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_translations_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_attributes"
            referencedColumns: ["id"]
          }
        ]
      }
      product_attribute_values: {
        Row: {
          id: string
          attribute_id: string
          value: string
          created_at: string
        }
        Insert: {
          id?: string
          attribute_id: string
          value: string
          created_at?: string
        }
        Update: {
          id?: string
          attribute_id?: string
          value?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_values_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_attributes"
            referencedColumns: ["id"]
          }
        ]
      }
      product_attribute_value_translations: {
        Row: {
          id: string
          value_id: string
          language_code: Database["public"]["Enums"]["language_code"]
          value: string
        }
        Insert: {
          id?: string
          value_id: string
          language_code: Database["public"]["Enums"]["language_code"]
          value: string
        }
        Update: {
          id?: string
          value_id?: string
          language_code?: Database["public"]["Enums"]["language_code"]
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_value_translations_value_id_fkey"
            columns: ["value_id"]
            isOneToOne: false
            referencedRelation: "product_attribute_values"
            referencedColumns: ["id"]
          }
        ]
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string | null
          price: number
          original_price: number | null
          stock: number
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          sku?: string | null
          price: number
          original_price?: number | null
          stock?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          sku?: string | null
          price?: number
          original_price?: number | null
          stock?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      product_variant_attributes: {
        Row: {
          id: string
          variant_id: string
          attribute_id: string
          value: string
          created_at: string
        }
        Insert: {
          id?: string
          variant_id: string
          attribute_id: string
          value: string
          created_at?: string
        }
        Update: {
          id?: string
          variant_id?: string
          attribute_id?: string
          value?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variant_attributes_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variant_attributes_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          gallery_urls: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean
          original_price: number | null
          price: number
          rating: number
          reviews_count: number
          slug: string
          stock: number
          store_id: string
          updated_at: string
          has_variants: boolean
          base_price: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          original_price?: number | null
          price: number
          rating?: number
          reviews_count?: number
          slug: string
          stock?: number
          store_id: string
          updated_at?: string
          has_variants?: boolean
          base_price?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          original_price?: number | null
          price?: number
          rating?: number
          reviews_count?: number
          slug?: string
          stock?: number
          store_id?: string
          updated_at?: string
          has_variants?: boolean
          base_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          }
        ]
      }
      // ... rest of the existing types ...
    }
    Enums: {
      app_role: "user" | "seller" | "admin"
      language_code: "en" | "ar"
    }
  }
}
