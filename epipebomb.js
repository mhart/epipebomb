module.exports = epipeFilter

function epipeFilter(err) {
  if (err.code === 'EPIPE') return process.exit()

  // If there's more than one error handler (ie, us),
  // then the error won't be bubbled up anyway
  if (process.stdout.listeners('error').length <= 1) {
    process.stdout.removeAllListeners()     // Pretend we were never here
    process.stdout.emit('error', err)       // Then emit as if we were never here
    process.stdout.on('error', epipeFilter) // Then reattach, ready for the next error!
  }
}

process.stdout.on('error', epipeFilter)
