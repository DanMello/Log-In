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

  const base64Data = req.body.imagebase64.replace(/^data:image\/jpeg;base64,/, "")
  const userId = req.user.id
  const type = req.body.type
  const currentPicturePath = req.user[type]
  
  const uuidv4 = require('uuid/v4')
  const filename = uuidv4()
  const path = require("path").resolve('.')
  const fs = require('fs')
  const dir = `${path}/public/images/tmp/${type}/${userId}/`
  const dirWithFile = `${path}/public${currentPicturePath}`

  if (fs.existsSync(dirWithFile)) {
    
    fs.unlinkSync(dirWithFile)

  } else if (!fs.existsSync(dir)) {

    fs.mkdirSync(dir)
  } 

  let file = `${path}/public/images/tmp/${type}/${userId}/${filename}.jpeg`

  fs.writeFile(file, base64Data, 'base64', function(err) {

    if (err) {

      return res.json({error: true, message: "Something went wrong saving your picture please try again"})

    } else {

      req.app.db('users')
        .where('id', userId)
        .first()
        .then(user => {

          if (!user) throw new Error('Something went wrong looking for your profile')

          let pictureType = {}
          let dbStoredPath = `/images/tmp/${type}/${userId}/${filename}.jpeg`

          pictureType[type] = dbStoredPath

          return req.app.db('users')
            .where('id', userId)
            .first()
            .update(pictureType)

      }).then(results => {

        if (!results) throw new Error('Something went wrong trying to upload your picture')

        res.json({
          message: 'Success uploading your picture, refresh your browser to view changes, this might take a few minutes.'
        })

      }).catch(err => {

        res.json({
          error: true,
          message: err.message
        })

      })
    } 

  })
}
  