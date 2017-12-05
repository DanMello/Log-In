exports.init = function (req, res, next) {

  req.app.db('users')
    .where('username', req.params.username)
    .first()
    .then(user => {

      if (!user) throw new Error('User not found.')

      res.render('pages/profile' + req.filepath, {
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        imgurl: user.profilepic || '/images/default.png'
      })
      
    }).catch(err => {

      next(err)

    })

}