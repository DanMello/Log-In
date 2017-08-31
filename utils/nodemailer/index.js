
exports = module.exports = function(next, options) {
  
  const nodemailer = require('nodemailer')

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'jdanmello@gmail.com',
      pass: 'Mello321'
    }
  })

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