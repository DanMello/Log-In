module.exports = {
  apps : [
    {
      name      : 'nodejs-app',
      script    : 'index.js',
      env_production : {
        NODE_ENV: 'production',
        MOBILE_HOST: '10.0.0.178:3000' // Here i would put the sub domain for mobile version
      }
    }
  ],
  deploy : {
    production : {
      user : 'deploy',
      host : '10.0.0.169', //Host is the web server
      ref  : 'origin/master',
      repo : 'https://github.com/DanMello/first-nodejs-project-login-page.git',
      path : '/home/deploy/web/nodejs-app',
      'post-deploy' : 'nvm install && npm install && /home/deploy/.nvm/versions/node/v6.11.1/bin/pm2 reload ecosystem.config.js --env production'
    }
  }
}
