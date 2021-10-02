const path = require('path')
const express = require('express')
const app = express()
const passport = require('passport')
const apiRoute = require('./Routes/api')
const adminRoute = require('./Routes/admin')
const { session, cors, parser } = require('./Middlewares/settings')

// CORS MIDDLEWARE
app.use(cors)

// LOGGER
app.use(require('./utils/logger'))

// API ROUTES 
app.use('/v1', apiRoute)

// ADMIN ROUTES
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/admin', parser.urlencodedParser)
app.use('/admin', session);
require('./Middlewares/passport')(passport, app)
app.use('/admin', adminRoute)
app.use(express.static(path.join(__dirname, 'public')));
app.all('*', (req, res) => {res.redirect('/admin')})

const PORT = 3000
app.listen(PORT, () => {
	console.log('Server running on port ' + PORT)
})
