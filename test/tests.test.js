var test = require('tape')
var spawn = require('pty.js').spawn
var path = require('path')

var epbCmdPath = path.join(__dirname, '../bin/cmd.js')
var code = "setInterval(function() { console.log('tick') })"

function verifyTick(t, data) {
  var result = /(tick\s+){10}/.test(data)
  t.true(result, '"tick" was output at least 10 times')
  if (!result) { console.log(data) }
}

test('node complains when piped to a stream that ends early', function(t) {
  t.plan(2)
  var term = spawn('bash')
  var allData = ''
  term.on('data', function(data) { allData += data })
  term.on('close', function() {
    verifyTick(t, allData)
    if (/EPIPE/g.test(allData)) {
      t.pass('node threw EPIPE when `head` ended')
    }
  })
  term.write('node -e "' + code + '" | head; exit\r')
})

test('"node -r epipebomb/register" suppresses EPIPE', function(t) {
  t.plan(2)
  var term = spawn('bash')
  var allData = ''
  term.on('data', function(data) { allData += data })
  term.on('close', function() {
    verifyTick(t, allData)
    if (/EPIPE/g.test(allData)) {
      t.fail('node threw EPIPE when `head` ended')
    } else {
      t.pass('EPIPE error was suppressed')
    }
  })
  term.write('node -e "' + code + '" -r ../register | head; exit\r')
})

test('cmd epipebomb runs given command', function(t) {
  t.plan(1)
  var term = spawn('bash')
  var allData = ''
  term.on('data', function(data) { allData += data })
  term.on('close', function() {
    verifyTick(t, allData)
  })
  term.write(epbCmdPath + ' -e "' + code + '" | head; exit\r')
})

test('cmd epipebomb suppresses EPIPE', function(t) {
  t.plan(2)
  var term = spawn('bash')
  var allData = ''
  term.on('data', function(data) { allData += data })
  term.on('close', function() {
    verifyTick(t, allData)
    if (/EPIPE/g.test(allData)) {
      t.fail('node threw EPIPE when `head` ended')
    } else {
      t.pass('EPIPE error was suppressed')
    }
  })
  term.write(epbCmdPath + ' -e "' + code + '" | head; exit\r')
})
