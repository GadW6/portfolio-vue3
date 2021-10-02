// const path = require('path')
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')

const storageTag = multer.diskStorage({
  destination (req, file, cb) {
    return cb(null, path.join(__dirname, '..', 'public', 'images', 'tags'))
  },
  filename (req, file, cb) {
    req.body.image = file.originalname
    return cb(null, file.originalname)
  }
})

const storageProject = multer.memoryStorage()

module.exports.uploadProject = multer({ storage: storageProject }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'sliderImages' }
])

module.exports.sharpHelper = (buffer, type, destination, fileName) => {
  return sharp(buffer)[type]({ quality: 20 }).resize({fit: sharp.fit.outside}).toFile(path.join(__dirname, '..', 'public', 'images', destination, fileName))
}

module.exports.uploadTag = multer({ storage: storageTag }).single('image')