const expres = require('express')
const router = expres.Router()
const path = require('path')
const rfs = require('rotating-file-stream')
const morgan = require('morgan')

// Setting UP LOGGER (Morgan)
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, '..', 'log')
})

router.use(morgan('short', {
  stream: accessLogStream
}))

module.exports = router