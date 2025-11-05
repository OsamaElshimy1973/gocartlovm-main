const fs = require('fs');
const repo = 'C:\\Users\\Administrator\\Desktop\\gocartlovm';
const files = [repo + '\\src\\hooks\\useProductVariants.ts', repo + '\\src\\hooks\\useProductVariantMutations.ts', repo + '\\src\\hooks\\useProductVariants.ts'];
files.forEach(p => {
  if (!fs.existsSync(p)) return console.log('missing', p);
  let s = fs.readFileSync(p,'utf8');
  s = s.replace(/supabase\s*\.from\(/g, '(supabase as any).from(');
  fs.writeFileSync(p,s);
  console.log('forced casts in', p);
});
