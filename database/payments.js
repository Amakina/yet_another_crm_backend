const connection = require('./connection')
const config = require('../config')

const create = ({ receipt, date, sum, selected }, org_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO payments(receipt, date, sum, deal_id, org_id) VALUES (?,?,?,?,?)'
  connection.query(query, [receipt, date, sum, selected.id, org_id], (error) => {
    if (error) {
      console.log(error)
      rej(config.ERRORS.UNKNOWN)
    } else {
      res()
    }
  })
})

const get = (org_id) => new Promise((res, rej) => {
  const query = 'SELECT id, deal_id, receipt, DATE_FORMAT(date, N\'%d.%m.%Y %H:%i\') AS date, sum FROM payments WHERE org_id = ?'
  connection.query(query, [org_id], (error, results) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res(results)
    }
  })
})

const update = ({ id, deal_id, receipt, date, sum }) => new Promise((res, rej) => {
  const query = 'UPDATE payments SET deal_id = ?, receipt = ?, date = ?, sum = ? WHERE id = ?'
  connection.query(query, [deal_id, receipt, date, sum, id], (error) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res()
    }
  })
})

const remove = ({ id }) => new Promise((res, rej) => {
  const query = 'DELETE FROM payments WHERE id = ?'
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
  remove,
}