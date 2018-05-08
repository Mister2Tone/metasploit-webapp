const Router = require('express-promise-router')
const jobApi = require('../lib/jobs.js')
const db = require('../db')

const router = new Router()

router.get('/', async(req,res) => {
        await jobApi.listJobRunning()
        .then( (result) => {
            jobs =  result
            console.log(result)
        }).catch( (err) => {
            console.log(err)
        })
    res.render('pages/jobs/index', {
        jobs
    })
})

router.get('/:id/getJobInfo', async(req,res) => {
    const jobId = req.params.id
    await jobApi.getJobRunningInfo(jobId)
        .then( (result) => {
            jobInfo = result
        }).catch ( (err) => {
            console.log(err)
        })

    res.writeHead(200, {
        'Content-Type' : 'text/event-stream',
        'Cache-Control' : 'no-cache',
        'Connection' : 'keep-alive'
    })
    var data = JSON.stringify(jobInfo.datastore)
    res.write('data: ' + data + '\n\n')
})

router.get('/:id/deleteJob', async(req,res) => {
    const jobId = req.params.id
    await jobApi.stopJobRunning(jobId)
        .then( (result) => {
            console.log(result)
        }).catch( (err) => {
            console.log(err)
        })
    res.redirect('/jobs')
})

module.exports = router