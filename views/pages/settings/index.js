exports.init = function (req, res, next) {

  req.app.db('users')
    .where('id', req.user.id)
    .first()
    .then(user => {

      if (!user) {
        
        throw new Error('Invalid request')
        
      } else {

        let userObj = {
          fullname: user.fullname,
          email: user.email,
          username: user.username,
          profilepic: user.profilepic || '/images/default.png',
          coverphoto: user.coverphoto || '/images/defaultcover.jpeg',
          github: { 
            link: user.githublink, 
            username: user.githubusername
          },
          location: user.location
        }

          res.render('pages/settings' + req.filepath, {
          userObj,
          page: {
            username: userObj.username,
            imgurl: userObj.profilepic
          }
        })

      }

    }).catch(err => {

      next(err)

    })
}

exports.changeEmail = function (req, res, next) {

  let crypto = require('crypto')

  let changeEmailToken = {
    userid: req.user.id,
    token: crypto.randomBytes(16).toString('hex'),
    expires: Date.now() + 86400000,
    type: 'changeEmail'
  }

  req.app.db('users')
    .where('id', req.user.id)
    .first()
    .then(user => {

      if (!user) throw new Error('Your profile was not found')
      if (!user.isVerified) throw new Error('Your email is not verified, you must verify your email before you can change it.')
      if (user.email === req.body.email) throw new Error('Please enter an email different than your current one.')
      if (!req.app.bcrypt.compareSync(req.body.password, user.password)) throw new Error('The password you entered does not match our records.')

      return req.app.db('tokens')
        .where({
          userid: req.user.id,
          type: 'changeEmail'
        })
        .first()

    }).then(token => {

      if (token && token.expires > Date.now()) throw new Error('You have already requested a token. Check your new email, you can request another token in 24 hours')
      if (token && token.expires < Date.now()) {
        
        return req.app.db('tokens')
          .where({
            userid: req.user.id,
            type: 'changeEmail'
          })
          .del()

      } else {

        return true
      }

    }).then(result => {

      if (!result) throw new Error('Something went wrong please try again')

      return req.app.db('tokens')
        .insert(changeEmailToken)

    }).then(result => {

      if (!result) throw new Error('Something went wrong please try again')

      let emailMessage = 
        `Hello there it seems you have requested to changes your email to this one.\n\n
         To confirm this change, please click the following link \n\n
         ${req.protocol}://${req.headers.host}/account/settings/changeEmail/${req.body.email}/${changeEmailToken.token}\n\n
        `
      return req.app.utility.nodemailer({
        from: '"Dans App" <jdanmello@gmail.com>',
        to: req.body.email,
        subject: 'Change Email Dans App',
        message: emailMessage
      })

    }).then(() => {

      res.json({
        success: true, 
        message: 
          `<h2>Success!</h2> <br> We have sent an email to <span style="font-style: italic; font-weight: bold">${req.body.email}</span> with further instructions. <br> Please confirm your new email or changes will not be applied`
      })

    }).catch(err => {

      res.json({ error: true, message: err.message })

    })

}

exports.verify = function (req, res, next) {

  req.app.db('tokens')
    .where({
      token: req.params.token,
      type: 'changeEmail'
    })
    .first()
    .then(token => {

      if (!token) throw new Error('Token not found')
      if (token && token.expires < Date.now()) throw new Error('Your token has expired')

      return req.app.db('users')
        .where('id', token.userid)
        .update({
          email: req.params.email
        })

    }).then(result => {

      if (!result) throw new Error('Something went wrong trying to update your email please try again')

      return req.app.db('tokens')
        .where({
          token: req.params.token,
          type: 'changeEmail'
        })
        .del()

    }).then(result => {

      if (!result) console.log('Error deleting token', req.params.token, 'type: changeEmail')

      res.render('pages/emails' + req.filepath + 'emailChanged', {
        email: req.params.email
      })

    }).catch(err => {

      next(err)

    })

}

