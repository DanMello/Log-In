
exports.init = function(req, res, next) {

  res.render('pages/home' + req.filepath, {
    fullname: req.user.fullname
  })

}