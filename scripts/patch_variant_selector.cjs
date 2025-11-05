const fs = require('fs');
const p = 'C:\\Users\\Administrator\\Desktop\\gocartlovm\\src\\components\\VariantSelector.tsx';
let s = fs.readFileSync(p, 'utf8');
const oldRegex = /const attributes = variants\?\.reduce\([\s\S]*?\) \|\| \{\}/m;
const replacement = `const attributes: Record<string, any> = variants?.reduce((acc, variant) => {
    variant.attributes.forEach(attr => {
      if (!acc[attr.attribute.id]) {
        acc[attr.attribute.id] = attr.attribute
      }
    })
    return acc
  }, {} as Record<string, any>) || {}`;
if (!oldRegex.test(s)) {
  console.log('pattern not found');
} else {
  s = s.replace(oldRegex, replacement);
  fs.writeFileSync(p, s);
  console.log('patched VariantSelector');
}
