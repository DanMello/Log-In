exports.init = function (req, res, next) {

  req.app.db('users')
    .where('username', req.params.username)
    .first()
    .then(user => {

      let page = {}
      let myAccount

      if (!user) throw new Error('User not found.')
      if (!!req.user) {

        page.username = req.user.username
        page.imgurl = req.user.profilepic || '/images/default.png'

        if (req.user.id === user.id) {
          
          page.header = 'verifiedHeader'
          page.profileView = 'profile/myProfile'
          page.createPosts = 'profile/postsModule'
          myAccount = true

        } else {
          
          page.header = 'verifiedHeader'
          page.profileView = 'profile/viewProfile'
          myAccount = false
        }

      } else {

        page.header = 'profile/signupHeader'
        page.profileView = 'profile/viewProfile'
        myAccount = false
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
        myAccount
      })
      
    }).catch(err => {

      next(err)

    })

}