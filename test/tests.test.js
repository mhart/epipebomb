var test = require('tape')
var spawn = require('pty.js').spawn
var count = require('underscore.string').count

var code = "setInterval(function() { console.log('tick') })"

test('node complains when piped to a stream that ends early', function (t) {
  t.plan(2)
  var term = spawn('bash')
  var allData = ''
  term.on('data', function (data) { allData += data })
  term.on('close', function () {
    t.true(count(allData, 'tick') >= 10, '"tick" was output at least 10 times')
    if (/EPIPE/g.test(allData)) {
      term.kill()
      t.pass('node threw EPIPE when `head` ended')
    }
  })
  term.write(`node -e "${code}" | head; exit\r`)
})

test('"node -r epipebomb/register" suppresses EPIPE', function (t) {
  t.plan(2)
  var term = spawn('bash')
  var allData = ''
  term.on('data', function (data) { allData += data })
  term.on('close', function () {
    t.true(count(allData, 'tick') >= 10, '"tick" was output at least 10 times')
    if (/EPIPE/g.test(allData)) {
      term.kill()
      t.fail('node threw EPIPE when `head` ended')
    } else {
      t.pass('EPIPE error was suppressed')
    }
  })
  term.write(`node -e "${code}" -r ../register | head; exit\r`)
})
