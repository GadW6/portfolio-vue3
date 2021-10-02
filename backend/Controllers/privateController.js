const { newProjectHelper, validatorHelper, errorHandler } = require('../utils/projectHelper')

module.exports.createProject = async (req, res) => {
  try {
    validatorHelper(req.body)
    const newProject = newProjectHelper(req.body)
    await newProject.insertProjectWithTags()
    return res.status(201).json({
      msg: 'Project added',
      title: req.body.title
    })
  } catch (error) {
    return res.status(400).json(errorHandler(error, 'There was an error adding a project'))
  }
}

module.exports.createTags = async (req, res) => {
  try {
    validatorHelper(req.body)
    const newProject = newProjectHelper(req.body)
    await newProject.insertManyTags()
    return res.status(201).json({
      msg: 'Tags added',
      body: req.body
    })
  } catch (error) {
    return res.status(400).json(errorHandler(error, 'There was an error adding a tag'))
  }
}
