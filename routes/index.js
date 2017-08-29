const Router = require('express-promise-router')

const db = require('../db')

const router = new Router()

router.get('/', async(req,res) => {
	const text = 'SELECT * FROM workspaces'
	const { rows } = await db.query(text)
	res.render('index', {
		workspaces:rows
	})
})

module.exports = router;
