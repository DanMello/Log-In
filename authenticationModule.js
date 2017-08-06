module.exports = {
  signupFormValidation: function(req, res, next) {

    req.assert('fullname', 'Name can only contain letters').isAlpha()
    req.assert('fullname', 'Name required').notEmpty()
    req.assert('userid', 'Username cannot only contain numbers').notOnlyInt()
    req.assert('userid', 'Username can only contain letters and numbers').isAlphanumeric()
    req.assert('userid', 'Username required').notEmpty()
    req.assert('username', 'Valid email required').isEmail()
    req.assert('username', 'Email required').notEmpty()
    req.assert('password', 'Password requires 6 to 20 characters').len(6, 20)

    req.getValidationResult().then(function(result) {

      if (!result.isEmpty()) {

        let errors = result.mapped()

        req.flash('errors', errors)
        req.flash('body', req.body)
        res.redirect('/login')

      } else {

        next()

      }
    })
  }
}