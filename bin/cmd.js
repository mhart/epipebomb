#!/usr/bin/env node

require('../register')
var spawn = require('child_process').spawn
var spawnargs = require('spawn-args')

var cmd = process.argv[2]
if (!cmd || !cmd.length) {
  throw new Error('<cmd> is a required argument')
}

var cmdParts = spawnargs(cmd, {removequotes: 'always'})
var exe = cmdParts[0]
var args = cmdParts.slice(1)

var p = spawn(exe, args)
p.stdout.pipe(process.stdout)
p.stderr.pipe(process.stderr)
