exports.init = function (req, res) {

  if (req.filepath === '/mobile') {

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

exports.postLogin = function(req, res) {

  res.render('pages/welcome' + req.filepath + '/postlogin')

}