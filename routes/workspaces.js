const Router = require('express-promise-router')
const workspaceApi = require('../lib/workspaces.js')
const moduleApi = require('../lib/modules.js')
const sessionApi = require('../lib/sessions.js')
const jobApi = require('../lib/jobs.js')
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
	workspaceApi.changeWorkspace(workspace.name)
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

router.get('/:id/hosts', async(req,res) => {
	const data = [req.params.id ]
	const text = 'SELECT * FROM hosts WHERE workspace_id=($1)'
	const { rows } = await db.query(text, data)
	const hosts = rows
	res.render('pages/workspaces/hosts', {
		hosts
	})
})

router.post('/:id/tasks/new_scan', async(req,res) => {
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

	workspaceApi.scanHostsWithNmap(targetIp)
	res.redirect('/workspaces/tasks/status')
})

router.get('/tasks/status', async(req,res) => {
	
	res.render('pages/workspaces/status')
})

router.get('/tasks/update', async(req,res) => {
	res.writeHead(200, {
		'Content-Type' : 'text/event-stream',
		'Cache-Control' : 'no-cache',
		'Connection' : 'keep-alive'
	})

	var ticker = setInterval( () => {
		workspaceApi.getMsfCommandDisplay().then((result) => {
			data = result.data.split('\n').join('(newline)')
			success = /Nmap done/.test(data)
			if(success){
				clearInterval(ticker)
			}
			res.write('data: ' + data + '\n\n')
		})
	},5000)
})

router.get('/:id/cleanSessions', async(req,res) => {
	var workspaceId = req.params.id;
	var sessions = {}
	sessions = await sessionApi.listSessionActive()
		.then( (result) => {
			return result
		})
	for(sessionId in sessions){
		//console.log("Id: "+Id)
		sessionApi.stopSessionActive(sessionId)
			.then( (result) => {
				console.log(result)
			}).catch( (err) => {
				console.log(err)
		})
	}
    res.redirect('/workspaces/'+workspaceId);

})

router.get('/:id/getHostsQuantity', async(req,res) => {
    const params = [req.params.id ]
    const text = 'SELECT COUNT(*) FROM hosts WHERE workspace_id=($1)'
    const { rows } = await db.query(text, params)

    res.writeHead(200, {
        'Content-Type' : 'text/event-stream',
        'Cache-Control' : 'no-cache',
        'Connection' : 'keep-alive'
    })
    	var data = rows[0].count
        res.write('data: ' + data + '\n\n')
})

router.get('/:id/getServicesQuantity', async(req,res) => {
	const params = [req.params.id]
	const text = 'SELECT COUNT(id) FROM services WHERE host_id IN (SELECT id FROM hosts WHERE workspace_id = ($1))'
	const { rows } = await  db.query(text, params)

    res.writeHead(200, {
        'Content-Type' : 'text/event-stream',
        'Cache-Control' : 'no-cache',
        'Connection' : 'keep-alive'
    })
    var data = rows[0].count
    res.write('data: ' + data + '\n\n')

})

router.get('/:id/getSessionQuantity', async(req,res) => {
    var sessions = {}
    var count=0
    await sessionApi.listSessionActive()
        .then( (result) => {
            sessions = result
            for(var Id in sessions){
                if(Id != null)
                    count++
            }
        })
	var data = sessions;
    data = count;

    res.writeHead(200, {
        'Content-Type' : 'text/event-stream',
        'Cache-Control' : 'no-cache',
        'Connection' : 'keep-alive'
    })
    res.write('data: ' + data + '\n\n')

})

module.exports = router
