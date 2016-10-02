var test = require('tape')
var spawn = require('pty.js').spawn

const code = "setInterval(function() { console.log('tick') })"

test('node complains when piped to a stream that ends early', function (t) {
  t.plan(1)
  var term = spawn('bash')
  term.on('data', function (data) {
    if (/EPIPE/g.test(data)) {
      term.kill()
      t.pass('node threw EPIPE when `head` ended')
    }
  })
  term.write(`node -e "${code}" | head\r`)
})

test('"node -r epipebomb/register" suppresses EPIPE', function (t) {
  t.plan(1)
  var term = spawn('bash')
  var ended = false
  term.on('data', function (data) {
    if (/EPIPE/g.test(data)) {
      ended = true
      term.kill()
      t.fail('node threw EPIPE when `head` ended')
    }
  })
  setTimeout(function() {
    if (!ended) {
      term.kill()
      t.pass('EPIPE error was suppressed')
    }
  }, 1000)
  term.write(`node -e "${code}" -r epipebomb/register | head\r`)
})
