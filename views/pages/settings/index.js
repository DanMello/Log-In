exports.init = function (req, res, next) {
  
  res.render('pages/settings' + req.filepath, {
    username: req.user.username,
    email: req.user.email,
    imgurl: req.user.profilepic || '/images/default.png'
  })

}

exports.changeEmail = function (req, res, next) {

  let crypto = require('crypto')

  let emailToken = {
    userid: user.id,
    token: crypto.randomBytes(16).toString('hex'),
    expires: Date.now() + 86400000
  }

  req.app.db('users')
    .where('id', req.user.id)
    .first()
    .then(user => {

      if (!user) return res.json({ error: true, message: 'Your profile was not found'})
      if (!user.isVerified) return res.json({ error: true, message: 'Your email is not verified, you must verify your email before you can change it.'})
      if (user.email === req.body.email) return res.json({ error: true, message: 'Please enter an email different than your current one.'})


    })

  res.json({
    response: 'ok'
  })

}