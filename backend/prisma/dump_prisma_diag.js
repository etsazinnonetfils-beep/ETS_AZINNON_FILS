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

const out = [];
out.push('cwd=' + process.cwd());
const schemaPath = 'prisma/schema.prisma';
out.push('schemaExists=' + fs.existsSync(schemaPath));
if (fs.existsSync(schemaPath)) {
  const buf = fs.readFileSync(schemaPath);
  out.push('len=' + buf.length);
  out.push('hex=' + buf.slice(0,80).toString('hex'));
  out.push('text=' + buf.slice(0,120).toString('utf8').replace(/\r/g,'\\r').replace(/\n/g,'\\n'));
}
const result = run('node_modules/.bin/prisma.cmd', ['validate', '--schema', schemaPath]);
out.push('prisma_status=' + result.status);
out.push('prisma_stdout=' + result.stdout);
out.push('prisma_stderr=' + result.stderr);
fs.writeFileSync('prisma_diag.txt', out.join('\n'), 'utf8');
console.log('wrote prisma_diag.txt');
