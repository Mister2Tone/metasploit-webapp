const Router = require('express-promise-router')
// const msfapi = require('../lib/workspaces.js')
const db = require('../db')

const router = new Router()

router.get('/:id', async(req,res) =>{
	const hostId = req.params.id 
	const data = [ hostId ]
	const text = 'SELECT * FROM services WHERE host_id=($1)'
	const { rows } = await db.query(text,data)
	const services = rows
	res.render('pages/hosts/show', {
		hostId,
		services
	})
})

module.exports = router