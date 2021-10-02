const knex = require('../Models/config')

class Display {

  getCategories(){ 
    return knex
      .select().from('DisplayCats')
  }

  getSkills(){
    return knex
      .select().from('DisplaySkills')
  }

  async getCatNestedSkills(){
    const categories = await this.getCategories()
    const skills = await this.getSkills()

    return categories.map(category => {
      return {
        ...category,
        skills: skills.filter(skill => {
          return skill.catId === category.id
        })
      }
    })
  }
}

module.exports = Display