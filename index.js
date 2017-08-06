const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const expressValidator = require('express-validator')
const flash = require("connect-flash")
const passport = require('passport')
const favicon = require('serve-favicon')

const faviconPath = __dirname + "/public/favicon.ico"
const authRoute = require('./routes/auth')
const db = require('./db')
require('./passport')

express()
    .set('view engine', 'ejs')
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: false}))
    .use(expressValidator({
        customValidators: {
            notOnlyInt: function(value) {
                return /[a-zA-Z]{1,}/.test(value)
            }
        }
    }))
    .use(favicon(faviconPath))
    .use(session({
        secret: "secret phrase",
        resave: false,
        saveUninitialized: false
    }))
    .use(flash())
    .use(passport.initialize())
    .use(passport.session())
    .use(authRoute)
    .get('/', (req, res, next) => {
        
        db('users')
          .then((users) => {

            res.render('pages/index', {
                users
            })
            
          })

        console.log("request received")
        
    })
    .listen(3000)