msfapi = require('./msfrpc-connection.js');

var changeWorkspace = function(workspaceName, callback){
	msfapi.runMsfCommand('workspace '+workspaceName, function(err, result) {
		if(err){
			console.log(err);
		}
		console.log(result);
	});
}

var scanHostsWithNmap = function(targetIp, callback) {
	msfapi.runMsfCommand('db_nmap -v -sV -sS -T5 -PP -PE -PI -A '+targetIp, function(err, result){
		if(err){
			console.log(err);
		}
		console.log(result);
	})
}

var getMsfCommandDisplay = function(callback) {
	msfapi.listMsfConsole(function(err, result) {
		if (err) {
			console.log(err);
		}
		console.log(result);
		
		var consoleID = result.consoles[0].id;
		msfapi.readMsfConsole(consoleID, function(err, result) {
			if (err) {
				console.log(err);
			}
			return result;
		});

	});
}

module.exports = {
	changeWorkspace : changeWorkspace,
	scanHostsWithNmap : scanHostsWithNmap,
	getMsfCommandDisplay : getMsfCommandDisplay
}