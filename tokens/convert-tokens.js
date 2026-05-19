const fs = require('fs');
const path = require('path');

const colorFile = path.join(__dirname, 'colour-tokens.json');
const typographyFile = path.join(__dirname, 'design-tokens.tokens.json');
const outputFile = path.join(__dirname, 'design-tokens.css');

// Load JSON data
const colorData = JSON.parse(fs.readFileSync(colorFile, 'utf8'));
const typoData = JSON.parse(fs.readFileSync(typographyFile, 'utf8'));

let css = `/* Auto-generated CSS variables from tokens */\n\n`;

// Utility to convert camelCase/PascalCase to kebab-case
const toKebab = (str) =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// --- 1. Process Color Roles ---
// We only extract colour roles (which point to raw primitives via references like {color.key.primary})
const rolesLight = colorData.color.role.light;
const rolesDark = colorData.color.role.dark;

// Resolves references like "{color.palette.primary.100}"
function resolveColor(ref) {
  if (typeof ref === 'string' && ref.startsWith('{') && ref.endsWith('}')) {
    const pathSegments = ref.slice(1, -1).split('.');
    let curr = colorData;
    for (const p of pathSegments) {
      if (curr[p] !== undefined) {
        curr = curr[p];
      } else {
        return ref; // Unresolved reference
      }
    }
    return curr;
  }
  return ref;
}

css += `:root {\n  /* --- Light Theme Colors (Roles Only) --- */\n`;
for (const [key, value] of Object.entries(rolesLight)) {
  css += `  --color-${toKebab(key)}: ${resolveColor(value)};\n`;
}
css += `}\n\n`;

css += `@media (prefers-color-scheme: dark) {\n  :root {\n    /* --- Dark Theme Colors (Roles Only) --- */\n`;
for (const [key, value] of Object.entries(rolesDark)) {
  css += `    --color-${toKebab(key)}: ${resolveColor(value)};\n`;
}
css += `  }\n}\n\n`;

// --- 2. Process Typography Tokens ---
css += `:root {\n  /* --- Typography Variables --- */\n`;
function processTypo(obj, prefix = '') {
  for (const [k, v] of Object.entries(obj)) {
    if (v && v.type === 'custom-fontStyle' && v.value) {
      const nodeName = prefix + toKebab(k);
      for (const [prop, propVal] of Object.entries(v.value)) {
        let finalVal = propVal;
        const cssProp = toKebab(prop);
        
        // Append 'px' to specific numeric properties if non-zero
        if (
          ['font-size', 'line-height', 'letter-spacing', 'paragraph-spacing', 'paragraph-indent'].includes(cssProp) &&
          typeof finalVal === 'number'
        ) {
          if (finalVal !== 0) {
            finalVal = `${finalVal}px`;
          } else {
            finalVal = '0';
          }
        }
        
        // Ensure quotes around font families with spaces (although best practice is just adding quotes anyway)
        if (cssProp === 'font-family') {
          if (!finalVal.startsWith('"') && !finalVal.startsWith("'")) {
            finalVal = `"${finalVal}"`;
          }
        }
        
        css += `  --font-${nodeName}-${cssProp}: ${finalVal};\n`;
      }
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      // Recurse into nested objects
      processTypo(v, prefix + toKebab(k) + '-');
    }
  }
}

// Start processing from 'font' object if it exists, otherwise from root
if (typoData.font) {
  processTypo(typoData.font);
} else {
  processTypo(typoData);
}

css += `}\n`;

// Write variables to output file
fs.writeFileSync(outputFile, css);
console.log(`Successfully generated CSS variables in ${outputFile}`);
