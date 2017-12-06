
exports.init = function(req, res, next) {

  req.app.db('users')
    .where('id', req.user.id)
    .first()
    .then(user => {

      if (!user) throw new Error('User not found.')

      let userObj = {
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        profilepic: user.profilepic || '/images/default.png',
        coverphoto: user.coverphoto || '/images/defaultcover.jpeg',
        about: {
          github: user.githublink,
          location: user.location
        }
      }

      res.render('pages/home' + req.filepath, {
        userObj,
        page: {
          username: userObj.username,
          imgurl: userObj.profilepic
        }
      })
      
    }).catch(err => {

      next(err)

    })

}