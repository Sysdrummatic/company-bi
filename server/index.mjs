import http from 'node:http';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const PORT = process.env.PORT || 4000;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

const escapeSql = (value) => value.replace(/'/g, "''");

const runQuery = (sql) =>
  new Promise((resolve, reject) => {
    const child = spawn('sqlite3', [dbPath, '-json', sql]);
    let output = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `sqlite3 exited with code ${code}`));
        return;
      }

      try {
        const parsed = output ? JSON.parse(output) : [];
        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    });
  });

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

const ensureSchema = async () => {
  await runStatements([
    "PRAGMA foreign_keys = ON;",
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
    `CREATE TABLE IF NOT EXISTS companies (
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
    'CREATE INDEX IF NOT EXISTS idx_companies_owner ON companies(owner_id);',
    'CREATE INDEX IF NOT EXISTS idx_companies_public ON companies(is_public);',
    'CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);',
  ]);
};

const purgeExpiredSessions = () =>
  runStatements(["DELETE FROM sessions WHERE expires_at <= datetime('now');"]);

const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });

    req.on('end', () => {
      resolve(body);
    });

    req.on('error', (error) => {
      reject(error);
    });
  });

const parseJsonBody = async (req) => {
  const body = await readRequestBody(req);

  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error('Invalid JSON payload');
  }
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16);
  const derivedKey = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256');
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
};

const verifyPassword = (password, storedHash) => {
  const [saltHex, hashHex] = storedHash.split(':');

  if (!saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const derivedKey = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256');

  try {
    return crypto.timingSafeEqual(Buffer.from(hashHex, 'hex'), derivedKey);
  } catch (error) {
    return false;
  }
};

const createSession = async (userId) => {
  await purgeExpiredSessions();
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  await runQuery(`INSERT INTO sessions (token, user_id, expires_at) VALUES ('${escapeSql(token)}', ${userId}, '${escapeSql(expiresAt)}') RETURNING token;`);

  return { token, expiresAt };
};

const authenticateRequest = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return null;
  }

  const escapedToken = escapeSql(token);
  const rows = await runQuery(`
    SELECT users.id AS user_id, users.username, sessions.expires_at
    FROM sessions
    INNER JOIN users ON users.id = sessions.user_id
    WHERE sessions.token = '${escapedToken}'
      AND sessions.expires_at > datetime('now');
  `);

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return { id: row.user_id, username: row.username };
};

const parseStringArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
};

const prepareCompanyData = (payload, ownerId) => {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Invalid company payload');
  }

  const getRequiredString = (key) => {
    const rawValue = payload[key];
    if (typeof rawValue !== 'string') {
      throw new Error(`Field "${key}" is required`);
    }
    const value = rawValue.trim();
    if (!value) {
      throw new Error(`Field "${key}" cannot be empty`);
    }
    return value;
  };

  const companyName = getRequiredString('companyName');
  const krsNIPorHRB = getRequiredString('krsNIPorHRB');
  const status = getRequiredString('status');
  const description = getRequiredString('description');
  const country = getRequiredString('country');
  const industry = getRequiredString('industry');
  const employeeCount = getRequiredString('employeeCount');
  const address = getRequiredString('address');
  const website = getRequiredString('website');
  const contactEmail = getRequiredString('contactEmail');
  const phoneNumber = getRequiredString('phoneNumber');
  const revenue = getRequiredString('revenue');

  const foundedYearValue = payload.foundedYear;
  const foundedYear = typeof foundedYearValue === 'number' ? foundedYearValue : Number(foundedYearValue);

  if (!Number.isInteger(foundedYear) || foundedYear <= 0) {
    throw new Error('Field "foundedYear" must be a positive integer year');
  }

  const management = parseStringArray(payload.management);
  const productsAndServices = parseStringArray(payload.productsAndServices);
  const technologiesUsed = parseStringArray(payload.technologiesUsed);

  const lastUpdatedValue = typeof payload.lastUpdated === 'string' && payload.lastUpdated.trim().length > 0
    ? payload.lastUpdated.trim()
    : new Date().toISOString();

  const isPublic = payload.isPublic === false ? 0 : 1;

  return {
    company_name: escapeSql(companyName),
    krs_nip_or_hrb: escapeSql(krsNIPorHRB),
    status: escapeSql(status),
    description: escapeSql(description),
    country: escapeSql(country),
    industry: escapeSql(industry),
    employee_count: escapeSql(employeeCount),
    founded_year: foundedYear,
    address: escapeSql(address),
    website: escapeSql(website),
    contact_email: escapeSql(contactEmail),
    phone_number: escapeSql(phoneNumber),
    revenue: escapeSql(revenue),
    management: escapeSql(JSON.stringify(management)),
    products_and_services: escapeSql(JSON.stringify(productsAndServices)),
    technologies_used: escapeSql(JSON.stringify(technologiesUsed)),
    last_updated: escapeSql(lastUpdatedValue),
    owner_id: ownerId ?? null,
    is_public: isPublic,
  };
};

const insertCompany = async (payload, ownerId) => {
  const data = prepareCompanyData(payload, ownerId);

  const columns = [
    'company_name',
    'krs_nip_or_hrb',
    'status',
    'description',
    'country',
    'industry',
    'employee_count',
    'founded_year',
    'address',
    'website',
    'contact_email',
    'phone_number',
    'revenue',
    'management',
    'products_and_services',
    'technologies_used',
    'last_updated',
    'owner_id',
    'is_public',
  ];

  const values = [
    `'${data.company_name}'`,
    `'${data.krs_nip_or_hrb}'`,
    `'${data.status}'`,
    `'${data.description}'`,
    `'${data.country}'`,
    `'${data.industry}'`,
    `'${data.employee_count}'`,
    data.founded_year,
    `'${data.address}'`,
    `'${data.website}'`,
    `'${data.contact_email}'`,
    `'${data.phone_number}'`,
    `'${data.revenue}'`,
    `'${data.management}'`,
    `'${data.products_and_services}'`,
    `'${data.technologies_used}'`,
    `'${data.last_updated}'`,
    data.owner_id === null ? 'NULL' : data.owner_id,
    data.is_public,
  ];

  const sql = `INSERT INTO companies (${columns.join(', ')}) VALUES (${values.join(', ')}) RETURNING *;`;
  const rows = await runQuery(sql);
  return rows.length > 0 ? rows[0] : null;
};

const parseJsonColumn = (value) => {
  if (typeof value !== 'string') {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const mapCompanyRow = (row) => ({
  id: row.id,
  companyName: row.company_name,
  krsNIPorHRB: row.krs_nip_or_hrb,
  status: row.status,
  description: row.description,
  country: row.country,
  industry: row.industry,
  employeeCount: row.employee_count,
  foundedYear: row.founded_year,
  address: row.address,
  website: row.website,
  contactEmail: row.contact_email,
  phoneNumber: row.phone_number,
  revenue: row.revenue,
  management: parseJsonColumn(row.management),
  productsAndServices: parseJsonColumn(row.products_and_services),
  technologiesUsed: parseJsonColumn(row.technologies_used),
  lastUpdated: row.last_updated,
  ownerId: row.owner_id ?? null,
  isPublic: row.is_public === 1,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const sendJson = (res, statusCode, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(body);
};

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end();
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '600',
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (req.method === 'GET' && url.pathname === '/api/companies') {
      const mine = url.searchParams.get('mine') === 'true';

      if (mine) {
        const user = await authenticateRequest(req);
        if (!user) {
          sendJson(res, 401, { message: 'Authentication required' });
          return;
        }

        const rows = await runQuery(`SELECT * FROM companies WHERE owner_id = ${user.id} ORDER BY updated_at DESC;`);
        sendJson(res, 200, rows.map(mapCompanyRow));
        return;
      }

      const rows = await runQuery('SELECT * FROM companies WHERE is_public = 1 ORDER BY company_name ASC;');
      sendJson(res, 200, rows.map(mapCompanyRow));
      return;
    }

    if (req.method === 'GET' && url.pathname.startsWith('/api/companies/')) {
      const id = Number(url.pathname.replace('/api/companies/', ''));

      if (!Number.isFinite(id)) {
        sendJson(res, 400, { message: 'Invalid company id' });
        return;
      }

      const rows = await runQuery(`SELECT * FROM companies WHERE id = ${id};`);

      if (rows.length === 0) {
        sendJson(res, 404, { message: 'Company not found' });
        return;
      }

      const companyRow = rows[0];

      if (companyRow.is_public !== 1) {
        const user = await authenticateRequest(req);
        if (!user || companyRow.owner_id !== user.id) {
          sendJson(res, 403, { message: 'Access to this company is restricted' });
          return;
        }
      }

      sendJson(res, 200, mapCompanyRow(companyRow));
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/register') {
      const payload = await parseJsonBody(req);
      const usernameRaw = typeof payload.username === 'string' ? payload.username.trim() : '';
      const password = typeof payload.password === 'string' ? payload.password : '';

      if (!usernameRaw) {
        sendJson(res, 400, { message: 'Username is required' });
        return;
      }

      if (usernameRaw.length < 3) {
        sendJson(res, 400, { message: 'Username must be at least 3 characters long' });
        return;
      }

      if (password.length < 8) {
        sendJson(res, 400, { message: 'Password must be at least 8 characters long' });
        return;
      }

      const escapedUsername = escapeSql(usernameRaw);
      const existingUsers = await runQuery(`SELECT id FROM users WHERE username = '${escapedUsername}' LIMIT 1;`);

      if (existingUsers.length > 0) {
        sendJson(res, 409, { message: 'This username is already registered' });
        return;
      }

      const passwordHash = hashPassword(password);
      const escapedPassword = escapeSql(passwordHash);

      const rows = await runQuery(`
        INSERT INTO users (username, password_hash)
        VALUES ('${escapedUsername}', '${escapedPassword}')
        RETURNING id, username, created_at;
      `);

      if (rows.length === 0) {
        throw new Error('Failed to create user');
      }

      const userRow = rows[0];
      const session = await createSession(userRow.id);

      sendJson(res, 201, {
        token: session.token,
        expiresAt: session.expiresAt,
        user: {
          id: userRow.id,
          username: userRow.username,
          createdAt: userRow.created_at,
        },
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
      const payload = await parseJsonBody(req);
      const usernameRaw = typeof payload.username === 'string' ? payload.username.trim() : '';
      const password = typeof payload.password === 'string' ? payload.password : '';

      if (!usernameRaw || !password) {
        sendJson(res, 400, { message: 'Username and password are required' });
        return;
      }

      const escapedUsername = escapeSql(usernameRaw);
      const rows = await runQuery(`SELECT id, username, password_hash FROM users WHERE username = '${escapedUsername}' LIMIT 1;`);

      if (rows.length === 0) {
        sendJson(res, 401, { message: 'Invalid username or password' });
        return;
      }

      const userRow = rows[0];

      if (!verifyPassword(password, userRow.password_hash)) {
        sendJson(res, 401, { message: 'Invalid username or password' });
        return;
      }

      const session = await createSession(userRow.id);

      sendJson(res, 200, {
        token: session.token,
        expiresAt: session.expiresAt,
        user: {
          id: userRow.id,
          username: userRow.username,
        },
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/companies') {
      const user = await authenticateRequest(req);

      if (!user) {
        sendJson(res, 401, { message: 'Authentication required' });
        return;
      }

      let companyRow;
      try {
        const payload = await parseJsonBody(req);
        companyRow = await insertCompany(payload, user.id);
      } catch (error) {
        sendJson(res, 400, { message: error.message });
        return;
      }

      if (!companyRow) {
        throw new Error('Failed to persist company');
      }

      sendJson(res, 201, mapCompanyRow(companyRow));
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/companies/import') {
      const user = await authenticateRequest(req);

      if (!user) {
        sendJson(res, 401, { message: 'Authentication required' });
        return;
      }

      let payload;
      try {
        payload = await parseJsonBody(req);
      } catch (error) {
        sendJson(res, 400, { message: error.message });
        return;
      }

      const companiesPayload = Array.isArray(payload) ? payload : Array.isArray(payload?.companies) ? payload.companies : null;

      if (!companiesPayload) {
        sendJson(res, 400, { message: 'Expected an array of companies in the request body' });
        return;
      }

      const inserted = [];

      for (let index = 0; index < companiesPayload.length; index += 1) {
        try {
          const companyRow = await insertCompany(companiesPayload[index], user.id);
          if (companyRow) {
            inserted.push(mapCompanyRow(companyRow));
          }
        } catch (error) {
          sendJson(res, 400, {
            message: `Failed to import company at index ${index}: ${error.message}`,
          });
          return;
        }
      }

      sendJson(res, 201, { inserted: inserted.length, companies: inserted });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/health') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }

    res.writeHead(404, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({ message: 'Not found' }));
  } catch (error) {
    console.error('Request handling error:', error);
    sendJson(res, 500, { message: 'Internal server error' });
  }
});

ensureSchema()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`API server listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialise database schema:', error);
    process.exit(1);
  });
