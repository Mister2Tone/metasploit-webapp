var express = require('express');
var router = express.Router();
var msfapi = require('../lib/workspaces.js');

router.get('/', function(req, res, next) {
	console.log('1');
	// msfapi.metasploitVersion( function(err, result){
	// 	if(err){
	// 		console.log("route err :"+err);
	// 	}
	// 	res.send(result);
	// });
});

module.exports = router;
