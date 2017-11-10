msfapi = require('./msfrpc-connection')

function listJobRunning(){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['job.list'])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function getJobRunningInfo(jobId){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['job.info', jobId])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

function stopJobRunning(jobId){
	return new Promise( (resolve,reject) => {
		msfapi.msfrpcClient.exec(['job.stop', jobId])
			.then( (res) => {
				resolve(res)
			}).catch( (err) => {
				reject(err)
			})
	})
}

// listJobRunning().then( (res) => {console.log(res)})

module.exports = {
	listJobRunning		: listJobRunning,
	getJobRunningInfo	: getJobRunningInfo,
	stopJobRunning		: stopJobRunning
}