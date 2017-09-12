function sendEmail(req, res, next, type) {

  let crypto = require('crypto')
  
  let emailToken = {
    userid: req.user.id,
    token: crypto.randomBytes(16).toString('hex'),
    expires: Date.now() + 86400000
  }

  return req.app.db('tokens')
    .where('userid', req.user.id)
    .first()
    .then(token => {

      if (token && (type === 'send')) {

        let error = new Error('403 Forbidden Error')

        error.status = 403

        throw error  

      }

      if (token && token.expires > Date.now()) {

        let tokenNotExpiredError = new Error("Your token has not yet expired, please check your email")

        tokenNotExpiredError.status = 400

        throw tokenNotExpiredError

      }

      if ((token && token.expires < Date.now()) && (type === 'resend')) {

        return req.app.db('tokens')
          .where('userid', req.user.id)
          .del()

      }

    }).then(() => {

      return req.app.db('tokens')
      .insert(emailToken)

    }).then(() => {

      req.app.utility.nodemailer(next, {
        from: '"Dans App" <jdanmello@gmail.com>',
        to: req.user.email,
        subject: 'Account verification from Dans App',
        message: 'Hello, please verify your account by clicking the link: ' + req.protocol + '://' + req.headers.host + '\/verification\/' + emailToken.token + '.\n' 
      })

    })
  
}

exports.init = function(req, res) {

  res.render('pages/welcome/emailverification/resendEmail', {
    error: req.flash('emailError')
  })

}

exports.sendVerificationEmail = function(req, res, next) {

  sendEmail(req, res, next, 'send').then(() => {
    
    res.redirect('/account/postlogin')

  }).catch(err => {

    next(err)

  })

}

exports.resendVerificationEmail = function(req, res, next) {

  req.assert('email', 'Email required').notEmpty()
  req.assert('email', 'Valid email required').isEmail()

  req.getValidationResult().then(result => {

    if (!result.isEmpty()) {

      let error = result.array()[0].msg

      req.flash('emailError', error)
      req.flash('body', req.body)
      res.redirect('/account/resendEmail')

    } else {

      sendEmail(req, res, next, 'resend').then(() => {

        res.redirect('/account/postlogin')

      }).catch(err => {

        next(err)

      })

    }

  })

}

exports.verify = function(req, res, next) {

  let user

  req.app.db('tokens')
    .where('token', req.params.token)
    .first()
    .then(tokenObj => {

      if (!tokenObj) {

        let tokenNotFoundError = new Error('Token not found')

        tokenNotFoundError.status = 400

        return next(tokenNotFoundError)   

      }

      if (tokenObj.expires < Date.now()) {

        let expiredError = new Error('Your token has expired')

        expiredError.status = 400

        expiredError.page = '/expiredtoken'

        return next(expiredError) 

      }

      if (!req.user) {

        return req.app.db('users')
          .where('id', tokenObj.userid)
          .first()

      } else {

        return req.user

      }

    }).then(userReference => {

      user = userReference

      return req.app.db('users')
        .where('id', user.id)
        .first()
        .update({ isVerified: 1})

    }).then(verifiedUser => {

      if (!verifiedUser) {

        return next(new Error('Unable to verify email please try again'))

      }

      return req.app.db('tokens')
        .where('token', req.params.token)
        .del()

    }).then(() => {

      res.render('pages/welcome/emailverification/verify', {
        email: user.email
      })

    }).catch(err => {

      next(err)

    }) 

}