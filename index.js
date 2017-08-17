//Dependencies
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const favicon = require('serve-favicon')
const session = require('express-session')
const passport = require('passport')

//Start the app
const app = express()

//Database connection
const knex = require("knex")
const config = require("./knexfile")[process.env.NODE_ENV || "development"]

app.db = knex(config)

//Files
const staticAssets = __dirname + '/public'
const faviconPath = __dirname + '/public/favicon.ico'
const validators = require('./authenticationModule')

//App settings
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(staticAssets))
app.use(favicon(faviconPath))
app.use(expressValidator({ customValidators: validators }))
app.use(session({
    secret: "secret phrase",
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())


//setup passport
require('./passport')(app, passport, bcrypt, crypto)

//setup routes
require('./routes')(app, passport, validators)

//Error handler
app.use(require('./views/pages/http/index').http500)

//Utilities
app.utility = {}
app.utility.nodemailer = require('./utils/nodemailer/index')

app.listen(3000)