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
      res: reponse.res,
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

      if(options.auth && options.auth.token){
        transaction
          .set('x-access-token', options.auth.token);
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
