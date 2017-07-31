const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const favicon = require('serve-favicon')
const staticAssets = __dirname + '/public'
const faviconPath = __dirname + "/public/favicon.ico"
const knex = require('knex')

const db = knex({
    client: 'mysql',
    connection: {
        host: '172.16.60.134',
        user: 'deploy',
        password: 'test',
        database: 'nodejs_app',
    }
})

express()
    .set('view engine', 'ejs')
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: false}))
    .use(express.static(staticAssets))
    .use(favicon(faviconPath))
    .get('/', (req, res, next) => {

        db('users').then((users) => {
            res.send(users)
        })
        .catch((error) => {
            res.send(error)
        })

        console.log("request received")
        
    })
    .get('/static', (req, res, next) => {
        res.render('pages/index')
    })
    .listen(3000)