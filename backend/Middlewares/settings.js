const expressSession = require('express-session')
const bodyParser = require('body-parser')
const corsSettings = require('cors')
 
// create application/json parser
const jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: true })

// implement express-session (Cookies)
const session = expressSession({ secret: 'keyboard cat', resave: false, saveUninitialized: false })

// Implement CORS
const cors = corsSettings({origin: ['https://portfolio.itcloudpro.com', 'http://localhost:8080']})

module.exports = {
  parser: {
    jsonParser,
    urlencodedParser
  },
  session,
  cors
}