exports.changeUserName = function (req, res, next) {

  req.assert('username', 'Username required').notEmpty()
  req.assert('username', 'Username can only contain letters and numbers').isAlphanumeric()
  req.assert('username', 'Username cannot only contain numbers').notOnlyInt()

  req.getValidationResult().then(result => {

    if (!result.isEmpty()) {

      let errors = result.array()[0]

      res.json({
        error: true,
        message: errors.msg
      })

    } else {

      req.app.db('users')
        .where('username', req.body.username)
        .first()
        .then(user => {

          if (user) throw new Error('That username is not available')

          return req.app.db('users')
            .where('id', req.user.id)
            .first()

        }).then(user => {

          if (!req.app.bcrypt.compareSync(req.body.password, user.password)) throw new Error('The password you entered does not match our records.')

          return req.app.db('users')
            .where('id', req.user.id)
            .first()
            .update({
              username: req.body.username
            })

        }).then(result => {

          if (!result) throw new Error('Something went wrong trying to update your username, please try again')

          res.json({
            success: true,
            message: `<h2>Success!</h2> <br> Congrats your username has been updated to <span style="font-style: italic; font-weight: bold">${req.body.username}</span>, your webpage will refresh in 5 seconds.` 
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

exports.changePassword = function (req, res, next) {

  req.assert('currentpassword', 'Password requires 6 to 20 characters').len(6, 20)
  req.assert('passwordValueOne', 'Password requires 6 to 20 characters').len(6, 20)
  req.assert('passwordValueTwo', 'Password requires 6 to 20 characters').len(6, 20)
  req.assert('passwordValueTwo', 'New Passwords do not match').equals(req.body.passwordValueOne)

  req.getValidationResult().then(result => {

    if (!result.isEmpty()) {

      let errors = result.array()[0]

      res.json({
        error: true,
        message: errors.msg
      })

    } else {

      req.app.db('users')
        .where('id', req.user.id)
        .first()
        .then(user => {

          if (!user) throw new Error('Something went wrong, we could not find your account')
          if (!req.app.bcrypt.compareSync(req.body.currentpassword, user.password)) throw new Error('The current password you entered does not match our records.')
          if (req.app.bcrypt.compareSync(req.body.passwordValueOne, user.password)) throw new Error('Please use a different password than your current one.')

          return req.app.db('users')
            .where('id', req.user.id)
            .first()
            .update({
              password: req.app.bcrypt.hashSync(req.body.passwordValueOne)
            })

        }).then(result => {

          if (!result) throw new Error('Something went wrong trying to update your password, please try again')

          res.json({
            success: true,
            message: `<h2>Success!</h2> <br> Congrats your password has been updated, your webpage will refresh in 5 seconds.` 
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

exports.addGithubAccount = function (req, res, next) {

  req.assert('githubUsername', 'Github username cannot be empty.').notEmpty()
  req.assert('githubLink', 'Link cannot be empty.').notEmpty()
  req.assert('password', 'Password required.').notEmpty()

  req.getValidationResult().then(result => {

    if (!result.isEmpty()) {

      let errors = result.array()[0]

      res.json({
        error: true,
        message: errors.msg
      })

    } else {

      req.app.db('users')
        .where('id', req.user.id)
        .first()
        .then(user => {

          if (!user) throw new Error('Something went wrong, we could not find your account')
          if (!req.app.bcrypt.compareSync(req.body.password, user.password)) throw new Error('The current password you entered does not match our records.')

          return req.app.db('users')
            .where('id', req.user.id)
            .first()
            .update({
              githubusername: req.body.githubUsername,
              githublink: req.body.githubLink
            })

        }).then(result => {

          if (!result) throw new Error('Something went wrong trying to update your github info, please try again')

          res.json({
            success: true,
            message: `<h2>Success!</h2> <br> Congrats your Github info has been updated, your webpage will refresh in 5 seconds.` 
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

exports.addLocation = function (req, res, next) {

  req.assert('location', 'Location cannot be empty.').notEmpty()
  req.assert('password', 'Password required.').notEmpty()

  req.getValidationResult().then(result => {

    if (!result.isEmpty()) {

      let errors = result.array()[0]

      res.json({
        error: true,
        message: errors.msg
      })

    } else {

      req.app.db('users')
        .where('id', req.user.id)
        .first()
        .then(user => {

          if (!user) throw new Error('Something went wrong, we could not find your account')
          if (!req.app.bcrypt.compareSync(req.body.password, user.password)) throw new Error('The current password you entered does not match our records.')

          return req.app.db('users')
            .where('id', req.user.id)
            .first()
            .update({
              location: req.body.location
            })

        }).then(result => {

          if (!result) throw new Error('Something went wrong trying to update your location, please try again')

          res.json({
            success: true,
            message: `<h2>Success!</h2> <br> Congrats your Location has been updated, your webpage will refresh in 5 seconds.` 
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

