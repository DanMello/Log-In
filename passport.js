exports = module.exports = function(app, passport, bcrypt, crypto) {

  const LocalStrategy = require('passport-local').Strategy

  passport.use(new LocalStrategy({passReqToCallback: true}, authenticate))
  passport.use("local-register", new LocalStrategy({passReqToCallback: true}, register))

  function authenticate(req, username, password, done) {

    app.db('users')
      .where('email', username)
      .orWhere('username', username)
      .first()
      .then((user) => {

        if (!user || !bcrypt.compareSync(password, user.password)) {

          req.flash('body', req.body)

          return done(null, false, req.flash('loginErrors', 'Username and password combination is incorrect*'))

        }

        done(null, user)

    }, done)
    
  }

  function register(req, email, password, done) {

    let newUser = {
      fullname: req.body.fullname,
      username: req.body.userid,
      email: email,
      password: bcrypt.hashSync(password)
    }

    let emailToken = {
      userid: null,
      token: crypto.randomBytes(16).toString('hex'),
      expires: Date.now() + 86400000
    }
    
    return app.db('users')
      .where('email', email)
      .first()
      .then(user => {

        console.log('first request user, then')

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

      }).then(function() {

        console.log('second request user')

        return app.db('users')
          .where('username', req.body.userid)
          .first()

      }).then(user => {

        console.log('second request user, then')

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

      }).then(function() {

        console.log('third request user')
        
        return app.db('users') 
          .insert(newUser)

      }).then(ids => {

        console.log('third request user, then')

        newUser.id = ids[0]

      }).then(function() {

        console.log('fourth request token')

        emailToken.userid = newUser.id

        return app.db('tokens')
          .insert(emailToken)

      }).then(result => {

        console.log('fourth request token, then')
        
        let verifyEmail = {
          from: '"Dans App" <jdanmello@gmail.com>',
          to: email,
          subject: 'Account verification from Dans App',
          html: 'Hello, please verify your account by clicking the link: ' + req.protocol + '://' + req.headers.host + '\/verification\/' + emailToken.token + '.\n' 
        }
        
        app.utility.nodemailer.transporter.sendMail(verifyEmail)

        done(null, newUser)

      }).catch(err => {

        console.log('err, catch')

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
      .then((user) => {
          done(null, user)
      }, done)
  })

}