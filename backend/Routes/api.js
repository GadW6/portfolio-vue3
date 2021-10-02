const express = require('express')
const route = express.Router()
const publicController = require('../Controllers/publicController')
// const privateController = require('../Controllers/privateController')
const imagesController = require('../Controllers/imagesController')
// const { parser } = require('../Middlewares/settings')

// IMAGES
route.use('/images', imagesController)

// DISPLAY
route.get('/display', publicController.getDisplay)
// TAGS
route.get('/tags', publicController.getTags)
// PROJECTS
route.get('/projects', publicController.getProject)
route.get('/projects/:pick', publicController.getProjectByPick)

module.exports = route


/////////////////////////////////
/////// JWT NOT YET IMPLEMENTED
/////////////////////////////////

// route.post('/tags', privateController.createTags)
// route.post('/tags/:tag', privateController.createTag)
// route.post('/projects', parser.jsonParser, privateController.createProject)