const bcrypt = require("bcrypt-nodejs")
const db = require('./db')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(authenticate))
passport.use("local-register", new LocalStrategy({passReqToCallback: true}, register))

function authenticate(username, password, done) {
  db('users')
    .where('email', username)
    .orWhere('username', username)
    .first()
    .then((user) => {

      if (!user) {
        return done(null, false)
      }

      done(null, user)

  }, done)
}

function register(req, email, password, done) {

  db('users')
    .where('email', email)
    .first()
    .then((user) => {

      if (user) {

        let emailFound = {
          'username': {
            'msg': 'That email has already been used used'
          }
        } 
        
        return done(null, false, {        
          message: [ req.flash("errors", emailFound), req.flash("body", req.body) ]
        })

      }

      db('users')
        .where('username', req.body.userid)
        .first()
        .then((user) => {

          if (user) {

           let usernameFound = {
             'userid': {
             'msg': 'That username is already taken'
             }
           }
         
          return done(null, false, { 
            message: [ req.flash("errors", usernameFound), req.flash("body", req.body) ]
          })

        }

        const newUser = {
          fullname: req.body.fullname,
          username: req.body.userid,
          email: email,
          password: bcrypt.hashSync(password)
        }

        db("users")
          .insert(newUser)
          .then((ids) => {
            newUser.id = ids[0]
            done(null, newUser)
        }) 
      })
    })
}

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  db('users')
    .where('id', id)
    .first()
    .then((user) => {
        done(null, user)
    }, done)
})