const connection = require('./connection')
const config = require('../config')

const create = ({ id, quantity }, deal_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO deal_services(service_id, quantity, deal_id) VALUES (?,?,?)'
  connection.query(query, [id, quantity, deal_id], (error) => {
    if (error) {
        console.log(error)
      rej(config.ERRORS.UNKNOWN)
    } else {
      res()
    }
  })
})

const get = (deal_id) => new Promise((res, rej) => {
  const query = 'SELECT * FROM deal_services WHERE deal_id = ?'
  connection.query(query, [deal_id], (error, results) => {
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