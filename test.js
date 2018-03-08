var HttpClient = require('./index.js');

HttpClient
  .post({
    uri: 'http://192.168.1.76:8232',
    payload: {"jsonrpc":"2.0","id":"0","method":"getbalance"},
    timeout: 2000,
    auth: {
      basic: {
        username: "username",
        password: "password"
      }
    }
  })
  .then(console.log, console.log);
