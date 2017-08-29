const Router = require('express-promise-router')
const msfapi = require('../lib/workspaces.js');
const db = require('../db')

const router = new Router()


router.get('/', function(req, res, next) {
	res.render("pages/workspaces/create");
});

router.post('/', async(req,res) => {
	const data = [ req.body.name, 
				   req.body.description ]
	const text = 'INSERT INTO workspaces(name, description, created_at, updated_at) VALUES($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
	const { rows } = await db.query(text, data)
	res.redirect('/')
})



module.exports = router;
