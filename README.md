## Before

#### example.js
```javascript
for (var i = 0; i < 100; i++) console.log(i)
```

#### Oh the humanity

```shell
$ node example.js | head -1
0

node.js:201
        throw e; // process.nextTick error, or 'error' event on first tick
              ^
Error: write EPIPE
    at errnoException (net.js:670:11)
    at Object.afterWrite [as oncomplete] (net.js:503:19)
```

## After

#### example.js
```javascript
require('epipebomb')

for (var i = 0; i < 100; i++) console.log(i)
```

#### Oh the joy
```shell
$ node example.js | head -1
0
```

## Notes

Only the `EPIPE` error is captured on `process.stdout` - all other errors are thrown as per usual.