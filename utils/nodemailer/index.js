
exports = module.exports = function(next, options) {
  
  const Config = require('../../config')
  const nodemailer = require('nodemailer')

  let transporter = nodemailer.createTransport(Config.get('default')['nodemailer'])

  let emailMessage = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.message
  }

  transporter.sendMail(emailMessage, (err, info) => {

  	if (err) throw err

  })

}