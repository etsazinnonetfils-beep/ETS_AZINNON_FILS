const fs = require('fs');
const { spawnSync } = require('child_process');

function run(command, args, cwd = process.cwd()) {
  const result = spawnSync(command, args, {
    cwd,
    shell: true,
    stdio: 'inherit',
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`${command} a échoué avec le code ${result.status}`);
  }

  return result;
}

const outPath = 'prisma_diagnostics.txt';
const schemaPath = 'prisma/schema.prisma';
const fixedPath = 'prisma/schema_fixed.prisma';
let out = '';
out += `cwd=${process.cwd()}\n`;
out += `schema_exists=${fs.existsSync(schemaPath)}\n`;
out += `fixed_exists=${fs.existsSync(fixedPath)}\n`;
if (fs.existsSync(schemaPath)) {
  const buf = fs.readFileSync(schemaPath);
  out += `schema_len=${buf.length}\n`;
  out += `schema_hex=${buf.slice(0,80).toString('hex')}\n`;
  out += `schema_head=${buf.slice(0,120).toString('utf8').replace(/\r/g,'\\r').replace(/\n/g,'\\n')}\n`;
  out += `schema_tail=${buf.slice(-120).toString('utf8').replace(/\r/g,'\\r').replace(/\n/g,'\\n')}\n`;
}
const result = run('node_modules/.bin/prisma.cmd', ['validate', '--schema', schemaPath]);
out += `prisma_status=${result.status}\n`;
out += `prisma_signal=${result.signal}\n`;
out += `prisma_stdout=${result.stdout}\n`;
out += `prisma_stderr=${result.stderr}\n`;
fs.writeFileSync(outPath, out, 'utf8');
console.log(`Diagnostics written to ${outPath}`);
