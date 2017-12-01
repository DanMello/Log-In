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

    let passwordToken = {
        token: crypto.randomBytes(16).toString('hex'),
        expires: Date.now() + 86400000,
        type: 'passwordResetToken'
      }

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

          passwordToken.userid = user.id

          return req.app.db('tokens')
            .where({
              userid: user.id,
              type: 'passwordResetToken'
            })
            .first()


        }).then(token => {

          if (token && token.expires > Date.now()) {

            let tokenNotExpiredError = new Error("Your password reset token has not yet expired, please check your email")

            tokenNotExpiredError.status = 400

            throw tokenNotExpiredError

          }

          if (token && token.expires < Date.now()) {

            return req.app.db('tokens')
              .where({
                userid: user.id,
                type: 'passwordResetToken'
              })
              .del()

          }

        }).then(() => {

          return req.app.db('tokens')
            .insert(passwordToken)

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

          res.render('pages/forgot' + req.filepath + 'emailSent')

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

  req.app.db('tokens')
    .where({
      token: req.params.token,
      type: 'passwordResetToken'
    })
    .first()
    .then(token => {

      if (!token) {

        let tokenNotFoundError = new Error('Token not found')

        tokenNotFoundError.status = 404

        throw tokenNotFoundError

      }

      if (token.expires < Date.now()) {

        req.app.db('tokens')
          .where({
            token: token,
            type: 'passwordResetToken'
          })
          .del()

        let tokenExpired = new Error('Password reset token has expired')

        tokenExpired.status = 404

        throw tokenExpired

      }

    }).then(() => {

      res.render('pages/forgot' + req.filepath + 'reset', {
        token: req.params.token,
        passwordErrors: req.flash('formErrors'),
        body: req.flash('body')
      })

    }).catch(err => {

      next(err)

    })
}

exports.resetPassword = function (req, res, next) {

  let userReference = {}
  
  req.app.db('tokens')
    .where({
      token: req.params.token,
      type: 'passwordResetToken'
    })
    .first()
    .then(token => {

      if (!token) {

        let tokenNotFoundError = new Error('Token not found')

        tokenNotFoundError.status = 404

        throw tokenNotFoundError

      }

      if (token.expires < Date.now()) {

        req.app.db('tokens')
          .where({
            token: token,
            type: 'passwordResetToken'
          })
          .del()

        let tokenExpired = new Error('Password reset token has expired')

        tokenExpired.status = 404

        throw tokenExpired

      }

      userReference.userId = token.userid

    }).then(() => {

      req.assert('password', 'Password requires 6 to 20 characters').len(6, 20)
      req.assert('password2', 'Password requires 6 to 20 characters').len(6, 20)
      req.assert('password2', 'Passwords do not match').equals(req.body.password)

      return req.getValidationResult()

    }).then(result => {

      if (!result.isEmpty()) {

        let errorMessage = result.array()[0].msg

        let passwordError = new Error(errorMessage)

        passwordError.redirect = true

        throw passwordError

      }

      return req.app.db('users')
        .where('id', userReference.userId)
        .first()

    }).then(user => {

      if (!user) throw new Error('Something went wrong trying to change password please try again')

      userReference.email = user.email

      return req.app.db('users')
        .where('id', userReference.userId)
        .update({
          password: req.app.bcrypt.hashSync(req.body.password)
        })

    }).then(result => {

      if (!result) {

        let passwordError =  new Error('Something went wrong trying to change password please try again')

        passwordError.status = 500

        throw passwordError

      }

      return req.app.db('tokens')
        .where({
          token: req.params.token,
          type: 'passwordResetToken'
        })
        .del()

      }).then(result => {

        if (!result) {

          console.log("There was a problem deleting password reset token", req.params.token)
        }

        let emailMessage = 
          `Your password has been changed.\n\n
           If this was not you, that means someone else has access to your email.\n\n
           We recomend changing your email password, then chaging your password in our app.\n\n
           However if this you, this email is just to confirm of your password reset.
          `
        return req.app.utility.nodemailer({
          from: '"Dans App" <jdanmello@gmail.com>',
          to: userReference.email,
          subject: 'Your password has been reset',
          message: emailMessage
        })

    }).then(() => {

      res.render('pages/forgot' + req.filepath + 'passwordReset')

    }).catch(err => {

      if (err.redirect) {

        req.flash('formErrors', err.message)
        req.flash('body', req.body)
       
        res.redirect(req.url)

      } else {

        next(err)

      }

    })

}