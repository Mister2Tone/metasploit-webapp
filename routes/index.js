// var express = require('express');
// var router = express.Router();
const Router = require('express-promise-router')

const db = require('../db')

const router = new Router()

router.get('/', async(req,res) => {
	const { rows } = await db.query('SELECT * FROM workspaces')
	res.render('index', {
		workspaces:rows
	})
})

module.exports = router;
