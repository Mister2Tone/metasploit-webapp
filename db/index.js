const {Pool, Client} = require('pg')
const config = require('../config/postgres.json')

const pool = new Pool({
	user: config.user,
	host: config.host,
	database: config.database,
	password: config.password,
	port: config.port,
})

module.exports = {
	query: (text) => pool.query(text)
}