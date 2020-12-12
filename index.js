const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./database')
const config = require('./config')

const app = express()

app.use(bodyParser.json())
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

      res.status(400).json({ message: error.message })
    })
})

app.listen(8081, () => console.log('app is running'))