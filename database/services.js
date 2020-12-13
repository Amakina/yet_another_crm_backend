const connection = require('./connection')
const config = require('../config')

const create = ({ code, name, description, price }, org_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO services(code, name, description, price, org_id) VALUES (?,?,?,?,?)'
  connection.query(query, [code, name, description, price, org_id], (error) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res()
    }
  })
})

module.exports = {
  create,
}