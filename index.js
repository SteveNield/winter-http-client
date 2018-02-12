var request = require('superagent'),
    jsonTryParse = require('parse-safejson');

function readResponse(res){
  return jsonTryParse(res.text);
}

function handleResponse(err, res, resolve, reject){
  if(err)
    reject({
      status: (res) ? res.status : 500,
      res: res !== undefined ? readResponse(res) : null,
      error: err
    });
  else{
    resolve(readResponse(res));
  }
}

function rejectWithError(err, reject){
  reject({
    err:err,
    status:500
  });
}

function tokenise(transaction, token){
  if(!token)
    return transaction;

  return transaction
    .set('x-access-token', token);
}

module.exports.get = function(uri, query, token){
  return new Promise(function(resolve,reject){
    try{
      var transaction =
        request
          .get(uri)
          .query(query || {});

      transaction = tokenise(transaction, token);

      transaction
        .end(function(err, res){
          handleResponse(err, res, resolve, reject);
        });
    } catch(err) {
      rejectWithError(err, reject);
    }
  });
};

module.exports.put = function(uri, payload, token){
  return new Promise(function(resolve, reject){
    try{
      var transaction =
        request
          .put(uri)
          .send(payload);

      transaction = tokenise(transaction, token);

      transaction
        .end(function(err, res){
          handleResponse(err, res, resolve, reject);
        })
    } catch(err){
      rejectWithError(err, reject);
    }
  })
}

module.exports.post = function(uri, body){
  return new Promise(function(resolve, reject){
    try{
      var transaction = request
        .post(uri)
        .send(body);

    transaction = tokenise(transaction, token);

    transaction
        .end(function(err, res){
          handleResponse(err, res, resolve, reject);
        })
    } catch(err){
      rejectWithError(err, reject);
    }
  })
}

module.exports.delete = function(uri){
  return new Promise(function(resolve,reject){
    try{
      var transaction = request
        .delete(uri);

      transaction = tokenise(transaction, token);

      transaction
        .end(function(err, res){
          handleResponse(err, res, resolve, reject);
        });
    } catch(err) {
      rejectWithError(err, reject);
    }
  });
}