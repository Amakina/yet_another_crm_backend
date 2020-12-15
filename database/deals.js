const connection = require('./connection')
const config = require('../config')

const create = ({ deal_id, deal_date, finish_date }, org_id, manager_id, customer_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO deals(deal_id, deal_date, finish_date, org_id, manager_id, customer_id) VALUES (?,?,?,?,?,?)'
  connection.query(query, [deal_id, deal_date, finish_date, org_id, manager_id, customer_id], (error, results) => {
    if (error) {
      console.log(error)
      rej(`Сделки: ${config.ERRORS.UNKNOWN}`)
    } else {
      res(results.insertId)
    }
  })
})

const get = (org_id) => new Promise((res, rej) => {
  const query = 'SELECT * FROM deals_view WHERE org_id = ?'
  connection.query(query, [org_id], (error, results) => {
    if (error) {
      rej(`Сделки: ${config.ERRORS.UNKNOWN}`)
    } else {
      res(results)
    }
  })
})


const update = ({ id, deal_id, deal_date, finish_date, customer_id, status }) => new Promise((res, rej) => {
  const query = 'UPDATE deals SET deal_id = ?, deal_date = ?, finish_date = ?, customer_id = ?, status = ? WHERE id = ?'
  connection.query(query, [deal_id, deal_date, finish_date, customer_id, status, id], (error) => {
    if (error) {
      rej(`Сделки: ${config.ERRORS.UNKNOWN}`)
    } else {
      res()
    }
  })
})

const remove = ({ id }) => new Promise((res, rej) => {
  const query = 'DELETE FROM deals WHERE id = ?'
  connection.query(query, [id], (error) => {
    if (error) {
      rej(`Сделки: ${config.ERRORS.UNKNOWN}`)
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