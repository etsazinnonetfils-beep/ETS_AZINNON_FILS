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

const schemaPath = 'prisma/schema.prisma';
const schema = fs.readFileSync(schemaPath);
console.log('SCHEMA_PATH=' + schemaPath);
console.log('len=' + schema.length);
console.log('hex=' + schema.slice(0, 80).toString('hex'));
console.log('text=' + schema.slice(0, 160).toString('utf8').replace(/\r/g, '\r').replace(/\n/g, '\n'));
console.log('--- node version ---');
console.log(process.version);
console.log('--- validate ---');
run('node_modules/.bin/prisma.cmd', ['validate', '--schema', schemaPath]);