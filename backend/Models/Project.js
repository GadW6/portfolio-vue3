const fs = require ('fs')
const path = require('path')
const knex = require('../Models/config')

class Project {
  constructor({...options}){
    this.title = options.title
    this.description = options.description
    this.slug = options.slug
    this.image = options.image
    this.tags = options.tags
    this.createdAt = options.createdAt
    this.updatedAt = options.updatedAt
    this.fullDescription = options.fullDescription
    this.linkSite = options.linkSite
    this.linkGit = options.linkGit
    this.techUsedDesc = options.techUsedDesc
    this.sliderImages = options.sliderImages
    this.conclusion = options.conclusion
  }

  ////////////////////////////
  /////////  GET / SHOW
  ////////////////////////////

  // Project
  getAllProjectDetails(){
    return knex.select().from('ProjectDetails').orderBy('createdAt', 'desc')
  }
  
  async getAllTagsFromProject(detailId){
    const tags = await this.getTags()
    const rels = await this.getDetailsToTagsAssoc()
    return tags.filter(tag => {
      return rels.find(rel => {
        return rel.TagsId === tag.id && rel.DetailsId === detailId
      })
    })
  }
  
  getOneProjectSliderImagesById(id){
    return knex.select().from('ProjectSliderImages').where('projectId', '=', id)
  }

  getOneProjectById(id){
    return knex.select().from('ProjectDetails').where('id', '=', id)
  }
  
  getOneProjectBySlug(slugName){
    return  knex.select('ProjectDetails.*', 'ProjectFullDetails.fullDescription', 'ProjectFullDetails.linkSite', 'ProjectFullDetails.linkGit', 'ProjectFullDetails.techUsedDesc', 'ProjectFullDetails.conclusion').from('ProjectDetails').join('ProjectFullDetails', 'ProjectDetails.id', '=', 'ProjectFullDetails.projectId').where('ProjectDetails.slug', '=', slugName)
  }

  getOneFullProjectByProjectId(id){
    return knex.select().from('ProjectFullDetails').where('projectId', '=', id)
  }
  
  // Tags
  getOneTagByName(tagName){
    return knex.select().from('ProjectTags').where('name', '=', tagName)
  }
  
  getOneTagById(id){
    return knex.select().from('ProjectTags').where('id', '=', id)
  }

  getTags(){
    return knex.select().from('ProjectTags').orderBy('name')
  }

  
  // Assoc
  getDetailsToTagsAssoc(){
    return knex.select().from('ProjectAssocDetailTags')
  }

  async getOneDetailsNestedTagsById(id){
    const details = await this.getOneProjectById(id)
    const tags = await this.getTags()
    const rels = await this.getDetailsToTagsAssoc()
    
    return details.map(detail => {
      const tagsFiltered = tags.filter(tag => {
        return rels.find(rel => {
          return rel.TagsId === tag.id && rel.DetailsId === detail.id
        })
      })
      
      return {
        ...detail,
        tags: [...tagsFiltered]
      }
    })
  }
  
  async getDetailsNestedTags(){
    const details = await this.getAllProjectDetails()
    const tags = await this.getTags()
    const rels = await this.getDetailsToTagsAssoc()
    
    return details.map(detail => {
      const tagsFiltered = tags.filter(tag => {
        return rels.find(rel => {
          return rel.TagsId === tag.id && rel.DetailsId === detail.id
        })
      })
      
      return {
        ...detail,
        tags: [...tagsFiltered]
      }
    })
  }
  
  ////////////////////////////
  /////////  PUT / INSERT
  ////////////////////////////
  insertOneTag(name, image){
    return knex('ProjectTags').insert({
      name,
      image
    })
  }

  insertManyTags(){
    return knex('ProjectTags').insert(this.tags)
  }

  insertProject(){
    return knex('ProjectDetails').insert({
      title: this.title,
      description: this.description,
      slug: this.slug,
      image: this.image,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    })
  }

  insertProjectFull(id){
    return knex('ProjectFullDetails').insert({
      projectId: id,
      fullDescription: this.fullDescription,
      linkSite: this.linkSite,
      linkGit: this.linkGit,
      techUsedDesc: this.techUsedDesc,
      conclusion: this.conclusion
    })
  }

  insertProjectTagAssoc(projectId, tags){
    tags.forEach(async tag => {
      await knex('ProjectAssocDetailTags').insert({
        TagsId: tag.id,
        DetailsId: projectId
      })
    })
  }

  insertTagsWithDependecies(){
    return this.tags.map(async tag => {
      const isTagExist = await this.getOneTagByName(tag.name)
      return {id: isTagExist[0].id, name: isTagExist[0].name}
    })
  }

  insertSliderImages(sliderImages){
    return knex('ProjectSliderImages').insert(sliderImages)
  }

  async insertProjectWithTags(){
    const successProject = await this.insertProject()
    const projectId = successProject[0]
    const successTags = await Promise.all(this.insertTagsWithDependecies())
    const successAssoc = await this.insertProjectTagAssoc(projectId, successTags)
    const successFullProject = await this.insertProjectFull(projectId)
    const successSlider = await this.insertSliderImages(this.sliderImages.map(image => {return {projectId, image}}))
    await Promise.all(successProject, successTags, successAssoc, successFullProject, successSlider)
  }
  
  
  ////////////////////////////
  /////////  UPDATE
  ////////////////////////////
  
  updateOneDetailProjectById(id){
    return knex('ProjectDetails').where('id', '=', id).update({
      title: this.title,
      description: this.description,
      slug: this.slug,
      image: this.image,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    })
  }

  updateOneFullDetailProjectById(id){
    return knex('ProjectFullDetails').where('projectId', '=', id).update({
      fullDescription: this.fullDescription,
      linkSite: this.linkSite,
      linkGit: this.linkGit,
      techUsedDesc: this.techUsedDesc,
      conclusion: this.conclusion
    })
  }

  async updateManySlidersFromProjectById(id){
    const slidersArr = await this.getOneProjectSliderImagesById(id)
    this.sliderImages.forEach(async newImg => {
      if(!slidersArr.find(dbImg => dbImg.image === newImg)){
        await this.insertSliderImages({projectId: id, image: newImg})
      }
    })

    slidersArr.forEach(async dbImg => {
      if(!this.sliderImages.find(newImg => dbImg.image === newImg)){
        fs.unlink(path.join(__dirname, '..', 'public', 'images', 'sliders', dbImg.image), () => {})
        await this.deleteOneSliderImageById(dbImg.id)
      }
    })
  }

  async updateManyTagsFromProjectById(projectId){
    await this.deleteManyFromTagAssocByProjectId(projectId)
    await this.insertProjectTagAssoc(projectId, this.tags)
  }

  async updateOneProjectById(id){
    await this.updateOneDetailProjectById(id)
    await this.updateOneFullDetailProjectById(id)
    await this.updateManySlidersFromProjectById(id)
    await this.updateManyTagsFromProjectById(id)
  }


  ////////////////////////////
  /////////  DELETE
  ////////////////////////////

  deleteOneSliderImageById(id){
    return knex('ProjectSliderImages').where('id', '=', id).del()
  }

  deleteOneProjectById(id) {
    this.getOneTagByName
    return knex('ProjectDetails').where('id', '=', id).del()
  }

  deleteManyFromTagAssocByProjectId(projectId){
    return knex('ProjectAssocDetailTags').where('DetailsId', '=', projectId).del()
  }

  deleteOneTagById(id){
    return knex('ProjectTags').where('id', '=', id).del()
  }

}
module.exports = Project