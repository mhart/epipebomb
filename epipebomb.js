module.exports = epipeBomb

function epipeBomb(stream, callback) {
  if (stream == null) stream = process.stdout
  if (callback == null) callback = process.exit

  function epipeFilter(err) {
    if (err.code === 'EPIPE') return callback()

    // If there's more than one error handler (ie, us),
    // then the error won't be bubbled up anyway
    if (stream.listeners('error').length <= 1) {
      stream.removeAllListeners()     // Pretend we were never here
      stream.emit('error', err)       // Then emit as if we were never here
      stream.on('error', epipeFilter) // Then reattach, ready for the next error!
    }
  }

  stream.on('error', epipeFilter)
}

