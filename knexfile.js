module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "Mysecurepassword1!",
      database: "localdb"
    }
  },
  test: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "Mysecurepassword1!",
      database: "testdb"
    }
  },
  production: {
    client: "mysql",
    connection: {
      host: "10.0.0.181",
      user: "deploy",
      password: 'Mysecurepassword2!',
      database: "productiondb"
    }
  }
}