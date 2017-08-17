
exports.init = function(req, res) {

    res.render('pages/login/index', {
      errors: {
        loginErrors: req.flash('loginErrors'),
        formErrors: req.flash('formErrors'),
        alreadyVerified: req.flash('alreadyVerified')
      },
      body: req.flash('body')
    })

}

exports.postlogin = function(req, res) {

	res.render('pages/login/postlogin')

}

exports.verify = function(req, res, next) {

  if (req.user.isVerified) {

    let isVerifiedError = new Error('Your email is already verified')

    isVerifiedError.status = 400

    return next(isVerifiedError)

  }

  return req.app.db('tokens')
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

        return next(expiredError) 

      }

      if (tokenObj.userid !== req.user.id) {

        let tokenMatchError = new Error('Invalid token')

        tokenMatchError.status = 400

        return next(tokenMatchError) 

      }

    }).then(() => {

      return req.app.db('tokens')
        .where('token', req.params.token)
        .del()

    }).then(result => {

      if (!result) {
        return next(new Error('Invalid token'))
      }

    }).then(() => {

      return req.app.db('users')
        .where('email', req.user.email)
        .first()
        .update({ isVerified: 1})

    }).then(result => {

      if (!result) {
        return next(new Error('Unable to verify email please try again'))
      }

      res.render('pages/login/verify', {
        email: req.user.email
      })

    }).catch(err => {

      next(err)

    })	
}
