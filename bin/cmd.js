#!/usr/bin/env node

var spawn = require('child_process').spawn
var args = ['-r', require.resolve('../register')].concat(process.argv.slice(2))
spawn('node', args, {stdio: 'inherit'})
