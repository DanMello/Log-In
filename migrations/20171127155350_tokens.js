
exports.up = function(knex, Promise) {
  return knex.raw(`
    CREATE TABLE tokens (
      userid int(11) NOT NULL,
      token varchar(255) DEFAULT NULL,
      expires varchar(255) DEFAULT NULL,
      KEY fk_user_id (userid),
      CONSTRAINT fk_user_id FOREIGN KEY (userid) REFERENCES users (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1
  `)
}

exports.down = function(knex, Promise) {
  
  return knex.schema.dropTable("tokens")
}
