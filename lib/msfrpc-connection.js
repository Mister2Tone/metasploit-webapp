var msfrpcConnection = require('msfrpc-client-node')

const msfrpcConfig = require('../config/msfrpc-client.json')

var msfrpcClient = new msfrpcConnection({
	user: msfrpcConfig.user,
	password: msfrpcConfig.password,
	host: msfrpcConfig.host,
	persist: msfrpcConfig.persist
});

function createMsfConsole() {
	return new Promise( (resolve,reject) => {
		msfrpcClient.exec(['console.create'])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			});
	})
}

function destroyMsfConsole(inputID) {
	return new Promise( (resolve,reject) => {
		msfrpcClient.exec(['console.destroy', inputID])
		.then( (res) => {
			resolve(res)
		}).catch( (err) => {
			reject(err)
		})
	})
}

function listMsfConsole(){
	return new Promise( (resolve,reject) =>
		msfrpcClient.exec(['console.list'])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	)
}

function writeMsfConsole(inputID, inputCommand) {
	return new Promise( (resolve, reject) => {
		msfrpcClient.exec(['console.write', inputID, inputCommand])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			});
	})
}

function readMsfConsole(inputID) {
	return new Promise( (resolve, reject) => {
		msfrpcClient.exec(['console.read', inputID])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			});
	})
}

function sessionDetachMsfConsole(inputID) {
	return new Promise( (resolve, reject) => {
		msfrpcClient.exec(['console.session_detach', inputID])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function sessionKillMsfConsole(inputID) {
	return new Promise( (resolve, reject) => {
		msfrpcClient.exec(['console.session_kill', inputID])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function tabsMsfConsole(inputID, inputStr) {
	return new Promise( (resolve,reject) => {
		msfrpcClient.exec(['console.tabs', inputID, inputStr])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function runMsfCommand(data) {
	return new Promise( (resolve, reject) => {
		let consoleId 
		data = data + '\n'
		listMsfConsole().then( (result) => {
			const consoles = result.consoles
			if(consoles == ""){
				createMsfConsole()
				listMsfConsole().then( (result) => {
					console.log("new console: ",result)
					consoleId = result.consoles[0].id
				})
			}
			else{
				console.log("exist: ",consoles);
				consoleId = consoles[0].id
			}
			//console.log("consoleId: ",consoleId);

			writeMsfConsole(consoleId, data).then( (result) => {
				console.log("write: ",result)
			}).catch( (err) => {
				console.log(err)
			})

		}).catch( (err) => {
			console.log(err)
		})

	})
}

function initMsfConsole() {
	return new Promise( (resolve,reject) => {
		listMsfConsole().then( (result) => {
			const consoles = result.consoles
			if(consoles == ""){
				createMsfConsole().then( (result) => {
					resolve(result)
				}).catch( (err) => {
					reject(err)
				})
			}
			else{
				console.log("console exist");
			}
		}).catch( (err) => {
			console.log(err)
		})
	})
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
	runMsfCommand: runMsfCommand,
	initMsfConsole: initMsfConsole,
	msfrpcClient: msfrpcClient
}