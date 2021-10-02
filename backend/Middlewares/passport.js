const Strategy = require('passport-local').Strategy
const Admin = require('../Models/Admin');
const bcrypt = require('bcryptjs')

module.exports = (passport, app) => {
  passport.use(new Strategy(
    async (username, password, done) => {
      const newAdmin = new Admin({username, password})
      try {
        const [...validUser] = await newAdmin.getUserByUsername()
        const user = validUser[0]
        if (!user) done(null, false)
        else if (bcrypt.compareSync(password, user.password)) done(null, user)
      } catch (error) {throw error}
    }))

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Admin.getUserById(id)
      return done(null, user)
    } catch (error) {throw err}
  })

  app.use(passport.initialize());
  app.use(passport.session());
}