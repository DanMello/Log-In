const enviroment = process.env.NODE_ENV || 'development'

const config = {
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
    mobileurl: '10.0.0.178:3000' // This is the ip of the vmware nginx server in my local network, i made port 3000 redirect to mobile because I dont have a domain and its just a project
  },
  default: {
    nodemailer: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'jdanmello@gmail.com', // Your email
        pass: process.env.EMAIL_PASSWORD || 'passwordhere' // You can put password here if you dont want to create a .env file
      }
    },
    session: {
      secret: "secret phrase",
      resave: false,
      saveUninitialized: false
    }
  }
}

exports.enviroment = enviroment

exports.get = function (property) {

  return config[property]
}

/*Example

const Config = require(./config)

Config.get('enviroment')[property]

 or

Config.get(Config.enviroment)[property]

*/
