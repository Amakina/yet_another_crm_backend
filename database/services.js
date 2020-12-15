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

const get = (org_id, extraQuery = '', extraParams = []) => new Promise((res, rej) => {
  const query = 'SELECT * FROM services WHERE org_id = ?' + extraQuery
  connection.query(query, [org_id, ...extraParams], (error, results) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res(results)
    }
  })
})

const update = ({ code, name, description, price, id }) => new Promise((res, rej) => {
  const query = 'UPDATE services SET code = ?, name = ?, description = ?, price = ? WHERE id = ?'
  connection.query(query, [code, name, description, price, id], (error) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res()
    }
  })
})

const remove = ({ id }) => new Promise((res, rej) => {
  const query = 'DELETE FROM services WHERE id = ?'
  connection.query(query, [id], (error) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res()
    }
  })
})

module.exports = {
  create,
  get,
  update,
  remove
}