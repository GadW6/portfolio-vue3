const express = require('express')
const passport = require('passport')
const route = express.Router()
const adminController = require('../Controllers/adminController')
const { uploadProject, uploadTag } = require('../utils/upload')

// MIDDLEWARES
const {isAuth, notAuth} = require('../utils/passportChecks')
const passAuth = passport.authenticate('local', { successRedirect: '/admin', failureRedirect: '/admin/login' })

// ROUTES
// AUTH Portal
route.get('/login', notAuth, adminController.getLogin)
route.post('/login', notAuth, passAuth)

route.get('/logout', isAuth, adminController.getLogout)

// Dashboard
route.get('/', isAuth, adminController.getDashboard)

// Projects
route.get('/projects', isAuth, adminController.getProject)
route.get('/projects/add', isAuth, adminController.getProjectAdd)
route.post('/projects/add', isAuth, uploadProject, adminController.postProjectAdd)
route.get('/projects/:id/edit', isAuth, adminController.getProjectEdit)
route.post('/projects/:id/edit', isAuth, uploadProject, adminController.postProjectEdit)
route.get('/projects/:id/delete', isAuth, adminController.getProjectDelete)

// Tags
route.get('/tags', isAuth, adminController.getTags)
route.get('/tags/add', isAuth, adminController.getTagsAdd)
route.post('/tags/add', isAuth, uploadTag, adminController.postTagsAdd)
route.get('/tags/:id/delete', isAuth, adminController.getTagsDelete)

// Users
route.get('/users', isAuth, adminController.getUsers)

// Catch-all
route.all('*', (req, res) => res.redirect('/admin'))

module.exports = route