module.exports.isAuth = (req, res, next) => {
  if(req.isAuthenticated()) return next()
  else res.redirect("/admin/login")
}

module.exports.notAuth = (req, res, next) => {
  if(req.isAuthenticated()) res.redirect("/admin")
  else next()
}