export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean | null
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
          is_default?: boolean | null
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
          is_default?: boolean | null
          postal_code?: string | null
          state?: string | null
          street?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          expire_at: string
          id: string
          is_active: boolean | null
          max_discount: number | null
          min_purchase: number | null
          usage_count: number | null
          usage_limit: number | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          expire_at: string
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_purchase?: number | null
          usage_count?: number | null
          usage_limit?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          expire_at?: string
          id?: string
          is_active?: boolean | null
          max_discount?: number | null
          min_purchase?: number | null
          usage_count?: number | null
          usage_limit?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          price: number
          product_id: string | null
          product_image: string | null
          product_name: string
          quantity: number
          store_id: string | null
          total: number
        }
        Insert: {
          id?: string
          order_id: string
          price: number
          product_id?: string | null
          product_image?: string | null
          product_name: string
          quantity: number
          store_id?: string | null
          total: number
        }
        Update: {
          id?: string
          order_id?: string
          price?: number
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          quantity?: number
          store_id?: string | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          coupon_id: string | null
          created_at: string
          discount: number | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          shipping: number | null
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_id?: string | null
          coupon_id?: string | null
          created_at?: string
          discount?: number | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping?: number | null
          status?: string
          subtotal: number
          total: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_id?: string | null
          coupon_id?: string | null
          created_at?: string
          discount?: number | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping?: number | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      product_translations: {
        Row: {
          description: string | null
          id: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
          product_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
          product_id: string
        }
        Update: {
          description?: string | null
          id?: string
          language_code?: Database["public"]["Enums"]["language_code"]
          name?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          gallery_urls: string[] | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          original_price: number | null
          price: number
          rating: number | null
          reviews_count: number | null
          slug: string
          stock: number
          store_id: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          original_price?: number | null
          price: number
          rating?: number | null
          reviews_count?: number | null
          slug: string
          stock?: number
          store_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          gallery_urls?: string[] | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          original_price?: number | null
          price?: number
          rating?: number | null
          reviews_count?: number | null
          slug?: string
          stock?: number
          store_id?: string
          updated_at?: string
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
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      store_translations: {
        Row: {
          description: string | null
          id: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
          store_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
          store_id: string
        }
        Update: {
          description?: string | null
          id?: string
          language_code?: Database["public"]["Enums"]["language_code"]
          name?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_translations_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          cover_url: string | null
          created_at: string
          id: string
          logo_url: string | null
          rating: number | null
          slug: string
          total_products: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          rating?: number | null
          slug: string
          total_products?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          rating?: number | null
          slug?: string
          total_products?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "seller" | "admin"
      language_code: "en" | "ar"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "seller", "admin"],
      language_code: ["en", "ar"],
    },
  },
} as const
