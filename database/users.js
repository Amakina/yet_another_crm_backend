const connection = require('./database')
const bcrypt = require('bcrypt')

const saltRounds = 10;

const create = ({ user_name, user_email, user_password }, org_id, role) => new Promise((res, rej) => {
  bcrypt.hash(user_password, saltRounds, (err, hash) => {
    const query = 'INSERT INTO users(name, email, password, org_id, role) VALUES(?,?,?,?,?)'
    connection.query(query, [user_name, user_email, hash, role, org_id], (error) => {
      if (error) {
        if (error.errno === 1062) rej('Пользователь с этим email уже зарегистирован')
        else rej('Что-то пошло не так :(')
      } else {
        res()
      }
    })
  })
})  


module.exports = {
  create,
}