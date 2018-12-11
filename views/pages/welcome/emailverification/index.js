exports.sendVerificationEmail = function(req, user, done) {

  let crypto = require('crypto')

  let emailToken = {
    userid: user.id,
    token: crypto.randomBytes(16).toString('hex'),
    expires: Date.now() + 86400000,
    type: 'verifcationEmail'
  }

  return req.app.db('tokens')
    .where({
      userid: user.id,
      type: 'verifcationEmail'
    })
    .first()
    .then(token => {

      if (token && token.expires > Date.now()) {

        let tokenNotExpiredError = new Error("Your token has not yet expired, please check your email")

        tokenNotExpiredError.status = 400

        throw tokenNotExpiredError

      }

      if (token && token.expires < Date.now()) {

        return req.app.db('tokens')
          .where({
            userid: user.id,
            type: 'verifcationEmail'
          })
          .del()
      }

    }).then(() => {

      return req.app.db('tokens')
        .insert(emailToken)

    }).then(() => {

      let emailMessage = 
        `Hello, please verify your account by clicking the link\n\n
         ${req.protocol}://${req.headers.host}/account/verification/${emailToken.token}\n\n
        `
      return req.app.utility.nodemailer({
        from: '"Dans App" <jdanmello@gmail.com>',
        to: user.email,
        subject: 'Account verification from Dans App',
        message: emailMessage
      })

    }).catch(err => {

      throw err
    })
}


exports.verify = function(req, res, next) {

  let user

  req.app.db('tokens')
    .where({
      token: req.params.token,
      type: 'verifcationEmail'
    })
    .first()
    .then(tokenObj => {

      if (!tokenObj) {

        let tokenNotFoundError = new Error('Token not found')

        tokenNotFoundError.status = 400

        throw tokenNotFoundError

      }

      if (tokenObj.expires < Date.now()) {

        let expiredError = new Error('Your token has expired')

        expiredError.status = 400

        expiredError.page = '/expiredtoken'

        throw expiredError
      }

      if (!req.user) {

        return req.app.db('users')
          .where('id', tokenObj.userid)
          .first()

      } else {

        return req.user
      }

    }).then(userReference => {

      user = userReference

      return req.app.db('users')
        .where('id', user.id)
        .first()
        .update({ 
          isVerified: 1,
          tempVerificationExpires: null
        })

    }).then(verifiedUser => {

      if (!verifiedUser) {

        unableToVerifyError = new Error('Unable to verify email please try again')

        throw unableToVerifyError

      }

      return req.app.db('tokens')
        .where('token', req.params.token)
        .del()

    }).then(() => {

      res.render('pages/welcome/emailverification' + req.filepath + 'verify', {
        email: user.email
      })

    }).catch(err => {

      next(err)
    }) 
}