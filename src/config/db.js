// src/config/db.js
// 'pg' Pool = connection pool (like HikariCP in Spring Boot)
// Instead of JPA/Hibernate, we write raw SQL here — good for learning!

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ PostgreSQL connected successfully');
    release();
  }
});

// db.query('SELECT * FROM users WHERE id=$1', [userId])
// $1,$2 = parameterized queries → prevents SQL injection
module.exports = {
  query: (text, params) => pool.query(text, params),
};