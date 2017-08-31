module.exports = {
  apps : [
    {
      name      : 'nodejs-app',
      script    : 'index.js',
      env_production : {
        NODE_ENV: 'production',
        MOBILE_HOST: 'm.dansapp.com'
      }
    }
  ],
  deploy : {
    production : {
      user : 'deploy',
      host : '172.16.60.133',
      ref  : 'origin/master',
      repo : 'https://github.com/DanMello/first-nodejs-project-login-page.git',
      path : '/home/deploy/web/nodejs-app',
      'post-deploy' : 'nvm install && npm install && /home/deploy/.nvm/versions/node/v6.11.1/bin/pm2 reload ecosystem.config.js --env production'
    }
  }
}
