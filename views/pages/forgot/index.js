exports.init = function (req, res) {

  res.render('pages/forgot' + req.filepath, {
    formErrors: req.flash('formErrors'),
    body: req.flash('body')
  })

}

exports.forgotAccount = function (req, res) {

  req.assert('username', 'Email required*').notEmpty()
  req.assert('username', 'Valid email required*').isEmail()

  req.getValidationResult().then(result => {

    if (!result.isEmpty()) {

      let errors = result.array()[0]

      req.flash('formErrors', errors.msg)
      req.flash('body', req.body)
      res.redirect(req.route.path)

    }

  })

}