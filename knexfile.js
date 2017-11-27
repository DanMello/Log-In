let config = require ('./config')()

module.exports = {
  development: config.settings.development.database,
  production: config.settings.production.database
}