const connection = require('./connection')
const config = require('../config')

const create = ({ check, date, sum, selected }, org_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO payments(receipt, date, sum, deal_id, org_id) VALUES (?,?,?,?,?)'
  connection.query(query, [check, date, sum, selected.id, org_id], (error) => {
    if (error) {
      console.log(error)
      rej(config.ERRORS.UNKNOWN)
    } else {
      res()
    }
  })
})

const get = (org_id) => new Promise((res, rej) => {
  const query = 'SELECT * FROM payments WHERE org_id = ?'
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