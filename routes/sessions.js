const Router = require('express-promise-router')
const sessionApi = require('../lib/sessions.js')
// const workspaceApi = require('../lib/workspaces.js')
const db = require('../db')

const router = new Router()

router.get('/', async(req,res) => {
	var sessions = {}
	await sessionApi.listSessionActive()
		.then( (result) => {
			sessions = result
			console.log(sessions);
		}).catch( (err) => {
			console.log(err);
		})
	res.render('pages/sessions/index', {
		sessions
	})
})

router.get('/:id/post', async(req,res) => {
	const sessionId = req.params.id
	console.log("xyz")
	res.render('pages/sessions/post',{
		sessionId
	})
})

router.post('/:id/post/reboot_now', async(req,res) => {
	const sessionId = req.params.id
	console.log(sessionId);
	var env = {}
	await sessionApi.writeMeterpreterConsole(sessionId,'reboot\n')
		.then( (result) => {
			env = result
		}).catch( (err) => {
			res.send(err)
		})
	res.send(env)
})


module.exports = router