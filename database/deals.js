const connection = require('./connection')
const config = require('../config')

const create = ({ deal_date, finish_date }, org_id, manager_id, customer_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO deals(deal_date, finish_date, org_id, manager_id, customer_id) VALUES (?,?,?,?,?)'
  connection.query(query, [deal_date, finish_date, org_id, manager_id, customer_id], (error, results) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res(results.insertId)
    }
  })
})

const get = (org_id) => new Promise((res, rej) => {
  const query = 'SELECT * FROM deals_view WHERE org_id = ?'
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