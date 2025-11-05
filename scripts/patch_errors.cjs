const fs = require('fs');
const repo = 'C:\\Users\\Administrator\\Desktop\\gocartlovm';

// 1) Fix useProductVariants.ts to cast supabase
const p1 = repo + '\\src\\hooks\\useProductVariants.ts';
let s1 = fs.readFileSync(p1, 'utf8');
s1 = s1.split("supabase\n        .from(").join("(supabase as any)\n        .from(");
fs.writeFileSync(p1, s1);
console.log('patched useProductVariants');

// 2) Fix VariantSelector.tsx to cast matchingVariant when calling onVariantChange
const p2 = repo + '\\src\\components\\VariantSelector.tsx';
if (fs.existsSync(p2)) {
  let s2 = fs.readFileSync(p2, 'utf8');
  s2 = s2.replace(/onVariantChange\(matchingVariant \|\| null\)/g, "onVariantChange((matchingVariant as any) || null)");
  fs.writeFileSync(p2, s2);
  console.log('patched VariantSelector');
} else console.log('VariantSelector not found');

// 3) Make product_translations weaker in types/product.ts
const p3 = repo + '\\src\\types\\product.ts';
let s3 = fs.readFileSync(p3, 'utf8');
// replace the block exporting ProductWithTranslations
s3 = s3.replace(/export type ProductWithTranslations = [^;]+;/s, "export type ProductWithTranslations = Database['public']['Tables']['products']['Row'] & { product_translations?: any[] }");
fs.writeFileSync(p3, s3);
console.log('patched types/product.ts');
