require('dotenv').config()
const connectOptions = {
  client: process.env.MYSQL_DRIVER,
  connection: {
    host : process.env.MYSQL_SERVER,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASS,
    database : process.env.MYSQL_DB
  }
}

module.exports = require('knex')(connectOptions);