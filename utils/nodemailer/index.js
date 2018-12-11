exports = module.exports = function(options) {

  let config = require('../../config')()

  let nodemailer = require('nodemailer')
  let transporter = nodemailer.createTransport(config.settings.nodemailer)

  let emailMessage = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.message
  }

  return new Promise((resolve, reject) => {

    transporter.sendMail(emailMessage, (err, info) => {

      if (err) {

        reject(err)

      } else {

        resolve()
      }
    })
  })
}