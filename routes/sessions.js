const Router = require('express-promise-router')
const sessionApi = require('../lib/sessions.js')
const moduleApi = require('../lib/modules.js')
const workspaceApi = require('../lib/workspaces.js')
const db = require('../db')

const router = new Router()

router.get('/', async(req,res) => {
	var sessions = {}
	await sessionApi.listSessionActive()
		.then( (result) => {
			sessions = result
			//console.log(sessions);
		}).catch( (err) => {
			console.log(err);
		})
	res.render('pages/sessions/index', {
		sessions
	})
})

router.get('/:id/post', async(req,res) => {
	const sessionId = req.params.id
	var postModulesAll = await sessionApi.getCompatibleSessionModule(sessionId)
		.then( (result) => {
			return result.modules
		}).catch( (err) => {
			console.log(err)
		})

	var postModules = {}

	for(var i in postModulesAll){
		postModules[i] = await moduleApi.getModuleInfo('post',postModulesAll[i])
					.then( (result) => {
						let buffer = {
							name : result.name,
							fullname : result.fullname,
							rank : result.rank
						}
						return buffer
					})
	}

	res.render('pages/sessions/post',{
		sessionId,
		postModules
	})
})

router.get('/:id/*/new', async(req,res) => {
	const sessionId = req.params.id
	const postModuleName = req.params[0]

	await moduleApi.getModuleInfo('post',postModuleName)
		.then( (result) => {
			postModuleInfo = result
		}).catch( (err) => {
			console.log(err)
		})

	await moduleApi.getModuleOption('post',postModuleName)
		.then( (result) => {
			postModuleOption = result
		}).catch( (err) => {
			console.log(err)
		})

	res.render('pages/sessions/show', {
		postModuleInfo,
		postModuleOption,
		sessionId
	})
})

router.post('/*/run_now', async(req,res) => {
	const postModulePath = req.params[0]
	const payload = req.body

	var textPayload = ""
	for(var prop in payload){
		if(payload[prop])
			textPayload += "set "+prop+" "+payload[prop]+"\n"
	}
	workspaceApi.runExploit(postModulePath,textPayload)
	res.redirect('/sessions/status')

})

router.get('/status', async(req,res) => {
	res.render('pages/sessions/status')
})

router.get('/status/update', async(req,res) => {
	res.writeHead(200, {
		'Content-Type' : 'text/event-stream',
		'Cache-Control' : 'no-cache',
		'Connection' : 'keep-alive'
	})

	var ticker = setInterval( () => {
		workspaceApi.getMsfCommandDisplay().then((result) => {
			data = result.data.split('\n').join('(newline)')
			res.write('data: ' + data + '\n\n')
            success = /Post module execution completed/.test(data)
            if(success){
                clearInterval(ticker)
            }
		})
	},5000)

})


module.exports = router