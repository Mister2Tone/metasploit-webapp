var msfrpcConnection = require('msfrpc-client-node');

const msfrpcConfig = require('../config/msfrpc-client.json');

var msfrpcClient = new msfrpcConnection({
	user: msfrpcConfig.user,
	password: msfrpcConfig.password,
	host: msfrpcConfig.host,
	persist: msfrpcConfig.persist
});

var createMsfConsole = function(callback) {
	msfrpcClient.exec(['console.create'])
		.then(function(res) {
			callback(null, res);
		}).catch(function(err) {
			callback(err);
		});
}

var destroyMsfConsole = function(inputID, callback) {
	msfrpcClient.exec(['console.destroy', inputID])
		.then(function(res) {
			callback(null, res);
		}).catch(function(err) {
			callback(err);
		})
}

var listMsfConsole = function(callback) {
	msfrpcClient.exec(['console.list'])
		.then(function(res) {
			callback(null, res);
		}).catch(function(err) {
			callback(err);
		});
}

var writeMsfConsole = function(inputID, inputCommand, callback) {
	msfrpcClient.exec(['console.write', inputID, inputCommand])
		.then(function(res) {
			callback(null, res);
		}).catch(function(err) {
			callback(err);
		});
}

var readMsfConsole = function(inputID, callback) {
	msfrpcClient.exec(['console.read', inputID])
		.then(function(res) {
			callback(null, res);
		}).catch(function(err) {
			callback(err);
		});
}

var sessionDetachMsfConsole = function(inputID, callback) {
	msfrpcClient.exec(['console.session_detach', inputID])
		.then(function(res) {
			callback(null, res);
		}).catch(function(err) {
			callback(err);
		})
}

var sessionKillMsfConsole = function(inputID, callback) {
	msfrpcClient.exec(['console.session_kill', inputID])
		.then(function(res) {
			callback(null, res);
		}).catch(function(err) {
			callback(err);
		})
}

var tabsMsfConsole = function(inputID, inputStr, callback) {
	msfrpcClient.exec(['console.tabs', inputID, inputStr])
		.then(function(res) {
			callback(null, res);
		}).catch(function(err) {
			callback(err);
		})
}

var runMsfCommand = function(data, callback) {
	listMsfConsole(function(err, result) {
		if (err) {
			console.log(err);
		}
		console.log(result);
		data = data + '\n';

		if (result.consoles == '') {
			console.log('empty');
			createMsfConsole(function(err, result) {
				if (err) {
					console.log(err);
				}

				listMsfConsole(function(err, result) {
					if (err) {
						console.log(err);
					}

					var consoleID = result.consoles[0].id;
					writeMsfConsole(consoleID, data, function(err, result) {
						if (err) {
							console.log(err);
						}
						console.log(result);
					});
				})
			});
		}

		var consoleID = result.consoles[0].id;
		writeMsfConsole(consoleID, data, function(err, result) {
			if (err) {
				console.log(err);
			}
			console.log(result);
		});


	});
}

module.exports = {
	createMsfConsole: createMsfConsole,
	destroyMsfConsole: destroyMsfConsole,
	listMsfConsole: listMsfConsole,
	writeMsfConsole: writeMsfConsole,
	readMsfConsole: readMsfConsole,
	sessionDetachMsfConsole: sessionDetachMsfConsole,
	sessionKillMsfConsole: sessionKillMsfConsole,
	tabsMsfConsole: tabsMsfConsole,
	runMsfCommand: runMsfCommand
}