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

      console.log(err)

      next(err)

    })

}

exports.uploadPicture = function (req, res, next) {

  return new Promise((resolve, reject) => {

    console.log(req.body.type)

    const base64Data = req.body.imagebase64.replace(/^data:image\/jpeg;base64,/, "")
    
    const uuidv4 = require('uuid/v4')
    const filename = uuidv4()
    const path = require("path").resolve('.')
    const fs = require('fs')
    const dir = `${path}/public/images/tmp/${req.body.type}/${req.user.id}/`

    if (!fs.existsSync(dir)) fs.mkdirSync(dir)

    let file = `${path}/public/images/tmp/${req.body.type}/${req.user.id}/${filename}.jpeg`
    let dbStoredPath = `/images/tmp/${req.body.type}/${req.user.id}/${filename}.jpeg`

    fs.writeFile(file, base64Data, 'base64', function(err) {

      if (err) res.json({error: true, message: "Something went wrong saving your picture please try again"})
      
      return req.app.db('users')
        .where('id', req.user.id)
        .first()
        .then(user => {

          if (!user) throw new Error('Something went wrong looking for your profile')

          let pictureType = {}

          pictureType[req.body.type] = dbStoredPath

          console.log(req.body.type)

          return req.app.db('users')
            .where('id', req.user.id)
            .first()
            .update(pictureType)
        })

    })
    
  }).catch(err => {

    console.log(err)
  })
  
}