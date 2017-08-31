
exports.init = function(req, res, next) {

  res.render('pages/home/index', {
    fullname: req.user.fullname
  })

}