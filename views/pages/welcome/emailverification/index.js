function sendEmail(req, user, type) {

  let crypto = require('crypto')

  let emailToken = {
    userid: user.id,
    token: crypto.randomBytes(16).toString('hex'),
    expires: Date.now() + 86400000
  }

  return req.app.db('tokens')
    .where('userid', user.id)
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
          .where('userid', user.id)
          .del()

      }

    }).then(() => {

      return req.app.db('tokens')
      .insert(emailToken)

    }).then(() => {

      let emailMessage = 
        `Hello, please verify your account by clicking the link\n\n
         ${req.protocol}://${req.headers.host}/verification/${emailToken.token}\n\n
        `
      return req.app.utility.nodemailer({
        from: '"Dans App" <jdanmello@gmail.com>',
        to: user.email,
        subject: 'Account verification from Dans App',
        message: emailMessage
      })

    })
  
}

exports.init = function(req, res) {

  res.render('pages/welcome/emailverification' + req.filepath + '/resendEmail', {
    error: req.flash('emailError'),
    body: req.flash('body')
  })

}

exports.sendVerificationEmail = function(req, res, next) {

  sendEmail(req, req.user, 'send').then(() => {
    
    res.render('pages/welcome' + req.filepath + '/postlogin')

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
      res.redirect('/resendEmail')

    } else {

      return req.app.db('users')
        .where('email', req.body.email)
        .first()
        .then(user => {

          if (!user) {

            let userNotfound = new Error('There is no account with that email*')

            userNotfound.status = 404

            throw userNotfound

          }

          return sendEmail(req, user, 'resend')

        }).then(() => {

          res.render('pages/welcome' + req.filepath + '/postlogin')

        }).catch(err => {

          if (err.status === 404) {

            req.flash('emailError', err.message)
            req.flash('body', req.body)
            res.redirect(req.filepath)

          } else {

            return next(err)

          }

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

        throw tokenNotFoundError

      }

      if (tokenObj.expires < Date.now()) {

        let expiredError = new Error('Your token has expired')

        expiredError.status = 400

        expiredError.page = '/expiredtoken'

        throw expiredError

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

        unableToVerifyError = new Error('Unable to verify email please try again')

        throw unableToVerifyError

      }

      return req.app.db('tokens')
        .where('token', req.params.token)
        .del()

    }).then(() => {

      res.render('pages/welcome/emailverification' + req.filepath + '/verify', {
        email: user.email
      })

    }).catch(err => {

      next(err)

    }) 

}