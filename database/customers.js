const connection = require('./connection')
const config = require('../config')

const create = ({ name, ogrn, inn, address, phone, email }, org_id) => new Promise((res, rej) => {
  const query = 'INSERT INTO customers(name, ogrn, inn, address, phone, email, org_id) VALUES (?,?,?,?,?,?,?)'
  connection.query(query, [name, ogrn, inn, address, phone, email, org_id], (error, results) => {
    if (error) {
      if (error.errno === 1062) rej(config.ERRORS.CUSTOMER_EXISTS)
      else rej(`Заказчики: ${config.ERRORS.UNKNOWN}`)
    } else {
      res(results.insertId)
    }
  })
})

const get = (org_id) => new Promise((res, rej) => {
  const query = 'SELECT * FROM customers WHERE org_id = ?'
  connection.query(query, [org_id], (error, results) => {
    if (error) {
      rej(`Заказчики: ${config.ERRORS.UNKNOWN}`)
    } else {
      res(results)
    }
  })
})

const update = ({ name, ogrn, inn, address, phone, email, id }) => new Promise((res, rej) => {
  const query = 'UPDATE customers SET name = ?, ogrn = ?, inn = ?, address = ?, phone = ?, email = ? WHERE id = ?'
  connection.query(query, [name, ogrn, inn, address, phone, email, id ], (error) => {
    if (error) {
      rej(`Заказчики: ${config.ERRORS.UNKNOWN}`)
    } else {
      res()
    }
  })
})

module.exports = {
  create,
  get,
  update
}