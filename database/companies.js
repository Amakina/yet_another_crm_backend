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

const getRFM = (org_id) => new Promise((res, rej) => {
  const query = 'SELECT * FROM rfm_deals WHERE org_id = ?'
  connection.query(query, [org_id], (error, results) => {
    if (error) {
      rej(config.ERRORS.UNKNOWN)
    } else {
      res(results)
    }
  })
})

const getABC = (org_id) => new Promise((res, rej) => {
  const query = 'SELECT * FROM abc_deals WHERE org_id = ?'
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
  getRFM,
  getABC,
}