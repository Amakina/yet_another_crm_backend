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

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (_, user, info) => {
    if (user.id) {
      const token = jwt.sign({ id: user.id, role: user.role }, config.SECRET_KEY)
      res.cookie('session_token', token, { httpOnly: true, secure: false });
      res.status(200).send()
    } else {
      res.status(401).send(info)
    }
  })(req, res, next)
})

app.listen(8081, () => console.log('app is running'))