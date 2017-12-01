
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE TABLE users (
      id int(11) NOT NULL AUTO_INCREMENT,
      fullname varchar(255) DEFAULT NULL,
      username varchar(255) DEFAULT NULL,
      email varchar(255) DEFAULT NULL,
      isVerified tinyint(1) NOT NULL DEFAULT '0',
      tempVerificationExpires varchar(255) DEFAULT NULL,
      password varchar(255) DEFAULT NULL,
      oauth_provider varchar(255) DEFAULT NULL,
      oauth_id varchar(255) DEFAULT NULL,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1
  `)
}

exports.down = function(knex, Promise) {

  return knex.schema.dropTable("users")
}
