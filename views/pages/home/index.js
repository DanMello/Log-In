
exports.init = function(req, res, next) {
  
  if (!req.isAuthenticated()) {

    return res.redirect('/login')

  } else {

    res.render('pages/home/index', {
      fullname: req.user.fullname
    })

  }

}