const { Pool } = require('pg')

const dbPool = new Pool({

  database: 'DB_web-personal-b35',
  port: '5432',
  user: 'postgres',
  password: 'root',
})

module.exports = dbPool;
