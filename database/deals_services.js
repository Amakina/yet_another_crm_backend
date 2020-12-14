const connection = require('./connection')
const config = require('../config')

const create = ({ id, quantity }, deal_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO deal_services(service_id, quantity, deal_id) VALUES (?,?,?)'
  connection.query(query, [id, quantity, deal_id], (error) => {
    if (error) {
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

const remove = ({ id }) => new Promise((res, rej) => {
  const query = 'DELETE FROM deal_services WHERE deal_id = ?'
  connection.query(query, [id], (error) => {
    if (error) {
      console.log({error: 'error'})
      rej(config.ERRORS.UNKNOWN)
    } else {
      res()
    }
  })
})

module.exports = {
  create,
  get,
  remove
}