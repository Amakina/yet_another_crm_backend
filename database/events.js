const connection = require('./connection')
const config = require('../config')

const create = ({ date, description, selected }, org_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO events(date, description, responsible_id, org_id) VALUES (?,?,?,?)'
  connection.query(query, [date, description, selected.id, org_id], (error) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res()
    }
  })
})

const get = (org_id) => new Promise((res, rej) => {
  const query = 'SELECT * FROM events WHERE org_id = ?'
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
}