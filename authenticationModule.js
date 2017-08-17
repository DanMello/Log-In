module.exports = {
  notOnlyInt: function(value) {
    return /[a-zA-Z]{1,}/.test(value)
  }, 
  isName: function(value) {
    return /^[a-zA-Z\s]*$/.test(value)
  },
  loginValidation: function(req, res, next) {

    req.assert('username', 'Username or email required*').notEmpty()
    req.assert('password', 'Password required*').notEmpty()

    req.getValidationResult().then(function(result) {

      if (!result.isEmpty()) {

        let error = result.array()[0]

        req.flash('loginErrors', error.msg)
        req.flash('body', req.body) // Info user passed in, so we can send it back to the form 
        res.redirect('/login')

      } else {

        next()

      }

    })

  },
  signupFormValidation: function(req, res, next) {

    req.assert('fullname', 'Name can only contain letters').isName()
    req.assert('fullname', 'Name required').notEmpty()
    req.assert('userid', 'Username cannot only contain numbers').notOnlyInt()
    req.assert('userid', 'Username can only contain letters and numbers').isAlphanumeric()
    req.assert('userid', 'Username required').notEmpty()
    req.assert('username', 'Valid email required').isEmail()
    req.assert('username', 'Email required').notEmpty()
    req.assert('password', 'Password requires 6 to 20 characters').len(6, 20)

    req.sanitize('fullname').trim()

    req.getValidationResult().then(function(result) {

      if (!result.isEmpty()) {

        let errors = result.mapped()

        req.flash('formErrors', errors)
        req.flash('body', req.body) // Info user passed in, so we can send it back to the form 
        res.redirect('/login')

      } else {

        next()

      }

    })
  }
}