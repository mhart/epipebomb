# EPIPE Bomb

By default, node throws `EPIPE` errors if `process.stdout` is being written to and
a user runs it through a pipe that gets closed while the process is still outputting
(eg, the simple case of piping a node app through `head`).

This seemed a little overzealous to me, so I wrote this to suppress such errors.

## Before

#### example.js
```javascript
;(function log() {
  console.log('tick')
  process.nextTick(log)
})()
```

#### Oh the humanity

```shell
$ node example.js | head
tick
tick
tick
tick
tick
tick
tick
tick
tick
tick

events.js:66
        throw arguments[1]; // Unhandled 'error' event
                       ^
Error: write EPIPE
    at errnoException (net.js:782:11)
    at Object.afterWrite (net.js:600:19)
```

## After

#### example.js
```javascript
require('epipebomb')()

;(function log() {
  console.log('tick')
  process.nextTick(log)
})()
```

#### Oh the joy!
```shell
$ node example.js | head
tick
tick
tick
tick
tick
tick
tick
tick
tick
tick
```

## Notes

Only the `EPIPE` error is captured on `process.stdout` - all other errors are thrown as per usual.
