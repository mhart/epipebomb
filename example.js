// Without this line, you'll get an EPIPE error on:
// 'node example.js | head'
require('./epipebomb.js')()

;(function log() {
  console.log('tick')
  process.nextTick(log)
})()
