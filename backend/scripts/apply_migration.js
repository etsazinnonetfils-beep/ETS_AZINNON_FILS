const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const migrationPath = path.resolve(__dirname, '..', 'prisma', 'migrations', '20260804120000_sync_sales_schema', 'migration.sql');
    if (!fs.existsSync(migrationPath)) {
      console.error('Migration file not found:', migrationPath);
      process.exit(1);
    }

    const sql = fs.readFileSync(migrationPath, { encoding: 'utf8' });
    console.log('Applying migration file:', migrationPath);

    // Split into top-level statements, respecting $$ blocks and parentheses.
    const statements = [];
    let cur = '';
    let i = 0;
    let inDollar = false;
    let dollarTag = null;
    let parenDepth = 0;
    while (i < sql.length) {
      const ch = sql[i];
      const next2 = sql.slice(i, i + 2);

      // Detect start/end of dollar-quote $$ or $tag$
      if (!inDollar && ch === '$') {
        // find next $ to get tag
        const m = sql.slice(i).match(/^\$[A-Za-z0-9_]*\$/);
        if (m) {
          inDollar = true;
          dollarTag = m[0];
          cur += m[0];
          i += m[0].length;
          continue;
        }
      } else if (inDollar && sql.slice(i, i + dollarTag.length) === dollarTag) {
        inDollar = false;
        cur += dollarTag;
        i += dollarTag.length;
        continue;
      }

      if (!inDollar) {
        if (ch === '(') parenDepth++;
        else if (ch === ')') parenDepth = Math.max(0, parenDepth - 1);
        else if (ch === ';' && parenDepth === 0) {
          // end of statement
          const stmt = cur.trim();
          if (stmt) statements.push(stmt + ';');
          cur = '';
          i++;
          continue;
        }
      }

      cur += ch;
      i++;
    }
    if (cur.trim()) statements.push(cur.trim());

    console.log('Parsed', statements.length, 'statements. Executing...');

    for (const [idx, stmt] of statements.entries()) {
      try {
        console.log(`Executing statement ${idx + 1}/${statements.length}`);
        await prisma.$executeRawUnsafe(stmt);
      } catch (e) {
        console.error(`Statement ${idx + 1} failed:`, e.message || e);
        throw e;
      }
    }

    console.log('Migration executed. Verify with `npx prisma migrate status` and tests.');
  } catch (err) {
    console.error('Migration application failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
