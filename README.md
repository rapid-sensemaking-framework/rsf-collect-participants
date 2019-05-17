# rsf-collect-participants

`rsf-collect-participants` is part of the Rapid Sensemaking Framework ecosystem... please read
the [README of rsf-runner](https://github.com/rapid-sensemaking-framework/rsf-runner/blob/master/README.md) for the full context for what that is.

`rsf-collect-participants` is an [RSF Operator](https://github.com/rapid-sensemaking-framework/rsf-runner#rsf-operators)

Spins up a web server to collect participant configs that are rsf-contactable compatible.

## Installation

`npm install --save rsf-collect-participants`

## RSF Sequence example

The following could be used in an [RSF Sequence](https://github.com/rapid-sensemaking-framework/rsf-runner#rsf-sequences) JSON file.

```json
{
    "id": "rsf-collect-participants",
    "description": "Spins up a web server to collect participant configs that are rsf-contactable compatible",
    "language": "node",
    "contract": {
        "needs": {
            "max_participants": "number",
            "max_time": "number"
        },
        "gives": [{
            "id": "string",
            "type": "string"
        }]
    },
    "dependencies_file": {
        "dependencies": {
            "rsf-collect-participants": "0.0.1"
        }
    },
    "code_file": "require('rsf-collect-participants').main(__dirname)"
}
```

## API

___

### `main(readWriteDir)`

executes as a process until `rsfCollectParticipants` completes, at which points it writes the results to a JSON file in the given `readWriteDir` directory, and exits the process.

`readWriteDir` : `String`, the path to the directory from which to read an `input.json` file and write the `output.json` file

Expectations for `input.json`:

`input.participants_config` which it will make an `[Contactables]` using `makeContactable` from `rsf-contactable`  to pass in as `contactables` to `rsfCollectResponses`

`input.max_time`, for `maxTime` in `rsfCollectResponses`

___

### `rsfCollecParticipants(port, maxParticipants, maxTime, callback)`

How it works:

- it will set up a web server which serves a form for potential participants to register
- it will shut down the web server and stop collecting results because the `maxTime` came to pass, or
- it will shut down the web server and stop collecting results because the `maxParticipants` number has been reached

`port` : `Number`, the port on which to run the temporary webserver

`maxTime` : `Number`, the number of milliseconds to wait until stopping this process automatically

`callback` : `Function`, a callback to call with only one argument which are the results

`callback -> results` : `[{"id": "string", "type": "string"}]`, array of rsf-contactable config compatible JSON objects



## Development

Tests are written in mocha/chai/sinon and can be run using

```
npm test
```



