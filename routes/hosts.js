const Router = require('express-promise-router')
// const msfapi = require('../lib/workspaces.js')
const db = require('../db')

const router = new Router()

router.get('/test', async(req,res) =>{
	res.send('test hosts router')
})

module.exports = router