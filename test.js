const { expect } = require('chai')
const { spawn } = require('child_process')
const sinon = require('sinon')
const https = require('https')
const { rsfCollectParticipants } = require('./index')

describe('#rsfCollectParticipants', () => {
    context('when timeout is reached, regardless if nothing has happened', function () {
        it('should early exit and return 0 results', done => {
            const port = 3001
            const maxParticipants = 3
            const maxTime = 1000 // milliseconds
            rsfCollectParticipants(port, maxParticipants, maxTime, results => {
                expect(results.length).to.equal(0)
                done()
            })
        })
    })

    context('when new participants are posted', function () {
        it('should return those participants in the results', (done) => {
            const port = 3001
            const maxParticipants = 2
            const maxTime = 1000 // milliseconds
            rsfCollectParticipants(port, maxParticipants, maxTime, results => {
                expect(results.length).to.equal(2)

                // when using testing asynchronously,
                // be sure to call `done` when done
                done()
            })
            const testdata = [
                {
                    id: "x",
                    type: "y"
                },
                {
                    id: "a",
                    type: "b"
                }
            ]
        })
    })
})