const passport = require('passport')
const config = require('./config')
const user = require('./database/users')

const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;

passport.use(new LocalStrategy(
  (username, password, done) => {
    user.get(username, password)
      .then((user) => {
        return done(null, { id: user.id, role: user.role })
      })
      .catch((message) => {
        return done(null, false, { message })
      })
  }
))

const cookieExtractor = (req) => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['session_token'];
  }
  return token;
}

passport.use(new JwtStrategy({
  secretOrKey: config.SECRET_KEY,
  jwtFromRequest: cookieExtractor
}, (token, done) => {
  try {
    return done(null, token);
  } catch (error) {
    done(error);
  }
}))

module.exports = passport