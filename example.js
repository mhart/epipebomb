// Without this line, you'll get an EPIPE error on:
// 'node example.js | head -1'
require('./epipebomb.js')()

for (var i = 0; i < 100; i++) console.log(i)
