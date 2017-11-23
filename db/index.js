const {Pool, Client} = require('pg')
const config = require('../config/postgres.json')

const pool = new Pool({
	user: config.user,
	host: config.host,
	database: config.database,
	password: config.password,
	port: config.port,
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

module.exports = {
	query: (text,params) => pool.query(text,params),
	end: () => pool.end()
}