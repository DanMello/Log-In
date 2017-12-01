exports.init = function (req, res) {
  
  res.render('pages/profile' + req.filepath, {
    fullname: req.user.fullname,
    username: req.user.username,
    imgurl: req.user.profilepic || '/images/default.png'
  })

}