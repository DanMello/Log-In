exports = module.exports = function(app) {

  let application = app || {}
  
  let enviroment = process.env.NODE_ENV

  let settings = {
    development: {
      database: {
        client: 'mysql',
        connection: {
          host: '127.0.0.1', // Default local mysql host
          user: 'root', // Put your user for mysql here
          password: 'Mysecurepassword1!', // Put your password for mysql here
          database: 'localdb' // Put your development database name here, for this project
        }
      },
      mobileurl: '10.0.0.189' // This is the ip address on my laptop in my local network, im using as mobile address because i can access it from my iphone and i leave local host as the desktop one 
    },
    production: {
      database: {
        client: 'mysql',
        connection: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME
        }
      },
      mobileurl: 'm.mellocloud.com'
    },
    deployment: {
      apps: [
        {
          name : 'jdanmello.com',
          script : './index.js',
        }
      ],
      deploy: {
        production: {
          user: 'deploy',
          host: '10.0.0.201', // local ip or public ip if im not connect to local connection
          ref: 'origin/master',
          repo: 'https://github.com/DanMello/jdanmello.com.git',
          path: '/home/deploy/jdanmello.com',
          'post-deploy' : 'nvm install && npm install && /home/deploy/.nvm/versions/node/v8.11.3/bin/pm2 reload ecosystem.config.js --env production'
        }
      }
    },
    urlencodedParser: {
      extended: false,
      limit: '1mb'
    },
    jsonParser: {
      limit: '1mb'
    },
    session: {
      store: application.redisStore,
      secret: process.env.SESSION_SECRET || 'developmentSession',
      resave: false,
      saveUninitialized: false
    },
    nodemailer: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'jdanmello@gmail.com', // Your email
        pass: process.env.EMAIL_PASSWORD || 'passwordhere' // You can put password here if you dont want to create a .env file
      }
    }
  }

  let validators = {
    customValidators: {
      notOnlyInt: function (value) {

        return /[a-zA-Z]{1,}/.test(value)
      },
      isName: function (value) {

        return /^[a-zA-Z\s]*$/.test(value)
      }
    }
  }

  return {
    enviroment,
    settings,
    validators
  }

}
