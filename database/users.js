const connection = require('./connection')
const bcrypt = require('bcrypt')
const config = require('../config')

const saltRounds = 10;

const create = ({ user_name, user_email, user_password }, org_id, role) => new Promise((res, rej) => {
  bcrypt.hash(user_password, saltRounds, (err, hash) => {
    const query = 'INSERT INTO users(name, email, password, org_id, role) VALUES(?,?,?,?,?)'
    connection.query(query, [user_name, user_email, hash, org_id, role], (error) => {
      if (error) {
        if (error.errno === 1062) rej(config.ERRORS.USER_EXISTS)
        else rej(config.ERRORS.UNKNOWN)
      } else {
        res()
      }
    })
  })
})  

const get = (username, password) => new Promise((res, rej) => {
  const query = 'SELECT * FROM users WHERE email = ?'
  connection.query(query, [username], (error, results) => {
    if (error) {
      rej(config.ERRORS.EMAIL_NOT_FOUND)
    } else {
      bcrypt.compare(password, results[0].password, (error, found) => {
        if (error) rej(config.ERRORS.UNKNOWN)
        else if (!found) rej(config.ERRORS.INCORRECT_PASSWORD)
        else res(results[0])
      })
    }
  })
})

const getWorkers = (org_id) => new Promise((res, rej) => {
  const query = 'SELECT * FROM users WHERE org_id = ?'
  connection.query(query, [org_id], (error, results) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res(results)
    }
  })
})

module.exports = {
  create,
  get,
  getWorkers,
}