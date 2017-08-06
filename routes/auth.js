let router = require('express').Router()
let passport = require('passport')

let auth = require("../authenticationModule")

router
    .get('/login', (req, res) => {
      res.render('pages/login', {
        errors: req.flash('errors'),
        body: req.flash('body')
      })
    })
    .get('/loginerror', (req, res) => {
      res.send('error')
    })
    .post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/loginerror'
    }))
    .get('/signup', (req, res) => {
      res.render('signup')
    })
    .post('/signup', auth.signupFormValidation,
      passport.authenticate('local-register', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))

module.exports = router
