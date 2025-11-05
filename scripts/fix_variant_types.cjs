const fs = require('fs');
const p = 'C:\\Users\\Administrator\\Desktop\\gocartlovm\\src\\hooks\\useProductVariantMutations.ts';
let s = fs.readFileSync(p, 'utf8');
s = s.split("supabase\n        .from(").join("(supabase as any)\n        .from(");
s = s.replace("const variantAttributes: ProductVariantAttribute[] = []", "const variantAttributes: any[] = []");
fs.writeFileSync(p, s);
console.log('patched file');
