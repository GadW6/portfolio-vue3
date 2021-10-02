const moment = require('moment')
const slugify = require('slugify')
const validator = require('validator')
const { sharpHelper } = require('../utils/upload')
const Project = require('../Models/Project')

module.exports.newProjectHelper = (body) => {
  const { title, description, image, tags, createdAt, updatedAt, fullDescription, linkSite, linkGit, techUsedDesc, conclusion, sliderImages } = body

  return new Project({
    title,
    description,
    slug: slugify((title || ''), {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true
    }),
    image: (image || 'default_img.jpeg'),
    tags,
    createdAt: (createdAt) ? moment(createdAt).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: (updatedAt) ? moment(updatedAt).format('YYYY-MM-DD HH:mm:ss') : moment().format('YYYY-MM-DD HH:mm:ss'),
    fullDescription,
    linkSite,
    linkGit,
    techUsedDesc,
    conclusion,
    sliderImages
  })
}

module.exports.validatorHelper = (body) => {
  const errThrow = { code: 'ER_VALIDATION', invalidField: undefined }
  for (const [key, value] of Object.entries(body)) {
    switch (key) {
      case 'title': case 'fullDescription':
        errThrow.invalidField = key
        if(!value || validator.isEmpty(value, { ignore_whitespace: true })) throw errThrow
        else break
      case 'tags':
        errThrow.invalidField = key
        if(value.length === 0) throw errThrow
        else if (value.length > 0) {
          value.forEach(tag => {
            if (!tag.name || validator.isEmpty(tag.name, { ignore_whitespace: true }) || !tag.image || validator.isEmpty(tag.image, { ignore_whitespace: true })) throw errThrow
          })
          break
        }
        else break
      case 'linkSite': case 'linkGit':
        errThrow.invalidField = key
        if(!value || !validator.isURL(value, {require_protocol: true})) throw errThrow
        else break
      case 'sliderImages':
        errThrow.invalidField = key
        if(value.length === 0) throw errThrow
        else if (value.length > 0){
          value.forEach(img => {
            if(!img || validator.isEmpty(img, { ignore_whitespace: true })) throw errThrow
          })
          break
        }
        else break
    }
  }
}

module.exports.errorHandler = (error, friendly) => {
  return {
    success: false,
    duplicate: (error.code === 'ER_DUP_ENTRY') ? true : false,
    emptyField: (error.code === 'ER_BAD_NULL_ERROR') ? true : false,
    fieldValidation: (error.code === 'ER_VALIDATION') ? true : false,
    invalidField: error.invalidField,
    msg: `An error occurred : ${error}`,
    friendly
  }
}

const imageBufferValidatorAndUploaderToDestination = (imagesArr, destination) => {
  const arr = []
  imagesArr.forEach(bufferObject => {
    const { originalname, mimetype, buffer } = bufferObject
    const type = mimetype.split('/')[1]
    const fileName = Date.now() + '*_*' + originalname
    if (type === 'jpeg' || type === 'png') {
      sharpHelper(buffer, type, destination, fileName)
      return arr.push({success: true, fileName, destination})
    } else {
      return arr.push({success: false, fileName, destination})
    }
  })
  return arr
}

const isContainFilesAndTags = (files, tags) => {
  return (
        files &&
        tags &&
        Object.keys(files).length > 0 &&
        //  (files.image && files.image.length > 0) &&
        (files.sliderImages && files.sliderImages.length > 0) &&
        tags.length > 0) ? true : false
}

const fileUploader = async (files, choice) => {
  switch (choice) {
    case 'image':
      const imageResponse = await imageBufferValidatorAndUploaderToDestination(files.image, 'projects')
      return imageResponse.map(el => el.fileName)[0]   
    case 'sliders':
      const slidersResponse = await imageBufferValidatorAndUploaderToDestination(files.sliderImages, 'sliders')
      return slidersResponse.map(el => el.fileName)
  }
}

module.exports.uploadFiles = async (req, action) => {
  switch (action) {
    case 'add':
      if (isContainFilesAndTags(req.files, req.body.tags)) {
        if(req.files.image) req.body.image = await fileUploader(req.files, 'image')
        req.body.sliderImages = await fileUploader(req.files, 'sliders')
      }
      break;
  
    case 'edit':
      const newProject = new Project({})
      const imageResponse = await newProject.getOneProjectById(req.params.id)
      req.local = {}
      req.body.image = req.local.image = imageResponse[0].image
      
      if(Object.keys(req.files).length > 0 && req.files.image) req.body.image = await fileUploader(req.files, 'image')
      if(Object.keys(req.files).length > 0 && req.files.sliderImages) req.body.sliderImages = await fileUploader(req.files, 'sliders')
      else req.body.sliderImages = []

      req.body.sliderImagesToFlatten = JSON.parse(req.body.sliderImagesToFlatten)
      req.body.sliderImages.push(req.body.sliderImagesToFlatten)
      req.body.sliderImages = req.body.sliderImages.flat()
      break;
    }
  req.body.tags = JSON.parse(req.body.tags)
  return req.body
}