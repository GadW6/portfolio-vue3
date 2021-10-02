// CALLING MODELS
const Display = require('../Models/Display')
const Project = require('../Models/Project')
// const knex = require('../Models/config')

// Manipulation Area
// const newProject = new Project({
//   title: 'Project3',
//   description: null,
//   tags: ['CSS', 'LESS']
// })
// newProject.insertProjectWithTags().then(res => {
//   console.log(res);
// })

// ROUTES

module.exports.getDisplay = async (req, res) => {
  const newDisplay = new Display()
  return res.json(await newDisplay.getCatNestedSkills())
}

module.exports.getTags = async (req, res) => {
  const newProject = new Project({})
  return res.json(await newProject.getTags())
}

module.exports.getProject = async (req, res) => {
  const newProject = new Project({})
  return res.json(await newProject.getDetailsNestedTags())
}

module.exports.getProjectByPick = async (req, res) => {
  const newProject = new Project({})
  const rawInput = req.params.pick
  const input = parseInt(rawInput).toString()

  switch (input === 'NaN' || input.length !== rawInput.length) {
    case true:
      const answerProjectBySlug = await newProject.getOneProjectBySlug(rawInput)
      if (answerProjectBySlug.length) {
        return res.json({
          ...answerProjectBySlug[0],
          techUsedImages: [...await newProject.getAllTagsFromProject(answerProjectBySlug[0].id)], 
          sliderImages: [...await newProject.getOneProjectSliderImagesById(answerProjectBySlug[0].id)]
        })
      } else {
        return res.status(400).json({status: 400, msg: 'Ooops! No Such project were found...'})
      }
    case false: 
      const answerProjectById = await newProject.getOneProjectById(rawInput)
      return (answerProjectById.length) ? res.json(answerProjectById) : res.status(400).json({msg: 'Ooops! No Such project were found...'})
  }
}