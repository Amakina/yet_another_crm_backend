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

app.post('/get-users', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id || user.role < config.ROLES.ADMIN) {
      res.sendStatus(403)
    }
    else {
      db.users.getAll(user.org_id)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json({ message: error }))
    }
  })(req, res, next)
})

app.post('/edit-user', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id || user.role < config.ROLES.ADMIN) {
      res.sendStatus(403)
    }
    else {
      db.users.update(req.body)
        .then((result) => res.json(result))
        .catch((error) => {
          res.status(400).json({ message: error })
        })
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
      const { search, table, searchField, handler, sortField, method, filterDate, dataField } = req.body
      let query = ''
      let params = []
      if (search) {
       query = `${query} AND ??.?? LIKE ?`
       params.push(table, searchField.value, `%${search}%`)
      }
      if (filterDate && filterDate.length && filterDate[0] && dataField && dataField.value) {
        query = `${query} AND ??.?? BETWEEN STR_TO_DATE(?, N'%d.%m.%Y') AND STR_TO_DATE(?, N'%d.%m.%Y')`
        params.push(table, dataField.value, filterDate[0], filterDate[1])
      }
      if (sortField && sortField.value) {
        query = `${query} ORDER BY ??.?? ${sortField.dir ? '' : 'DESC'}`
        params.push(table, sortField.value)
      }
      let callee = 'get'
      if (method) callee += method
      db[handler][callee](user.org_id, query, params)
        .then((result) => res.json(result))
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})


app.post('/get-rfm', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.companies.getRFM(user.org_id)
        .then((result) => {
          const maxScore = 5
          const scoreArray = (array, v) => {
            let max = maxScore
            const unique = new Set(array.map(e => e[1][v]))
            const scores = {}
            const counts = Math.ceil(unique.size / max)
            const iter = unique.size / counts
            for (let i = 0; i < iter; i++) {
              for (let j = 0; j < counts; j++) {
                scores[array[i * counts + j][0]] = max
              }
              max = Math.max(max - 1, 0);
            }
            return { ...scores, r: max }
          }
          const toScore = result.reduce((acc, cur, i) => {
            return { 
              ...acc, 
              [i]: { 
                d: cur.date_diff,
                f: cur.frequency,
                m: cur.money,
              } 
            }
          }, {})
          const dateScore = scoreArray(Object.entries(toScore).sort((a, b) => a[1].d - b[1].d), 'd')
          const frequencyScore = scoreArray(Object.entries(toScore).sort((a, b) => b[1].f - a[1].f), 'f')
          const moneyScore = scoreArray(Object.entries(toScore).sort((a, b) => b[1].m - a[1].m), 'm')
          result = result.map((r, i) => {
            const date_diff = dateScore[i] || dateScore.r
            const frequency = frequencyScore[i] || frequencyScore.r
            const money = moneyScore[i] || moneyScore.r
            const overall = 3 * date_diff + 2 * frequency + money
            return { ...r, date_diff, frequency, money, overall }
          }).sort((a, b) => b.overall - a.overall)
          res.json(result)
        })
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})


app.post('/get-abc', (req, res, next) => {
  passport.authenticate('jwt', (error, user) => {
    if (error || !user.id) {
      res.sendStatus(403);
    }
    else {
      db.companies.getABC(user.org_id)
        .then((result) => {
          const overall = result.splice(-1, 1)[0]
          const meanSum = result.reduce((acc, cur) => acc + cur.mean, 0)
          console.log(meanSum)
          result = result.map(e => ({ 
            ...e, 
            shareRevenue: e.revenue / overall.revenue,
            shareMean: e.mean / meanSum,
            shareProfit: e.profit / overall.profit
          }))

          const countShares = (array, param, value) => {
            let share = 0
            for (let i = 0; i < array.length; i++) {
              share += array[i][param]
              if (share < 0.8) array[i][param] = 3
              else if (share < 0.95) array[i][param] = 2
              else array[i][param] = 1
              array[i].overallABC = (array[i].overallABC || 0) + array[i][param] * value
            }
            return array
          }

          result = countShares(result.sort((a, b) => b.shareRevenue - a.shareRevenue), 'shareRevenue', 4)
          result = countShares(result.sort((a, b) => b.shareMean - a.shareMean), 'shareMean', 3)
          result = countShares(result.sort((a, b) => b.shareProfit - a.shareProfit), 'shareProfit', 5)
          
          res.json(result)

        })
        .catch((error) => res.status(400).json(error))
    }
  })(req, res, next)
})


app.listen(8081, () => console.log('app is running'))