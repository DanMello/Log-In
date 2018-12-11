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
        page.imgurl = req.user.profilepic || '/images/defaults/default.png'

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
        profilepic: user.profilepic || '/images/defaults/default.png',
        coverphoto: user.coverphoto || '/images/defaults/defaultcover.jpeg',
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

exports.uploadTmpPicture = function (req, res, next) {
  
  const formidable = require('formidable')
  const form = new formidable.IncomingForm()
  const path = require("path").resolve('.')
  const jimp = require('jimp')

  form.parse(req, function (err, fields, files) {

    if (err) {

      res.json({
        error: true,
        message: err
      })

    } else {

      let fileObject = Object.keys(files).reduce((newObject, key) => {

        newObject.path = files[key].path

        return newObject

      }, {})

      let newPath = `${path}/public/images${fileObject.path}.jpeg`

      jimp.read(fileObject.path).then(file => {

        file.exifRotate().write(newPath)
        
        return

      }).then(() => {

        res.json({
          tmpPath: `/images${fileObject.path}.jpeg`
        })

      }).catch(err => {

        res.json({
          error: true,
          message: err
        })
      })
    } 
  })
}

exports.cropAndSave = function (req, res, next) {

  const userId = req.user.id
  const type = req.body.type
  const currentPicturePath = req.user[type]
  
  const uuidv4 = require('uuid/v4')
  const filename = uuidv4()
  const path = require("path").resolve('.')
  const fs = require('fs')
  const jimp = require("jimp")
  const dir = `${path}/public/images/${type}/${userId}/`
  const dirWithFile = `${path}/public${currentPicturePath}`

  if (fs.existsSync(dirWithFile)) {
    
    fs.unlinkSync(dirWithFile)

  } else if (!fs.existsSync(dir)) {

    fs.mkdirSync(dir)
  }

  const croppedPicture = `${path}/public${req.body.src}`
  const newPath = `${path}/public/images/${type}/${userId}/${filename}.jpeg`

  jimp.read(croppedPicture).then(file => {

    let top = parseInt(req.body.top)
    let left = parseInt(req.body.left)

    let absoluteTop = Math.abs(top)
    let absoluteLeft = Math.abs(left)

    file
      .resize(req.body.width, req.body.height)
      .crop(absoluteLeft, absoluteTop, req.body.containerWidth, req.body.containerHeight)
      .write(newPath)
    
    return

  }).then(() => {

    return req.app.db('users')
      .where('id', userId)
      .first()
      
  }).then(user => {

    if (!user) throw new Error('Something went wrong looking for your profile')

    let pictureType = {}
    let dbStoredPath = `/images/${type}/${userId}/${filename}.jpeg`

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

exports.cropAndReturn = function (req, res, next) {

  const path = require('path').resolve('.')
  const jimp = require('jimp')
  const uuidv4 = require('uuid/v4')
  const filename = uuidv4()

  const croppedPicture = `${path}/public${req.body.src}`
  const newPath = `${path}/public/images/tmp/${filename}.jpeg`

  jimp.read(croppedPicture).then(file => {

    let top = parseInt(req.body.top)
    let left = parseInt(req.body.left)

    let absoluteTop = Math.abs(top)
    let absoluteLeft = Math.abs(left)

    file
      .resize(req.body.width, req.body.height)
      .crop(absoluteLeft, absoluteTop, req.body.containerWidth, req.body.containerHeight)
      .write(newPath)

    return 

  }).then(() => {

    res.json({
      src: `/images/tmp/${filename}.jpeg`
    })

  }).catch(err => {

    res.json({
      error: true,
      message: err
    })
  })
}


exports.uploadPicsOrVids = function (req, res, next) {

  const formidable = require('formidable')
  const path = require("path").resolve('.')
  const jimp = require("jimp")
  const fs = require('fs')
  const uuidv4 = require('uuid/v4')
  const imgDir = `${path}/public/images`
  const spawn = require('child_process').spawn

  const form = new formidable.IncomingForm()

  form.parse(req, function (err, fields, files) {

    if (err) {

      res.json({
        error: true,
        message: err
      })

    } else {

      let filesInfo = Object.keys(files).map(key => {

        return new Promise((resolve, reject) => {

          let obj = {} 
          let cmd
          let args

          let fileExtention = files[key].name.split('.').pop()
          let filename = uuidv4()

          if (fileExtention.toUpperCase() === 'MOV' || fileExtention.toUpperCase() === 'MP4') {

            obj.newVideoFile = `${imgDir}/tmp/${filename}.mp4`
            obj.publicPath = `/images/tmp/${filename}.mp4`
            obj.name = files[key].name
            obj.newName = `${filename}.mp4`
            obj.type = 'video'

            if (fileExtention.toUpperCase() === 'MOV') {

              cmd = 'ffmpeg'
              args = ['-i',files[key].path,'-vcodec','copy','-acodec','copy',obj.newVideoFile]

            } else if (fileExtention.toUpperCase() === 'MP4') {

              cmd = 'mv'
              args = [files[key].path,obj.newVideoFile]
            }

            let command = spawn(cmd, args)

            command.on('error', function (err) {

              reject(err)
            })

            command.on('close', function () {

              resolve(obj)
            })

          } else if (fileExtention.toUpperCase() === 'JPG' || fileExtention.toUpperCase() === 'JPEG' || fileExtention.toUpperCase() === 'PNG') {

            obj.newPictureFile = `${imgDir}/tmp/${filename}.jpeg`
            obj.publicPath = `/images/tmp/${filename}.jpeg`
            obj.name = files[key].name
            obj.newName = `${filename}.jpeg`
            obj.type = 'image'

            jimp.read(files[key].path).then(image => {

              image.exifRotate().write(obj.newPictureFile)

              return

            }).then(() => {

              resolve(obj)
              
            }).catch(err => {

              reject(err)
            })

          } else {

            reject('One or more files are invalid, valid file types include: [Videos: .MP4, .MOV], [Pictures: .JPG, .JPEG, .PNG]')
          }
        })
      })

      Promise.all(filesInfo).then(results => {

        console.log(results)

        res.json({
          message: 'Files uploaded successfully',
          files: results
        })

      }).catch(err => {

        res.json({
          error: true,
          message: err
        })
      })
    }
  })
}

exports.trimVideoInfo = function (req, res, next) {

  const path = require("path").resolve('.')
  const uuidv4 = require('uuid/v4')
  const filename = uuidv4()
  const tempDir = `${path}/public/images/tmp/`
  const currentVideo = tempDir + req.body.clipName

  const newTrimmedVideo = tempDir + filename + '.mp4'
  const trimmedVideoPublic = '/images/tmp/' + filename + '.mp4'

  const startTime = req.body.startTime
  const trimTime = req.body.endTime - req.body.startTime

  const cmd = 'ffmpeg'
  const args = [
    '-ss',
    startTime,
    '-i',
    currentVideo,
    '-t',
    trimTime,
    '-c:v',
    'libx264',
    '-c:a',
    'aac',
    '-strict',
    'experimental',
    '-b:a',
    '128k',
    newTrimmedVideo
  ]

  res.json({
    cmd,
    args,
    trimmedVideoPublic
  })

  // -c:v libx264 -c:a aac -strict experimental -b:a 128k out.mp4
}

exports.trimVideo = function (req, res, next) {

  const spawn = require('child_process').spawn

  const command = spawn(req.body.cmd, req.body.args)

  command.stderr.on('data', function(data) {

    console.log('data', data)
  })

  command.on('close', function(code) {
      
    console.log('Done: ' + code)

    res.json({
      url: req.body.url,
      loader: req.body.loader
    })
  })

  // -c:v libx264 -c:a aac -strict experimental -b:a 128k out.mp4
}

// ffmpeg -i a.ogg -ss 00:01:02.500 -t 00:01:03.250 -c copy x2.ogg


// ffmpeg -i in.ts -filter_complex \
// "[0:v]trim=duration=30[a]; \
//  [0:v]trim=start=40:end=50,setpts=PTS-STARTPTS[b]; \
//  [a][b]concat[c]; \
//  [0:v]trim=start=80,setpts=PTS-STARTPTS[d]; \
//  [c][d]concat[out1]" -map [out1] out.ts

  //slow very accurate
  // const args = [
  //   '-ss',
  //   startTime,
  //   '-i',
  //   currentVideo,
  //   '-t',
  //   trimTime,
  //   '-c:v',
  //   'libx264',
  //   '-c:a',
  //   'aac',
  //   '-strict',
  //   'experimental',
  //   '-b:a',
  //   '128k',
  //   newTrimmedVideo,
  //   '-loglevel', 'error'
  // ]

  //fast not accurate
  // const args = [
  //   '-ss',
  //   startTime,
  //   '-i',
  //   currentVideo,
  //   '-t',
  //   trimTime,
  //   '-vcodec',
  //   'copy',
  //   '-acodec',
  //   'copy',
  //   newTrimmedVideo
  // ]