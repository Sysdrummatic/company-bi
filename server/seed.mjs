import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const jsonPath = path.join(__dirname, '..', 'src', 'data', 'database.json');

const escapeSql = (value) => value.replace(/'/g, "''");

const runStatements = (statements) =>
  new Promise((resolve, reject) => {
    const child = spawn('sqlite3', [dbPath]);
    let stderr = '';

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `sqlite3 exited with code ${code}`));
      } else {
        resolve();
      }
    });

    statements.forEach((statement) => {
      child.stdin.write(`${statement}\n`);
    });

    child.stdin.end();
  });

const seedDatabase = async () => {
  const raw = await readFile(jsonPath, 'utf8');
  const companies = JSON.parse(raw);

  const statements = [
    "PRAGMA foreign_keys = OFF;",
    'DROP TABLE IF EXISTS companies;',
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      krs_nip_or_hrb TEXT NOT NULL,
      status TEXT NOT NULL,
      description TEXT NOT NULL,
      country TEXT NOT NULL,
      industry TEXT NOT NULL,
      employee_count TEXT NOT NULL,
      founded_year INTEGER NOT NULL,
      address TEXT NOT NULL,
      website TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      revenue TEXT NOT NULL,
      management TEXT NOT NULL,
      products_and_services TEXT NOT NULL,
      technologies_used TEXT NOT NULL,
      last_updated TEXT NOT NULL,
      owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      is_public INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
    'DELETE FROM sessions;',
  ];

  for (const company of companies) {
    const values = [
      escapeSql(company.companyName),
      escapeSql(company.krsNIPorHRB),
      escapeSql(company.status),
      escapeSql(company.description),
      escapeSql(company.country),
      escapeSql(company.industry),
      escapeSql(company.employeeCount),
      company.foundedYear,
      escapeSql(company.address),
      escapeSql(company.website),
      escapeSql(company.contactEmail),
      escapeSql(company.phoneNumber),
      escapeSql(company.revenue),
      escapeSql(JSON.stringify(company.management ?? [])),
      escapeSql(JSON.stringify(company.productsAndServices ?? [])),
      escapeSql(JSON.stringify(company.technologiesUsed ?? [])),
      escapeSql(company.lastUpdated ?? new Date().toISOString()),
    ];

    const insertStatement = `INSERT INTO companies (
        company_name,
        krs_nip_or_hrb,
        status,
        description,
        country,
        industry,
        employee_count,
        founded_year,
        address,
        website,
        contact_email,
        phone_number,
        revenue,
        management,
        products_and_services,
        technologies_used,
        last_updated
      ) VALUES ('${values.join("','")}');`;

    statements.push(insertStatement);
  }

  statements.push('CREATE INDEX IF NOT EXISTS idx_companies_owner ON companies(owner_id);');
  statements.push('CREATE INDEX IF NOT EXISTS idx_companies_public ON companies(is_public);');
  statements.push('CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);');
  statements.push('PRAGMA foreign_keys = ON;');
  statements.push('PRAGMA optimize;');

  if (existsSync(dbPath)) {
    await runStatements(['PRAGMA journal_mode = WAL;']);
  }

  await runStatements(statements);
  console.log(`Seeded ${companies.length} companies into ${dbPath}`);
};

seedDatabase().catch((error) => {
  console.error('Failed to seed database:', error);
  process.exit(1);
});
