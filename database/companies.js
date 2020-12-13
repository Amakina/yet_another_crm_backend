const connection = require('./connection')
const config = require('../config')

const create = ({ company_name, company_phone, company_email, company_address, company_ogrn }) => new Promise((res, rej) => {
  const query = 'INSERT INTO companies(name, phone, email, address, ogrn) VALUES (?,?,?,?,?)'
  connection.query(query, [company_name, company_phone, company_email, company_address, company_ogrn], (error, results) => {
    if (error) {
      if (error.errno === 1062) rej(config.ERRORS.COMPANY_EXISTS)
      else rej(config.ERRORS.UNKNOWN)
    } else {
      res(results.insertId)
    }
  })
})

module.exports = {
  create,
}