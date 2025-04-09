const { Pool } = require('pg');

let globalPool;

const getPool = () => {
  if (!globalPool) {
    globalPool = new Pool({
      connectionString: process.env.DB_LINK,
      ssl: { rejectUnauthorized: false } // ← requis pour Neon
    });
  }
  return globalPool;
};

module.exports = { getPool };
