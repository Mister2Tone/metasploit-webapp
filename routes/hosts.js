const Router = require('express-promise-router')
// const msfapi = require('../lib/workspaces.js')
const db = require('../db')

const router = new Router()

router.get('/:id', async(req,res) =>{
	const hostId = req.params.id 
	const data = [ hostId ]
	var text = 'SELECT * FROM services WHERE host_id=($1)'
	var buffer  = await db.query(text,data)
	const services = buffer.rows

	text = 'SELECT * FROM vulns WHERE host_id=($1)'
	buffer = await db.query(text,data)
	const vulns = buffer.rows
	// text = 'SELECT name FROM refs WHERE id IN(SELECT ref_id FROM vulns_refs WHERE vuln_id IN(SELECT id FROM vulns WHERE host_id=$1))'

	text = 'SELECT * FROM notes WHERE host_id=($1)'
	buffer = await db.query(text,data)
	const notes = buffer.rows

	text = 'SELECT * FROM loots WHERE host_id=($1)'
	buffer = await db.query(text,data)
	const loots = buffer.rows

	res.render('pages/hosts/show', {
		hostId,
		services,
		vulns,
		notes,
		loots
	})
})

module.exports = router