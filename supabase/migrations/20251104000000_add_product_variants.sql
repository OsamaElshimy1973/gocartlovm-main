-- Create attributes table
CREATE TABLE public.product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'number', 'boolean', 'select')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create attribute translations table
CREATE TABLE public.product_attribute_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attribute_id UUID REFERENCES public.product_attributes(id) ON DELETE CASCADE NOT NULL,
  language_code language_code NOT NULL,
  name TEXT NOT NULL,
  UNIQUE(attribute_id, language_code)
);

-- Create attribute values table for predefined values (e.g., for select type)
CREATE TABLE public.product_attribute_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attribute_id UUID REFERENCES public.product_attributes(id) ON DELETE CASCADE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create attribute value translations
CREATE TABLE public.product_attribute_value_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value_id UUID REFERENCES public.product_attribute_values(id) ON DELETE CASCADE NOT NULL,
  language_code language_code NOT NULL,
  value TEXT NOT NULL,
  UNIQUE(value_id, language_code)
);

-- Create product variants table
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  sku TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  stock INTEGER DEFAULT 0 NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create variant attributes junction table
CREATE TABLE public.product_variant_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE NOT NULL,
  attribute_id UUID REFERENCES public.product_attributes(id) ON DELETE CASCADE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attribute_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attribute_value_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variant_attributes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Product attributes are viewable by everyone" 
  ON public.product_attributes FOR SELECT USING (true);

CREATE POLICY "Product attribute translations are viewable by everyone" 
  ON public.product_attribute_translations FOR SELECT USING (true);

CREATE POLICY "Product attribute values are viewable by everyone" 
  ON public.product_attribute_values FOR SELECT USING (true);

CREATE POLICY "Product attribute value translations are viewable by everyone" 
  ON public.product_attribute_value_translations FOR SELECT USING (true);

CREATE POLICY "Product variants are viewable by everyone" 
  ON public.product_variants FOR SELECT USING (true);

CREATE POLICY "Product variant attributes are viewable by everyone" 
  ON public.product_variant_attributes FOR SELECT USING (true);

-- Seller access policies
CREATE POLICY "Sellers can manage product attributes for their products"
ON public.product_attributes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.stores s
    WHERE s.user_id = auth.uid()
  )
);

CREATE POLICY "Sellers can manage product variants for their products"
ON public.product_variants
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.products p
    JOIN public.stores s ON p.store_id = s.id
    WHERE p.id = product_variants.product_id
    AND s.user_id = auth.uid()
  )
);

-- Update products table
ALTER TABLE public.products 
ADD COLUMN has_variants BOOLEAN DEFAULT false,
ADD COLUMN base_price DECIMAL(10,2);

-- Add triggers for updated_at
CREATE TRIGGER set_updated_at 
  BEFORE UPDATE ON public.product_attributes
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at 
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Add some common attributes
INSERT INTO public.product_attributes (name, type) VALUES
('Color', 'select'),
('Size', 'select'),
('Material', 'text'),
('Weight', 'number'),
('Storage', 'select'),
('RAM', 'select');

-- Add translations for the common attributes
INSERT INTO public.product_attribute_translations (attribute_id, language_code, name)
SELECT 
  a.id,
  'en',
  a.name
FROM public.product_attributes a;

INSERT INTO public.product_attribute_translations (attribute_id, language_code, name)
SELECT 
  a.id,
  'ar',
  CASE a.name
    WHEN 'Color' THEN 'اللون'
    WHEN 'Size' THEN 'المقاس'
    WHEN 'Material' THEN 'الخامة'
    WHEN 'Weight' THEN 'الوزن'
    WHEN 'Storage' THEN 'التخزين'
    WHEN 'RAM' THEN 'الذاكرة'
  END
FROM public.product_attributes a;

-- Add common values for select attributes
WITH color_attr AS (
  SELECT id FROM public.product_attributes WHERE name = 'Color'
)
INSERT INTO public.product_attribute_values (attribute_id, value)
SELECT id, unnest(ARRAY['Black', 'White', 'Red', 'Blue', 'Green'])
FROM color_attr;

WITH size_attr AS (
  SELECT id FROM public.product_attributes WHERE name = 'Size'
)
INSERT INTO public.product_attribute_values (attribute_id, value)
SELECT id, unnest(ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'])
FROM size_attr;

WITH storage_attr AS (
  SELECT id FROM public.product_attributes WHERE name = 'Storage'
)
INSERT INTO public.product_attribute_values (attribute_id, value)
SELECT id, unnest(ARRAY['64GB', '128GB', '256GB', '512GB', '1TB'])
FROM storage_attr;

WITH ram_attr AS (
  SELECT id FROM public.product_attributes WHERE name = 'RAM'
)
INSERT INTO public.product_attribute_values (attribute_id, value)
SELECT id, unnest(ARRAY['4GB', '8GB', '16GB', '32GB'])
FROM ram_attr;

-- Add translations for attribute values
INSERT INTO public.product_attribute_value_translations (value_id, language_code, value)
SELECT id, 'en', value
FROM public.product_attribute_values;

INSERT INTO public.product_attribute_value_translations (value_id, language_code, value)
SELECT 
  v.id, 
  'ar',
  CASE v.value
    WHEN 'Black' THEN 'أسود'
    WHEN 'White' THEN 'أبيض'
    WHEN 'Red' THEN 'أحمر'
    WHEN 'Blue' THEN 'أزرق'
    WHEN 'Green' THEN 'أخضر'
    WHEN 'XS' THEN 'صغير جداً'
    WHEN 'S' THEN 'صغير'
    WHEN 'M' THEN 'وسط'
    WHEN 'L' THEN 'كبير'
    WHEN 'XL' THEN 'كبير جداً'
    WHEN 'XXL' THEN 'كبير جداً جداً'
    ELSE v.value -- Keep technical specs as is
  END
FROM public.product_attribute_values v;