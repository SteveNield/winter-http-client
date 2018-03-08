var request = require('superagent'),
    jsonTryParse = require('parse-safejson');

function _handleResponse(err, res, resolve, reject){
  if(!res){
    return reject({
      status: 500,
      error: err
    });
  }

  var response = jsonTryParse(res.text);
  if(!response.success){
    reject({
      status: res.status,
      res: response.res,
      error: response.err
    });
  } else {
    resolve(response.res);
  }
}

function _rejectWithError(err, reject){
  reject({
    err:err,
    status:500
  });
}

function _applyAuth(transaction, auth){
  if(auth.token){
    return transaction
      .set('x-access-token', auth.token);
  }

  if(auth.basic){
    return transaction
      .auth(auth.basic.username, auth.basic.password);
  }

  return transaction;
}

function _performRequest(method, options){
  return new Promise(function(resolve,reject){
    try{
      var transaction = method(options.uri)
          .query(options.query || {})
          .send(options.payload);

      if(options.timeout){
        transaction
          .timeout({
            response: options.timeout
          })
      }

      if(options.auth){
        transaction = _applyAuth(transaction, options.auth);
      }

      transaction
        .end(function(err, res){
          _handleResponse(err, res, resolve, reject);
        });
    } catch(err) {
      _rejectWithError(err, reject);
    }
  });
}

module.exports.get = function(options){
  return _performRequest(request.get, options);
};

module.exports.put = function(options){
  return _performRequest(request.put, options);
}

module.exports.post = function(options){
  return _performRequest(request.post, options);
}

module.exports.delete = function(options){
  return _performRequest(request.delete, options);
}
