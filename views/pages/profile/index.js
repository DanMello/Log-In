exports.init = function (req, res, next) {

  req.app.db('users')
    .where('username', req.params.username)
    .first()
    .then(user => {

      let page = {}

      if (!user) throw new Error('User not found.')
      if (!!req.user) {

        page.username = req.user.username
        page.imgurl = req.user.profilepic || '/images/default.png'

        if (req.user.id === user.id) {
          
          page.header = 'verifiedHeader'
          page.profileView = 'profile/myProfile'

        } else {
          
          page.header = 'verifiedHeader'
          page.profileView = 'profile/viewProfile'
        }

      } else {

        page.header = 'profile/signupHeader'
        page.profileView = 'profile/viewProfile'
      }

      let userObj = {
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        profilepic: user.profilepic || '/images/default.png',
        coverphoto: user.coverphoto || '/images/defaultcover.jpeg',
        information: [
          { 
            github: {
              link: user.githublink,
              username: user.githubusername
            }
          },
          { 
            location: user.location
          }
        ]
      }

      res.render('pages/profile' + req.filepath, {
        userObj,
        page,
      })
      
    }).catch(err => {

      next(err)

    })

}