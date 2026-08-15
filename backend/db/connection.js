// SQLite connection using Node.js 24 built-in node:sqlite
// No native build tools required – uses the bundled WASM-backed SQLite.
// node:sqlite is available in Node >= 22.5.0 (stable in 23+, production-ready in 24+)

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'onestop.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

// Enable WAL mode and foreign keys for consistency
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

module.exports = db;
