const fs = require('fs')
const path = require('path')
// const bcrypt = require('bcryptjs')
require('dotenv').config()

const Admin = require('../Models/Admin')
const Project = require('../Models/Project')
const { 
  newProjectHelper, 
  validatorHelper, 
  errorHandler, 
  uploadFiles,
} = require('../utils/projectHelper')
const logs = require('../utils/logReader')

// AUTH
module.exports.getLogin = (req, res) => {
  return res.render('components/login', {
    path: 'login',
    hasJsFile: false
  })
}

module.exports.postLogin = (req, res) => {
  return res.redirect('/admin')
}

module.exports.getLogout = (req, res) => {
  req.logout();
  return res.redirect('/admin/login');
}

// DASHBOARD
module.exports.getDashboard = async (req, res) => {
  const newUsers = new Admin({})
  const newProject = new Project({})

  return res.render('master', {
    path: 'dashboard',
    hasJsFile: false,
    users: await newUsers.getUsers(),
    projects: await newProject.getAllProjectDetails(),
    tags: await newProject.getTags(),
    latestLogs: await logs.logsObjectArray(logs.raw(50)),
    objectLogs: await logs.logsObjectArray(logs.filteredLogsApi(50))

    // page: await bcrypt.hash('password', 10),
    // compare: await bcrypt.compare('hash', '$2a$10$6oGJQVUuMHOLdgN5R/h9VOHfDrf3vy3NRHPMfEQqiNAsgE2E1hoQu')
  })
}

// PROJECT
const renderGetProject = async (req, res, errorMsg = null) => {
  const newProject = new Project({})
  return res.render('master', {
    path: 'projects',
    hasJsFile: false,
    projects: await newProject.getAllProjectDetails(),
    frontURL: process.env.FRONT_URL,
    errorMsg
  })
}

module.exports.getProject = (req, res) => {
  renderGetProject(req, res)
}

module.exports.getProjectAdd = async (req, res) => {
  const newProject = new Project({})
  const tags = await newProject.getTags()
  return res.render('master', {
    path: 'projects-add',
    hasJsFile: true,
    tags
    // prepopulate: (req.session.locals) ? (req.session.locals.prepopulate && req.session.locals.prepopulate) : {}
  })
}

module.exports.postProjectAdd = async (req, res) => {
  
  const errorMsg = {}
  try {
    req.body = await uploadFiles(req, 'add')
    validatorHelper(req.body)
    const newProject = newProjectHelper(req.body)
    await newProject.insertProjectWithTags()
    errorMsg.color = "success"
    errorMsg.msg = "The project was added successfully !"
  } catch (error) {
    errorMsg.color = "danger"
    errorMsg.msg = "Failed adding the project !"
    if(req.body.image) fs.unlink(path.join(__dirname, '..', 'public', 'images', 'projects', req.body.image), () => {})
    if(req.body.sliderImages && req.body.sliderImages.length > 0) req.body.sliderImages.forEach(img => fs.unlink(path.join(__dirname, '..', 'public', 'images', 'sliders', img), () => {}))
  } finally {
    return renderGetProject(req, res, errorMsg)
  }
}

module.exports.getProjectEdit = async (req, res) => {
  const newProject = new Project({})
  const oneProjectResponse = await newProject.getOneDetailsNestedTagsById(req.params.id)
  const oneFullProjectResponse = await newProject.getOneFullProjectByProjectId(req.params.id)
  const sliderImages = await newProject.getOneProjectSliderImagesById(req.params.id)
  const tags = await newProject.getTags()

  return res.render('master', {
    path: 'projects-edit',
    hasJsFile: true,
    tags,
    project: {
      ...oneProjectResponse[0],
      ...oneFullProjectResponse[0],
      sliderImages
    }
    // prepopulate: (req.session.locals) ? (req.session.locals.prepopulate && req.session.locals.prepopulate) : {}
  })
}

module.exports.postProjectEdit = async (req, res) => {

  const errorMsg = {}
  try {
    req.body = await uploadFiles(req, 'edit')
    validatorHelper(req.body)
    const newProject = newProjectHelper(req.body)
    await newProject.updateOneProjectById(req.params.id)
    if(Object.keys(req.files).length > 0 && req.files.image) fs.unlink(path.join(__dirname, '..', 'public', 'images', 'projects', req.local.image), () => {})
    errorMsg.color = "success"
    errorMsg.msg = "The project was modified successfully !"
  } catch (error) {
    errorMsg.color = "danger"
    errorMsg.msg = "Failed modifying the project !"
    if(Object.keys(req.files).length > 0 && req.files.image) fs.unlink(path.join(__dirname, '..', 'public', 'images', 'projects', req.body.image), () => {})
    if(Object.keys(req.files).length > 0 && req.files.sliderImages) req.body.sliderImages.forEach(img => {
        fs.unlink(path.join(__dirname, '..', 'public', 'images', 'sliders', img), () => {})
      })
  } finally {
    return renderGetProject(req, res, errorMsg)
  }
}

module.exports.getProjectDelete = async (req, res) => {
  const newProject = new Project({})
  const imageResponse = await newProject.getOneProjectById(req.params.id)
  const slidersResponse = await newProject.getOneProjectSliderImagesById(req.params.id)
  const successDelete = await newProject.deleteOneProjectById(req.params.id)
  if (successDelete > 0) {
    if (imageResponse[0].image !== 'default_img.jpeg') fs.unlink(path.join(__dirname, '..', 'public', 'images', 'projects', imageResponse[0].image), () => {})
    slidersResponse.forEach(slider => {
      fs.unlink(path.join(__dirname, '..', 'public', 'images', 'sliders', slider.image), () => {})
    })
    return renderGetProject(req, res, {color: 'success', msg: 'Project removed successfully'})
  } else {
    return renderGetProject(req, res, {color: 'danger', msg: 'Failed removing project !'})
  }
}

// USERS
module.exports.getUsers = async (req, res) => {
  const newUser = new Admin({})
  return res.render('master', {
    path: 'users',
    hasJsFile: false,
    users: await newUser.getUsers(),
    errorMsg: null
  })
}

// TAGS 
const renderTags = async (req, res, errorMsg = null) => {
  const newProject = new Project({})
  return res.render('master', {
    path: 'tags',
    hasJsFile: false,
    tags: await newProject.getTags(),
    errorMsg
  })
}

module.exports.getTags = (req, res) => {
  renderTags(req, res)
}

module.exports.getTagsAdd = (req, res) => {
  return res.render('master', {
    path: 'tags-add',
    hasJsFile: false
  })
}

module.exports.postTagsAdd = async (req, res) => {
  const { name, image } = req.body
  if (!name) {
    fs.unlink(path.join(__dirname, '..', 'public', 'images', 'tags', image), () => {})
    return renderTags(req, res, {
      color: 'danger',
      msg: 'Failed uploading Tag. Must fill out all fields properly !'
    })
  } else {
    const newProject = new Project({})
    await newProject.insertOneTag(name, image)
    return renderTags(req, res, {
      color: 'success',
      msg: 'The tag was added successfully !'
    })
  }
}

module.exports.getTagsDelete = async (req, res) => {
  const newProject = new Project({})
  const tag = await newProject.getOneTagById(req.params.id)
  await newProject.deleteOneTagById(req.params.id)
  fs.unlink(path.join(__dirname, '..', 'public', 'images', 'tags', tag[0].image), () => {})
  return renderTags(req, res, {
    color: 'success',
    msg: 'The tag was removed successfully !'
  })
}