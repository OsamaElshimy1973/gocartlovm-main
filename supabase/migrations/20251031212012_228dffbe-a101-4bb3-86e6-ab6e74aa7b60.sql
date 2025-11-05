-- Insert dummy categories
INSERT INTO public.categories (slug, icon, image_url) VALUES
('speakers', '🔊', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400'),
('watch', '⌚', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'),
('earbuds', '🎧', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'),
('mouse', '🖱️', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'),
('decoration', '🎨', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400'),
('headphones', '🎧', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400');

-- Insert category translations
INSERT INTO public.category_translations (category_id, language_code, name, description) 
SELECT 
  c.id,
  'en',
  CASE c.slug
    WHEN 'speakers' THEN 'Speakers'
    WHEN 'watch' THEN 'Watch'
    WHEN 'earbuds' THEN 'Earbuds'
    WHEN 'mouse' THEN 'Mouse'
    WHEN 'decoration' THEN 'Decoration'
    WHEN 'headphones' THEN 'Headphones'
  END,
  CASE c.slug
    WHEN 'speakers' THEN 'High-quality speakers and sound systems'
    WHEN 'watch' THEN 'Smart watches and fitness trackers'
    WHEN 'earbuds' THEN 'Wireless earbuds and in-ear headphones'
    WHEN 'mouse' THEN 'Computer mice and accessories'
    WHEN 'decoration' THEN 'Home and office decoration'
    WHEN 'headphones' THEN 'Over-ear and on-ear headphones'
  END
FROM public.categories c;

-- Insert dummy stores
INSERT INTO public.stores (slug, logo_url, cover_url, rating, total_products) VALUES
('techstore', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800', 4.8, 0),
('gadgetworld', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200', 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=800', 4.6, 0),
('smartgear', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200', 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800', 4.9, 0);

-- Insert store translations
INSERT INTO public.store_translations (store_id, language_code, name, description)
SELECT 
  s.id,
  'en',
  CASE s.slug
    WHEN 'techstore' THEN 'Tech Store'
    WHEN 'gadgetworld' THEN 'Gadget World'
    WHEN 'smartgear' THEN 'Smart Gear'
  END,
  CASE s.slug
    WHEN 'techstore' THEN 'Your one-stop shop for all tech needs'
    WHEN 'gadgetworld' THEN 'Latest gadgets and electronics'
    WHEN 'smartgear' THEN 'Premium smart devices and accessories'
  END
FROM public.stores s;

-- Insert dummy products
INSERT INTO public.products (slug, image_url, price, original_price, rating, reviews_count, stock, store_id, category_id, is_featured)
SELECT
  'smart-home-cleaner-' || s.id,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
  229,
  299,
  4.2,
  89,
  15,
  s.id,
  (SELECT id FROM categories WHERE slug = 'decoration' LIMIT 1),
  true
FROM (SELECT id FROM stores LIMIT 1) s
UNION ALL
SELECT
  'ergonomic-mouse-' || s.id,
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
  99,
  149,
  3.8,
  124,
  45,
  s.id,
  (SELECT id FROM categories WHERE slug = 'mouse' LIMIT 1),
  true
FROM (SELECT id FROM stores LIMIT 1) s
UNION ALL
SELECT
  'apple-smart-watch-' || s.id,
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  199,
  249,
  5.0,
  256,
  30,
  s.id,
  (SELECT id FROM categories WHERE slug = 'watch' LIMIT 1),
  true
FROM (SELECT id FROM stores LIMIT 1) s
UNION ALL
SELECT
  'apple-wireless-earbuds-' || s.id,
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
  89,
  129,
  4.1,
  178,
  60,
  s.id,
  (SELECT id FROM categories WHERE slug = 'earbuds' LIMIT 1),
  true
FROM (SELECT id FROM stores LIMIT 1) s
UNION ALL
SELECT
  'home-theater-' || s.id,
  'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400',
  149,
  199,
  5.0,
  92,
  20,
  s.id,
  (SELECT id FROM categories WHERE slug = 'speakers' LIMIT 1),
  false
FROM (SELECT id FROM stores LIMIT 1) s
UNION ALL
SELECT
  'wireless-headphones-' || s.id,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  59,
  89,
  5.0,
  203,
  75,
  s.id,
  (SELECT id FROM categories WHERE slug = 'headphones' LIMIT 1),
  false
FROM (SELECT id FROM stores LIMIT 1) s
UNION ALL
SELECT
  'smart-pen-ipad-' || s.id,
  'https://images.unsplash.com/photo-1585399000684-d2f72660f092?w=400',
  66,
  99,
  4.0,
  145,
  40,
  s.id,
  (SELECT id FROM categories WHERE slug = 'decoration' LIMIT 1),
  false
FROM (SELECT id FROM stores LIMIT 1) s
UNION ALL
SELECT
  'security-camera-' || s.id,
  'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=400',
  44,
  79,
  5.0,
  167,
  55,
  s.id,
  (SELECT id FROM categories WHERE slug = 'decoration' LIMIT 1),
  false
FROM (SELECT id FROM stores LIMIT 1) s;

-- Insert product translations
INSERT INTO public.product_translations (product_id, language_code, name, description)
SELECT
  p.id,
  'en',
  CASE 
    WHEN p.slug LIKE 'smart-home-cleaner%' THEN 'Smart Home Cleaner'
    WHEN p.slug LIKE 'ergonomic-mouse%' THEN 'Ergonomic Mouse'
    WHEN p.slug LIKE 'apple-smart-watch%' THEN 'Apple Smart Watch'
    WHEN p.slug LIKE 'apple-wireless-earbuds%' THEN 'Apple Wireless Earbuds'
    WHEN p.slug LIKE 'home-theater%' THEN 'Home Theater'
    WHEN p.slug LIKE 'wireless-headphones%' THEN 'Wireless headphones'
    WHEN p.slug LIKE 'smart-pen-ipad%' THEN 'Smart Pen for iPad'
    WHEN p.slug LIKE 'security-camera%' THEN 'Security Camera'
  END,
  CASE 
    WHEN p.slug LIKE 'smart-home-cleaner%' THEN 'Advanced robot vacuum with smart navigation'
    WHEN p.slug LIKE 'ergonomic-mouse%' THEN 'Comfortable ergonomic wireless mouse'
    WHEN p.slug LIKE 'apple-smart-watch%' THEN 'Latest Apple Watch with health tracking'
    WHEN p.slug LIKE 'apple-wireless-earbuds%' THEN 'Premium wireless earbuds with noise cancellation'
    WHEN p.slug LIKE 'home-theater%' THEN 'Complete home theater sound system'
    WHEN p.slug LIKE 'wireless-headphones%' THEN 'High-quality over-ear wireless headphones'
    WHEN p.slug LIKE 'smart-pen-ipad%' THEN 'Precision stylus for iPad Pro'
    WHEN p.slug LIKE 'security-camera%' THEN 'HD security camera with night vision'
  END
FROM public.products p;

-- Update store product counts
-- Update store product counts (two-step: set counts where products exist, then set zero for others)
UPDATE public.stores s
SET total_products = sub.count
FROM (
  SELECT store_id, COUNT(*) AS count
  FROM public.products
  GROUP BY store_id
) AS sub
WHERE s.id = sub.store_id;

UPDATE public.stores s
SET total_products = 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.products p WHERE p.store_id = s.id
);

-- Insert dummy coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_purchase, max_discount, expire_at, usage_limit, is_active) VALUES
('FIRST20', 'percentage', 20, 50, 100, NOW() + INTERVAL '30 days', 1000, true),
('SAVE50', 'fixed', 50, 200, NULL, NOW() + INTERVAL '60 days', 500, true),
('WELCOME10', 'percentage', 10, 0, 50, NOW() + INTERVAL '90 days', NULL, true);