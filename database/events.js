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
  const query = 'SELECT id, DATE_FORMAT(date, N\'%d.%m.%Y %H:%i\') AS date, description, responsible_id, org_id FROM events WHERE org_id = ?'
  connection.query(query, [org_id], (error, results) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res(results)
    }
  })
})

const update = ({ date, description, selected, id }) => new Promise((res, rej) => {
  const query = 'UPDATE events SET date = ?, description = ?, responsible_id = ? WHERE id = ?'
  connection.query(query, [date, description, selected.id, id ], (error) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res()
    }
  })
})

const remove = ({ id }) => new Promise((res, rej) => {
  const query = 'DELETE FROM events WHERE id = ?'
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