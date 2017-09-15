function ensureAuthenticated (req, res, next) {

  if (req.isAuthenticated()) {

    return next()

  }

  return res.redirect('/welcome/login')

}

function ensureVerified (req, res, next) {

  if (!req.user.isVerified) {

    let accountNotVerifed = new Error("Your account is not verified please check your email")

    accountNotVerifed.status = 400

    accountNotVerifed.page = '/verified400'

    accountNotVerifed.object = {
      message: accountNotVerifed.message,
      account: req.user.email
    }

    return next(accountNotVerifed)

  }

  return next()

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

// So this function sets a path to render mobile html using the same routes based on the user agent "Mobile"

function checkDevice (req, res, next) {

  let url = req.app.config.get(req.app.config.enviroment)['mobileurl']

  if (req.headers.host === url) {

    req.filepath = '/mobile'

  } else {

    req.filepath = '/'
    
  }

  next()

}

exports = module.exports = function(app, passport) {

    //Check for mobile users
    app.all('*', checkDevice)

    // Welcome page which includes a login and signup form
    app.all('/welcome*', ensureSignedOut)
    app.get('/welcome/login', require('./views/pages/welcome').init)
    app.post('/welcome/login', require('./views/pages/login').login)
    app.post('/welcome/signup', require('./views/pages/signup').signup)

    //logout
    app.get('/logout', require('./views/pages/login').logout)

    // Verification routes
    app.all('/account*', ensureAuthenticated)
    app.all('/account*', emailAlreadyVerified)
    app.get('/account/postlogin', require('./views/pages/welcome').postLogin)
    app.get('/account/sendEmail', require('./views/pages/welcome/emailverification').sendVerificationEmail)
    app.get('/account/resendEmail', require('./views/pages/welcome/emailverification').init)
    app.post('/account/resendEmail', require('./views/pages/welcome/emailverification').resendVerificationEmail)
    
    //Not in account route incase user checks email from another browser
    app.get('/verification/:token', require('./views/pages/welcome/emailverification').verify)

    //Forgot account?
    app.get('/forgot', require('./views/pages/forgot').init)
    app.post('/forgot', require('./views/pages/forgot').forgotAccount)

    //login only page
    app.all('/alternate*', ensureSignedOut)
    app.get('/alternate/login', require('./views/pages/login').init)
    app.post('/alternate/login', require('./views/pages/login').login)

    //signup only page
    app.get('/alternate/signup', require('./views/pages/signup').init)
    app.post('/alternate/signup', require('./views/pages/signup').signup)

    // Home page
    app.all('/', ensureAuthenticated)
    app.all('/', ensureVerified)
    app.get('/', require('./views/pages/home').init)

}