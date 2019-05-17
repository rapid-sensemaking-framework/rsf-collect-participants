const http = require('http')
const express = require('express')
const { readInput, writeOutput } = require('rsf-reader-writer')

const validInput = (input) => {
    if (!input.type || !input.id) {
        return false
    }
    return true
}

const rsfCollectParticipants = (port, maxParticipants, maxTime, callback) => {
    // array to store the results
    const results = []
    const app = express()
    app.use(express.urlencoded({ extended: true }))
    const server = http.createServer(app).listen(port, () => {
        console.log('starting http server to listen for new participants on port ' + port)
    })

    // stop the process after a maximum amount of time
    const timeoutId = setTimeout(() => {
        // complete, saving whatever results we have
        complete()
    }, maxTime)

    // setup a completion handler that
    // can only fire once
    let calledComplete = false
    const complete = () => {
        if (!calledComplete) {
            server.close()
            clearTimeout(timeoutId)
            callback(results)
            calledComplete = true
        }
    }

    app.get('/register', (req, res) => {
        res.sendFile(__dirname + '/register.html')
    })
    
    // setup web server... collect participant configs
    app.post('/new-participant', (req, res) => {
        console.log('woohoo', req.body)
        const input = req.body
        
        if (!validInput(input)) {
            res.redirect('/register?failure')
            return
        }

        res.redirect('/register?success')
        results.push({
            id: input.id,
            type: input.type,
            name: input.name
        })
        if (results.length === maxParticipants) {
            complete()
        }
    })
}
module.exports.rsfCollectParticipants = rsfCollectParticipants

// this is the function that folks who import this module for use as an RSF Operator
// will simply call
module.exports.main = (dir) => {
    const input = readInput(dir)

    const PORT = process.env.COLLECT_PARTICIPANTS_SERVER_PORT || 3001
    const MAX_PARTICIPANTS = input.max_participants
    const MAX_TIME = input.max_time // TODO: set a default?

    rsfCollectParticipants(PORT, MAX_PARTICIPANTS, MAX_TIME, results => {
        // this save the output to a file
        writeOutput(dir, results)
        // this exits the process with 'success' status
        // use exit code 1 to show error
        process.exit()
    })
}