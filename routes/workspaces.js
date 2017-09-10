const Router = require('express-promise-router')
const msfapi = require('../lib/workspaces.js')
const db = require('../db')

const router = new Router()


router.get('/new', function(req, res, next) {
	res.render('pages/workspaces/create')
})

router.post('/new', async(req,res) => {
	const data = [ req.body.name, 
				   req.body.description ]
	const text = 'INSERT INTO workspaces(name, description, created_at, updated_at) VALUES($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
	const { rows } = await db.query(text, data)
	res.redirect('/')
})

router.get('/:id', async(req,res) => {
	const data = [req.params.id]
	const text = 'SELECT * FROM workspaces WHERE id=($1)'
	const { rows } = await db.query(text, data)
	const workspace = {
		id : rows[0].id,
		name : rows[0].name,
		description : rows[0].description
	}
	msfapi.changeWorkspace(workspace.name)
	res.render('pages/workspaces/show', {
		workspace
	})
})

router.get('/:id/edit', async(req,res) => {
	const data = [ req.params.id ]
	const text = 'SELECT * FROM workspaces WHERE id=($1)'
	const { rows } = await db.query(text, data)
	const workspaces = {
		id : rows[0].id,
		name : rows[0].name,
		description : rows[0].description
	}
	res.render('pages/workspaces/update', {
		workspaces
	})
})

router.post('/:id/edit', async(req,res) => {
	const data = [ req.body.name,
				   req.body.description,
				   req.params.id ]
	const text = 'UPDATE workspaces SET name=($1), description=($2), updated_at=(CURRENT_TIMESTAMP) WHERE id=($3)'
	const { rows } = await db.query(text, data)
	res.redirect('/')
})

router.get('/:id/delete', async(req,res) => {
	const data = [ req.params.id ]
	const text = 'DELETE FROM workspaces WHERE id=($1)'
	const { rows } = await db.query(text, data)
	res.redirect('/')
})

router.post('/:id/tasks/new_scan', function(req,res) {
	const workspace = { 
		id : req.params.id,
		name : req.body.workspaceName 
	}
	res.render('pages/workspaces/new_scan', {
		workspace
	})
})

router.post('/:id/tasks/scan_now', async(req,res) => {
	const targetIp = req.body.targetIp
	const id = req.params.id

	msfapi.scanHostsWithNmap(targetIp)
	res.redirect('/workspaces/'+id+'/tasks/status')
})

router.get('/:id/tasks/status', async(req,res) => {
	const scanResult = await msfapi.getMsfCommandDisplay()
	res.send(scanResult.data)
})

module.exports = router
