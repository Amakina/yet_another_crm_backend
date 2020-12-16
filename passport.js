const passport = require('passport')
const config = require('./config')
const user = require('./database/users')

const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;

passport.use(new LocalStrategy(
  (username, password, done) => {
    user.get(username, password)
      .then((user) => {
        return done(null, { id: user.id, role: user.role, org_id: user.org_id })
      })
      .catch((message) => {
        return done(null, false, { message })
      })
  }
))

const cookieExtractor = (req) => {
  var token = null
  if (req && req.body && req.body.token) {
    token = req.body.token
  }
  return token
}

passport.use(new JwtStrategy({
  secretOrKey: config.SECRET_KEY,
  jwtFromRequest: cookieExtractor
}, (token, done) => {
  try {
    console.log('token', token)
    return done(null, token);
  } catch (error) {
    console.log('token', error)
    done(error);
  }
}))

module.exports = passport