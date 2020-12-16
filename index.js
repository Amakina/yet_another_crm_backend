const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const db = require('./database')
const config = require('./config')
const passport = require('./passport')

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.status(200).send('<h1>Hello</h1>')
})

app.post('/signup', (req, res) => {
  db.companies.create(req.body)
    .then((id) => {
      db.users.create(req.body, id, config.ROLES.ADMIN)
        .then(() => res.sendStatus(200))
        .catch(() => res.status(400).json({message: error.message }))
    })
    .catch((error) => {
      console.log({ body: error })

      res.status(401).json({ message: error.message })
    })
})

app.post('/create-user', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id || user.role < config.ROLES.MANAGER) {
      res.sendStatus(403)
    }
    else {
      db.users.create(req.body, user.org_id, req.body.role)
        .then(() => res.sendStatus(200))
        .catch((error) => res.status(400).json({ message: error }))
    }
  })(req, res, next)
})


app.post('/login', (req, res, next) => {
  passport.authenticate('local', (_, user, info) => {
    if (user.id) {
      const token = jwt.sign({ id: user.id, role: user.role, org_id: user.org_id }, config.SECRET_KEY)
      res.cookie('session_token', token, { httpOnly: true, secure: false });
      res.status(200).send({ token })
    } else {
      res.status(401).send(info)
    }
  })(req, res, next)
})

app.post('/auth', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    console.log(req.body)
    if (error || !user.id || (req.body.is_admin && user.role < config.ROLES.MANAGER)) {
      res.sendStatus(403)
    }
    else {
      res.sendStatus(200)
    }
  })(req, res, next)
})

app.post('/add-service', (req, res, next) => {
  passport.authenticate('jwt', (error, user, info) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.services.create(req.body, user.org_id)
        .then(() => res.sendStatus(200))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/update-service', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.services.update(req.body)
        .then(() => res.sendStatus(200))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/delete-service', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.services.remove(req.body)
        .then(() => res.sendStatus(200))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/get-services', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.services.get(user.org_id)
        .then((results) => res.json(results))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/add-deal', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      const connectServices = (services, deal_id) => new Promise((resolve, reject) => {
        const promises = []
        services.forEach(element => {
          promises.push(db.deals_services.create(element, deal_id))
        })
        Promise.all(promises)
          .then(() => {
            db.connection.commit((commit_error) => {
              if (!commit_error) { res.sendStatus(200); return }
              db.connection.rollback(() =>  { throw config.ERRORS.UNKNOWN })
            })
          })
          .catch((error) => db.connection.rollback(() =>  { throw error }))
      })

      const createDeal = (customer_id, needRes) => {
        db.deals.create(req.body, user.org_id, user.id, customer_id)
          .then((deal_id) => {
            connectServices(req.body.services, deal_id)
          })
          .catch((d_error) => db.connection.rollback(() => { 
            if (!needRes) throw d_error
            res.status(400).json({ error: d_error })
          }))
      }

      db.connection.beginTransaction((error) => {
        if (error) { res.status(400).json({ error: config.ERRORS.UNKNOWN }); return }
        if (req.body.customer_id) {
          createDeal(req.body.customer_id, true)
        } else {
          db.customers.create(req.body, user.org_id)
            .then((customer_id) => {
              createDeal(customer_id)
            })
            .catch(c_error => db.connection.rollback(() => res.status(400).json({ error: c_error })))
        }
      })
    }
  })(req, res, next)
})

app.post('/get-customers', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.customers.get(user.org_id)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/get-deals', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.deals.get(user.org_id)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/get-workers', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.users.getWorkers(user.org_id)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/add-event', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.events.create(req.body, user.org_id)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/get-events', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.events.get(user.org_id)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/add-payment', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.payments.create(req.body, user.org_id)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/get-payments', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.payments.get(user.org_id)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/update-payment', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.payments.update(req.body)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/delete-payments', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.payments.remove(req.body)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})


app.post('/update-event', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.events.update(req.body)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/delete-event', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.events.remove(req.body)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/update-customer', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.customers.update(req.body)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/update-deal', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.connection.beginTransaction((error) => {
        if (error) res.status(400).json({ error: config.ERRORS.UNKNOWN })
        db.deals.update(req.body)
          .then(() => {
            db.deals_services.remove(req.body)
              .then(() => {
                req.body.services.forEach(element => {
                  db.deals_services.create(element, req.body.id)
                    .then(() => {
                      db.connection.commit((commit_error) => {
                        if (!commit_error) return
                        db.connection.rollback(() =>  { throw config.ERRORS.UNKNOWN })
                      })
                    })
                    .catch((ds_error) => db.connection.rollback(() => { throw ds_error }))
                })
              })
              .catch((ds_error) => db.connection.rollback(() => { throw ds_error }))
          })
          .catch((d_error) => db.connection.rollback(() => { throw d_error }))
      })
      res.sendStatus(200)
    }
  })(req, res, next)
})

app.post('/delete-deal', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.deals.remove(req.body)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/get-not-paid-deals', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.deals.getNotPaid(user.org_id)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/get-regulars', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.customers.getRegulars(user.org_id)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.post('/filter-query', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      const { search, table, searchField, handler, sortField, method } = req.body
      let query = ''
      let params = []
      if (search) {
       query = `${query} AND ??.?? LIKE ?`
       params.push(table, searchField.value, `%${search}%`)
      }
      if (sortField && sortField.value) {
        query = `${query} ORDER BY ??.?? ${sortField.dir ? '' : 'DESC'}`
        params.push(table, sortField.value)
      }
      let callee = 'get'
      if (method) callee += method
      console.log('here', query, params)
      db[handler][callee](user.org_id, query, params)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})

app.listen(8081, () => console.log('app is running'))