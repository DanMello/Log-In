exports.init = function (req, res) {

  console.log(req.route.path)

  res.render('pages/login' + req.filepath, {
    loginErrors: req.flash('loginErrors'),
    body: req.flash('body')
  })

}

exports.login = function (req, res, next) {

  req.assert('username', 'Username or email required*').notEmpty()
  req.assert('password', 'Password required*').notEmpty()

  req.getValidationResult().then(result => {

    if (!result.isEmpty()) {

      let error = result.array()[0]

      req.flash('loginErrors', error.msg)
      req.flash('body', req.body)
      res.redirect(req.route.path)

    } else {

      req._passport.instance.authenticate('local', {
        successRedirect: '/',
        failureRedirect: req.route.path
      })(req, res,next)

    }

  })

}
