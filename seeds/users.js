
exports.seed = function (knex, Promise) {

  let bcrypt = require('bcrypt-nodejs')
  let password = bcrypt.hashSync('test')

  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {id: 1, fullname: 'Dan Mello', username: 'danV', email: 'jdanmello@gmail.com', isVerified: 1, password},
        {id: 2, fullname: 'Dan Mello', username: 'danU', email: 'jdanmello@gmail.com', isVerified: 0, password}
      ])
    })
}

//This just creates two users using the same email one which is already verified and one who is not to test the email functions

