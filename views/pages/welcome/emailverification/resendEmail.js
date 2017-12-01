exports.init = function(req, res) {

  res.render('pages/welcome/emailverification' + req.filepath + 'resendEmail', {
    error: req.flash('emailError'),
    body: req.flash('body')
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

      return req.app.db('users')
        .where('email', req.body.email)
        .first()
        .then(user => {

          if (!user) {

            let userNotfound = new Error('There is no account with that email*')

            userNotfound.status = 404

            throw userNotfound

          }

          if (user.isVerified) {

            let userVerified = new Error('That email is already verified*')

            userVerified.status = 400

            throw userVerified

          }

          return require('./').sendVerificationEmail(req, user)

        }).then(() => {

          res.render('pages/welcome' + req.filepath + 'resentEmail', {
            email: req.body.email
          })

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