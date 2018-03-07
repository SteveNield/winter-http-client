var HttpClient = require('./index.js');

HttpClient
  .post({
    uri: 'http://192.168.1.82:18082/json_rpc',
    payload: {"jsonrpc":"2.0","id":"0","method":"getbalance"},
    timeout: 1
  })
  .then(console.log, console.log);
