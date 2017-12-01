function ensureAuthenticated (req, res, next) {

  if (req.isAuthenticated()) {

    return next()

  }

  return res.redirect('/welcome/login')

}

function ensureVerified (req, res, next) {

  let tempAccess = req.user.tempVerificationExpires

  if (tempAccess !== null && tempAccess > Date.now()) {

    return next()

  }

  if ((!req.user.isVerified && req.user.oauth_provider === null)) {

    res.render('pages/welcome' + req.filepath + 'welcome', {
      username: req.user.username,
      email: req.user.email,
      id: req.user.id
    })

  } else {

    return next()
  }


}

function ensureSignedOut (req, res, next) {

  if (req.isAuthenticated()) {

    return res.redirect('/')

  }

  return next()

}

function emailAlreadyVerified (req, res, next) {

  if (req.user.isVerified) {

    let isVerifiedError = new Error('Your email is already verified')

    isVerifiedError.status = 400

    return next(isVerifiedError)

  }

  return next()
  
}

// So this function sets a path to render mobile HTML using the same routes based on the user agent "Mobile"

function checkDevice (req, res, next) {

  let url = req.app.config.settings[req.app.config.enviroment].mobileurl

  console.log(req.headers.host)

  if (req.headers.host === url) {

    req.filepath = '/mobile/'

  } else {

    req.filepath = '/'
    
  }

  next()

}

exports = module.exports = function(app, passport) {

    //Check for mobile users
    app.all('*', checkDevice)

    // Welcome page which includes a login and sign up form
    app.all('/welcome*', ensureSignedOut)
    app.get('/welcome/login', require('./views/pages/welcome').init)
    app.post('/welcome/login', require('./views/pages/login').login)
    app.post('/welcome/signup', require('./views/pages/signup').signup)

    //logout
    app.get('/logout', require('./views/pages/login').logout)

    // Verification routes
    app.get('/account/skipVerification/:id', require('./views/pages/welcome').skipVerification)
    app.get('/account/verification/:token', require('./views/pages/welcome/emailverification').verify)
    app.get('/account/resendEmail', require('./views/pages/welcome/emailverification/resendEmail').init)
    app.post('/account/resendEmail', require('./views/pages/welcome/emailverification/resendEmail').resendVerificationEmail)

    //Forgot account?
    app.all('/forgot*', ensureSignedOut)
    app.get('/forgot', require('./views/pages/forgot').init)
    app.get('/forgot/:token', require('./views/pages/forgot').verify)
    app.post('/forgot', require('./views/pages/forgot').forgotAccount)
    app.post('/forgot/:token', require('./views/pages/forgot').resetPassword)

    //login only page
    app.all('/alternate*', ensureSignedOut)
    app.get('/alternate/login', require('./views/pages/login').init)
    app.post('/alternate/login', require('./views/pages/login').login)

    //sign up only page
    app.get('/alternate/signup', require('./views/pages/signup').init)
    app.post('/alternate/signup', require('./views/pages/signup').signup)

    //social sign up
    app.all('/signup*', ensureSignedOut)
    app.get('/signup/github/', passport.authenticate('github', { scope: ['user:email'] }))
    app.get('/signup/github/callback/', require('./views/pages/signup/index').signupGitHub)

    //Terms of Service and Privacy Policy
    app.get('/legal', require('./views/pages/legal').init)

    // Home page
    app.all('/', ensureAuthenticated)
    app.all('/', ensureVerified)
    app.get('/', require('./views/pages/home').init)

    //Profile page
    app.all('/account*', ensureAuthenticated)
    app.all('/account*', ensureVerified)
    app.get('/account/profile/:username', require('./views/pages/profile').init)
    app.get('/account/settings/:username', require('./views/pages/settings').init)
    app.post('/account/settings/changeEmail', require('./views/pages/settings').changeEmail)

    //test route
    app.get('/test', (req, res, next) => {
      res.render('pages/welcome/emailverification/mobile/resentEmail', {
        email: 'jdanmello@gmail.com',
        error: []
      })
    })

}