const knex = require('../Models/config')

class Admin {
  constructor({...options}){
    this.username = options.username
    this.password = options.password
    this.tier = options.tier
  }

  getUsers(){ 
    return knex.select().from('AdminCredentials')
  }

  getUserByUsername(){
    return knex('AdminCredentials').where({ username: this.username }).select()
  }
  
  static getUserById(id){
    return knex('AdminCredentials').where({ id }).select()
  }
}

module.exports = Admin