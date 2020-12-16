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

const getAll = (org_id) => new Promise((res, rej) => {
  const query = 'SELECT id, name, email, role FROM users WHERE org_id = ? AND role < 3'
  connection.query(query, [org_id], (error, results) => {
    if (error) {
      rej(config.ERRORS.EMAIL_NOT_FOUND)
    } else {
      res(results)
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

const update = (newUser) => new Promise((res, rej) => {
  const updateQuery = (user) => {
      const { id, email, password, name, role, } = user
      const params = [ email, name, role, password, id ]
      if (!password) params.splice(3, 1)
      const query = `UPDATE users SET email = ?, name = ?, role = ?${ password ? ', password = ?' : ''} WHERE id = ?`
      connection.query(query, params, (error) => {
          if (error) {
              if (error.errno === 1062) rej(config.ERRORS.USER_EXISTS)
              else rej(config.ERRORS.UNKNOWN)
          }
          else {
              res()
          }
      })
  }
  if (!newUser.password) updateQuery(newUser)
  else {
      bcrypt.hash(newUser.password, saltRounds, function(err, hash) {
          if (err) rej(config.ERRORS.UNKNOWN)
          else {
              newUser.password = hash
              updateQuery(newUser)
          }
      })
  }
})

module.exports = {
  create,
  get,
  getWorkers,
  getAll,
  update
}