function checkToken (user) {

  if (!user) {

    let tokenNotFoundError = new Error('Token not found')

    tokenNotFoundError.status = 404

    throw tokenNotFoundError

  }

  if (user.resetPasswordExpires < Date.now()) {

    let tokenExpired = new Error('Password reset token has expired')

    tokenExpired.status = 404

    throw tokenExpired

  }

}

exports.init = function (req, res) {

  res.render('pages/forgot' + req.filepath, {
    formErrors: req.flash('formErrors'),
    body: req.flash('body')
  })

}

exports.forgotAccount = function (req, res, next) {

  req.assert('email', 'Email required*').notEmpty()
  req.assert('email', 'Valid email required*').isEmail()

  req.getValidationResult().then(result => {

    if (!result.isEmpty()) {

      let errors = result.array()[0]

      req.flash('formErrors', errors.msg)
      req.flash('body', req.body)
      res.redirect(req.route.path)

    } else {

	  let crypto = require('crypto')
	  let passwordToken

      return req.app.db('users')
        .where('email', req.body.email)
        .first()
        .then(user => {

          if (!user) {

            let notFoundError =  new Error('There is no account with that email*')

            notFoundError.status = 404

            throw notFoundError

          }

          if (!user.isVerified) {

            let notVerifiedError =  new Error('This email is not verified, you need to verify your email before you can reset your password*')

            notVerifiedError.status = 400

		    notVerifiedError.page = '/notVerified400'

		    notVerifiedError.object = {
		      message: notVerifiedError.message,
		      account: req.body.email
		    }

            throw notVerifiedError

          }

          passwordToken = {
            token: crypto.randomBytes(16).toString('hex'),
            expires: Date.now() + 86400000
          }

          return req.app.db('users')
            .where('email', req.body.email)
            .first()
            .update({
              resetPasswordToken: passwordToken.token,
              resetPasswordExpires: passwordToken.expires
            })

        }).then(result => {

          if (!result) throw new Error('Could not create password token')

          let emailMessage = 
          	`Hello there it seems that you (or someone else) has requested to reset your password.\n\n
          	 If this was you, click the link below to reset your password.\n\n
          	 ${req.protocol}://${req.headers.host}/forgot/${passwordToken.token}\n\n
          	 However if this was not you, ignore this email and your information wont be changed.
          	`
          return req.app.utility.nodemailer({
            from: '"Dans App" <jdanmello@gmail.com>',
            to: req.body.email,
            subject: 'Account reset from Dans App',
            message: emailMessage
          })

        }).then(() => {

          res.render('pages/forgot' + req.filepath + '/emailSent')

        }).catch(err => {

          if (err.status === 404) {

            req.flash('body', req.body)
            req.flash('formErrors', err.message)
            res.redirect(req.route.path)

          } else {

          	return next(err)

          }

        })

    }

  })

}

exports.verify = function (req, res, next) {

  req.app.db('users')
    .where('resetPasswordToken', req.params.token)
    .first()
    .then(user => {

      return checkToken(user)

    }).then(() => {

      res.render('pages/forgot' + req.filepath + '/reset', {
        token: req.params.token,
        passwordErrors: req.flash('formErrors'),
        body: req.flash('body')
      })

    }).catch(err => {

      next(err)

    })
}

exports.resetPassword = function (req, res, next) {

  let userEmail

  req.app.db('users')
    .where('resetPasswordToken', req.params.token)
    .first()
    .then(user => {

      userEmail = user.email

      return checkToken(user)

    }).then(() => {

      req.assert('password', 'Password requires 6 to 20 characters').len(6, 20)
      req.assert('password2', 'Password requires 6 to 20 characters').len(6, 20)
      req.assert('password2', 'Passwords do not match').equals(req.body.password)

      return req.getValidationResult()

    }).then(result => {

      if (!result.isEmpty()) {

        let errors = result.array()[0]

        req.flash('formErrors', errors.msg)
        req.flash('body', req.body)
        res.redirect(req.url)

      }

      return req.app.db('users')
        .where('resetPasswordToken', req.params.token)
        .first()
        .update({
          password: req.app.bcrypt.hashSync(req.body.password),
          resetPasswordToken: null,
          resetPasswordExpires: null
        })

    }).then(result => {

      if (!result) {

        let passwordError =  new Error('Something went wrong trying to change password please try again')

        passwordError.status = 404

        throw passwordError

      }

      let emailMessage = 
        `Your password has been changed.\n\n
         If this was not you, that means someone else has access to your email.\n\n
         We recomend changing your email password, then chaging your password in our app.\n\n
         However if this you, this email is just to confirm of your password reset.
        `
      return req.app.utility.nodemailer({
        from: '"Dans App" <jdanmello@gmail.com>',
        to: userEmail,
        subject: 'Your password has been reset',
        message: emailMessage
      })

    }).then(() => {

      res.render('pages/forgot' + req.filepath + '/passwordReset')

    }).catch(err => {

      next(err)

    })

}