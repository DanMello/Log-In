let config = require ('./config')()

module.exports = {
  apps: config.settings.deployment.apps,
  deploy: config.settings.deployment.deploy
}