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

//config for the app, env variables
require('dotenv').config()

const Config = require('./config')

app.config = Config

//Database connection
const knex = require("knex")
const knexSetup = Config.get(Config.enviroment)['database']

app.db = knex(knexSetup)

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
require('./passport')(app, passport, bcrypt)

//setup routes
require('./routes')(app, passport, validators)

//Error handler
app.use(require('./views/pages/http/index').errorHandler)

//Utilities
app.utility = {}
app.utility.nodemailer = require('./utils/nodemailer/index')

app.listen(3000)