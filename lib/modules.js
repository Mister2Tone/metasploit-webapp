msfapi = require('./msfrpc-connection');

function getExploitModules(){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['module.exploits'])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function getAuxiliaryModules(){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['module.auxiliary'])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function getPostModules(){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['module.post'])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function getPayloadModules(){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['module.payloads'])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function getEncoderModules(){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['module.encoders'])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function getNopModules(){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['module.nops'])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function getModuleInfo(moduleType, moduleName){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['module.info', moduleType, moduleName])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function getModuleOption(moduleType, moduleName){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['module.options', moduleType, moduleName])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function getCompatiblePayloadModule(moduleName){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['module.compatible_payloads',moduleName])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function executeModule(moduleType, moduleName, Datastore){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['module.execute', moduleType, moduleName, Datastore])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

module.exports = {
	getExploitModules 	: getExploitModules,
	getAuxiliaryModules	: getAuxiliaryModules,
	getPostModules		: getPostModules,
	getPayloadModules	: getPayloadModules,
	getEncoderModules 	: getEncoderModules,
	getNopModules		: getNopModules,
	getModuleInfo		: getModuleInfo,
	getModuleOption		: getModuleOption,
	getCompatiblePayloadModule : getCompatiblePayloadModule,
	executeModule		: executeModule
}