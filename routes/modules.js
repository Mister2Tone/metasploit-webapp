const Router = require('express-promise-router')
const moduleApi = require('../lib/modules.js')
const workspaceApi = require('../lib/workspaces.js')
const db = require('../db')

const router = new Router()

router.get('/', async(req,res) =>{
	var modulesAll = await moduleApi.getExploitModules()
					.then((result) => {
						return result.modules
					})
	var modules = {}

	for(let i=0;i<modulesAll.length;i++){
		modules[i] = await moduleApi.getModuleInfo('exploit',modulesAll[i])
					.then( (result) => {
						let buffer = {
							name : result.name,
							fullname : result.fullname,
							rank : result.rank,
							disclosuredate : result.disclosuredate
						}
						return buffer
					})
	}

	res.render("pages/modules/index", {
		modules 
	})

})

router.post('/', async(req,res) => {
	var keyword = req.body.keyword
	var modulesAll = await moduleApi.getExploitModules()
					.then((result) => {
						return result.modules
					})
	var modulesMatch = []
	var modules = {}
	var index = 0;
	for(i = 0; i < modulesAll.length;i++){
		var pattern = new RegExp(keyword)
		found = pattern.test(modulesAll[i])
		if(found){
			modulesMatch[index] = modulesAll[i]
			modules[index] = await moduleApi.getModuleInfo('exploit',modulesMatch[index])
					.then( (result) => {
						let buffer = {
							name : result.name,
							fullname : result.fullname,
							rank : result.rank,
							disclosuredate : result.disclosuredate
						}
						return buffer
					}) 
			index++
		}
	}
	res.render("pages/modules/index", { 
		modules
	})
})

router.get('/*/new', async(req,res) => {
	const moduleName = req.params[0]
	await moduleApi.getModuleInfo('exploit',moduleName)
		.then( (result) => {
			moduleInfo = result
		}).catch( (err) => {
			console.log(err)
		})
	await moduleApi.getModuleOption('exploit',moduleName)
		.then( (result) => {
			moduleOption = result
		}).catch( (err) => {
			console.log(err)
		})
	res.render('pages/modules/show', {
		moduleInfo,
		moduleOption
	})
})

router.post('/*/exploit_now', async(req,res) => {
	const modulePath = req.params[0]
	const payload = req.body

	var textPayload = ""
	for(var prop in payload){
		if(payload[prop])
			textPayload += "set "+prop+" "+payload[prop]+"\n"
	}
	// console.log(textPayload)
	workspaceApi.runExploit(modulePath,textPayload)
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