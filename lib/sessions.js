msfapi = require('./msfrpc-connection')

function listSessionActive(){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['session.list'])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function stopSessionActive(sessionId){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['session.stop', sessionId])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function readShellSession(sessionId){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['session.shell_read', sessionId])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function writeShellSession(sessionId, data){
	data = data + '\n'
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['session.shell_write', sessionId, data])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function writeMeterpreterConsole(sessionId, data){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['session.meterpreter_write', sessionId, data])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function readMeterpreterConsole(sessionId){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['session.meterpreter_read', sessionId])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function detachMeterpreterSession(sessionId){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['session.meterpreter_session_detach', sessionId])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function killMeterpreterSession(sessionId){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['session.meterpreter_session_kill', sessionId])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function getCompatibleSessionModule(sessionId){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['session.compatible_modules', sessionId])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function clearRingBufferSession(sessionId){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['session.ring_clear', sessionId])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

// listSessionActive().then( (res) => {console.log(res)})

module.exports = {
	listSessionActive		: listSessionActive,
	stopSessionActive		: stopSessionActive,
	readShellSession		: readShellSession,
	writeShellSession		: writeShellSession,
	writeMeterpreterConsole : writeMeterpreterConsole,
	readMeterpreterConsole 	: readMeterpreterConsole,
	detachMeterpreterSession: detachMeterpreterSession,
	killMeterpreterSession	: killMeterpreterSession,
	getCompatibleSessionModule: getCompatibleSessionModule,
	clearRingBufferSession	: clearRingBufferSession
}