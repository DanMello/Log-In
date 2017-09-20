exports = module.exports = function(app, passport) {

  const LocalStrategy = require('passport-local').Strategy

  passport.use(new LocalStrategy({passReqToCallback: true}, authenticate))
  passport.use("local-register", new LocalStrategy({passReqToCallback: true}, register))

  function authenticate(req, username, password, done) {

    app.db('users')
      .where('email', username)
      .orWhere('username', username)
      .first()
      .then(user => {

        if (!user || !app.bcrypt.compareSync(password, user.password)) {

          req.flash('body', req.body)

          return done(null, false, req.flash('loginErrors', 'Username and password combination is incorrect*'))

        }

        done(null, user)

    }, done)
    
  }

  function register(req, email, password, done) {
    
    let newUser = {
      fullname: req.body.fullname,
      username: req.body.userid.toLowerCase(),
      email: email.toLowerCase(),
      password: app.bcrypt.hashSync(password)
    }

    app.db('users')
      .where('email', email)
      .first()
      .then(user => {

        if (user) {

          let emailFound = {
            username: {
              msg: 'That email has already been used used'
            }
          }

          let emailFoundError = new Error()

          emailFoundError.message = emailFound
          emailFoundError.status = 400

          throw emailFoundError

        }

      }).then(() => {

        return app.db('users')
          .where('username', req.body.userid)
          .first()

      }).then(user => {

        if (user) {

          let usernameFound = {
            userid: {
              msg: 'That username is already taken'
            }
          }

          let usernameFoundError = new Error()

          usernameFoundError.message = usernameFound
          usernameFoundError.status = 400

          throw usernameFoundError

        }

      }).then(() => {

        return app.db('users') 
          .insert(newUser)

      }).then(ids => {

        newUser.id = ids[0]

        done(null, newUser)

      }).catch(err => {

        if (err.status === 400) {

          req.flash('body', req.body)

          return done(null, false, req.flash('formErrors', err.message))

        } else if (err) return done(err)

      })

  }

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    app.db('users')
      .where('id', id)
      .first()
      .then(user => {
          done(null, user)
      }, done)
  })

}