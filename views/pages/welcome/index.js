exports.init = function (req, res) {

  if (req.filepath === '/mobile/') {

    return res.redirect('/alternate/login')

  }

  res.render('pages/welcome', {
    errors: {
      loginErrors: req.flash('loginErrors'),
      formErrors: req.flash('formErrors'),
      alreadyVerified: req.flash('alreadyVerified')
    },
    body: req.flash('body')
  })

}

exports.skipVerification = function (req, res, next) {

  req.app.db('users')
    .where('id', req.user.id)
    .first()
    .then(user => {

      if (user.tempVerificationExpires > Date.now()) {

        let tempVerificationError = new Error('Your temporary verification has not yet expired')

        tempVerificationError.status = 400

        throw tempVerificationError

      }

      return req.app.db('users')
        .where('id', req.user.id)
        .first()
        .update({
          tempVerificationExpires: Date.now() + 86400000
        })

    }).then(result => {
    
      if (!result) throw new Error('Could not create temporay token')

      res.redirect('/')

    }).catch(err => {
    
      next(err)
      
    })
}