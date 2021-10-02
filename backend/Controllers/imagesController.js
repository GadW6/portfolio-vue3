const path = require('path')
const express = require('express')
const route = express.Router()

// ROUTING [projects, sliders, tags]
route.get('/:dynPath/:img', (req, res) => {
  const { dynPath, img } = req.params
  const PATHTOIMAGESAPI = path.join(__dirname, '..', 'public', 'images', dynPath)
  route.use(`/${dynPath}`, express.static(PATHTOIMAGESAPI))
  return res.sendFile(img, {root: PATHTOIMAGESAPI}, err => err && res.json({statusCode: err.statusCode, msg: 'No such file'}))
})

module.exports = route
