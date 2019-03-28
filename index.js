var request = require('superagent'),
    jsonTryParse = require('parse-safejson');

function _handleResponse(err, res, resolve, reject){
  if(!res){
    return _rejectWithError(err, reject);
  }

  let parsed = jsonTryParse(res.text);

  if(res.status === 200){
    return resolve(parsed.success ? parsed.res : res.text);
  }

  reject({
    status: res.status,
    res: parsed.res,
    err: parsed.success ? parsed.res.err : ''
  });
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
          .send(options.payload)
          .set(options.headers || {});

      if(options.timeout){
        transaction
          .timeout({
            response: options.timeout
          });
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
