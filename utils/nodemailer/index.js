const nodemailer = require('nodemailer')

exports.transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'jdanmello@gmail.com',
    pass: 'Mello321'
  }
})
