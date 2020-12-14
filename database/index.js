const connection = require('./connection')
const companies = require('./companies')
const users = require('./users')
const services = require('./services')
const customers = require('./customers')
const deals = require('./deals')
const deals_services = require('./deals_services')
const events = require('./events')
const payments = require('./payments')

module.exports = {
    connection,
    companies,
    users,
    services,
    customers,
    deals,
    deals_services,
    events,
    payments,
}