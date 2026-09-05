const fs = require('fs');
const source = 'schema_fixed.prisma';
const dest = 'schema.prisma';
const content = fs.readFileSync(source, 'utf8');
fs.writeFileSync(dest, content, 'utf8');
console.log(`Rewrote ${dest} from ${source}`);