const { Pool } = require('pg')

const dbPool = new Pool({

  database: 'web_personal_b35',
  port: '5432',
  user: 'postgres',
  password: 'Putra220300',
})



module.exports = dbPool
