exports.init = function (req, res, next) {

  res.render('pages/signup' + req.filepath, {
    formErrors: req.flash('formErrors'),
    body: req.flash('body')
  })

}

exports.signup = function (req, res, next) {

  console.log(req.route.path)

  let redirectRoute 

  if (req.route.path === '/welcome/signup') {

    redirectRoute = '/welcome/login'

  } else {

    redirectRoute = req.route.path

  }

  req.assert('fullname', 'Name can only contain letters').isName()
  req.assert('fullname', 'Name required').notEmpty()
  req.assert('userid', 'Username cannot only contain numbers').notOnlyInt()
  req.assert('userid', 'Username can only contain letters and numbers').isAlphanumeric()
  req.assert('userid', 'Username required').notEmpty()
  req.assert('username', 'Valid email required').isEmail()
  req.assert('username', 'Email required').notEmpty()
  req.assert('password', 'Password requires 6 to 20 characters').len(6, 20)

  req.sanitize('fullname').trim()

  req.getValidationResult().then(result => {

    if (!result.isEmpty()) {

      let errors = result.mapped()

      req.flash('formErrors', errors)
      req.flash('body', req.body)
      res.redirect(redirectRoute)

    } else {

      req._passport.instance.authenticate('local-register', {
        successRedirect: '/',
        failureRedirect: redirectRoute
      })(req, res, next)

    }

  })
  
}

exports.signupGitHub = function (req, res, next) {

  req._passport.instance.authenticate('github', {

    failureRedirect: '/alternate/login',
    successRedirect: '/'

  })(req, res, next)

}

/*
  
  Well we found our first issue with using multiple domains,
  we cannot use multiple domains when logging in with oauth
  so i guess the solution would be to create a sub domain just for oauth 
  which would be used for both mobile and web

*/
