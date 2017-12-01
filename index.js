 //Dependencies
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const favicon = require('serve-favicon')
const session = require('express-session')
const redisStore = require('connect-redis')(session)
const passport = require('passport')

//Start the app
const app = express()

//Config for the app, env variables
require('dotenv').config()

//Redis session config
app.redisStore = new redisStore()

//Adding bcrypt to the app object so i can use it in create user and reset functions
app.bcrypt = bcrypt

//Exporting config
const Config = require('./config')(app)

app.config = Config

//Database connection
const knex = require("knex")
const knexSetup = require('./knexfile')[Config.enviroment]

app.db = knex(knexSetup)

//Files
const staticAssets = __dirname + '/public'
const faviconPath = __dirname + '/public/favicon.ico'

//App settings
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded(Config.settings.bodyParser))
app.use(express.static(staticAssets))
app.use(favicon(faviconPath))
app.use(expressValidator(Config.validators))
app.use(session(Config.settings.session))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

//Setup passport
require('./passport')(app, passport)

//Setup routes
require('./routes')(app, passport)

//Error handler
app.use(require('./views/pages/http/').errorHandler)

//Utilities
app.utility = {}
app.utility.nodemailer = require('./utils/nodemailer/')

app.listen(3000)