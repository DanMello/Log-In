const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const favicon = require('serve-favicon')
const faviconPath = __dirname + "/public/nodejs.ico"

express()
    .set('view engine', 'ejs')
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: false}))
    .use(favicon(faviconPath))
    .get('/', (req, res, next) => {

        res.render('pages/index')

        console.log("request received")
        
    })
    .listen(3000)