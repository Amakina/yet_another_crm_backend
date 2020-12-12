const mysql = require('mysql')
const config = require('../config')

var connection = mysql.createConnection({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DB
})

connection.connect();

module.exports = connection