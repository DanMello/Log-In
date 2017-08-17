
exports = module.exports = function(app, passport, auth) {

    // Home page
    app.get('/', require('./views/pages/home/index').init)

    // Login page which includes a signup forms
    app.get('/login', require('./views/pages/login/index').init)
    app.post('/login', auth.loginValidation, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }))
    app.post('/signup', auth.signupFormValidation, passport.authenticate('local-register', { successRedirect: '/postlogin', failureRedirect: '/login' }))  
    app.get('/postlogin', require('./views/pages/login/index').postlogin)
    app.get('/verification/:token', require('./views/pages/login/index').verify)

}