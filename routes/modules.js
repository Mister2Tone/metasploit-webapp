const Router = require('express-promise-router')
const moduleApi = require('../lib/modules.js')
const workspaceApi = require('../lib/workspaces.js')
const db = require('../db')

const router = new Router()

router.get('/', async(req,res) =>{
	var modules = {}
	moduleApi.getModuleInfo('exploit','windows/dcerpc/ms03_026_dcom')
		.then( (result) => {
			module = result
			// module = {
			// 	name : result.name,
			// 	fullname : result.fullname,
			// 	rank : result.rank,
			// 	disclosuredate : result.disclosuredate
			// }
		}).catch( (err) => {
			console.log(err)
		})
	res.render('pages/modules/index', {
		module
	})
})

router.get('/*/new', async(req,res) => {
	const moduleName = req.params[0]
	moduleApi.getModuleInfo('exploit',moduleName)
		.then( (result) => {
			module = result
		}).catch( (err) => {
			console.log(err)
		})
	res.render('pages/modules/show', {
		module
	})
})

router.post('/exploit_now', async(req,res) => {
	const targetIp = req.body.targetIp

	workspaceApi.runExploit(targetIp)
	res.redirect('/modules/status')
})

router.get('/status', async(req,res) => {
	res.render('pages/modules/status')
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
			success = /Meterpreter session \d opened/.test(data)
			if(success){
				clearInterval(ticker)
			}
			res.write('data: ' + data + '\n\n')
		})
	},5000)

})

module.exports = router