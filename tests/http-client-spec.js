require('winter-test-setup');

var HttpClient = require('./../index'),
    Config = require('./config'),
    AssertPromise = require('winter-assert-promise');

const TEST_HOST = 'http://localhost:'+Config.port;

describe('HttpClient', function(){
  var server;

  before(function(){
    server = require('./test-server');
  })

  after(function(){
    server.close();
  })

  describe('when endpoint returns a 200 and no message', function(){
    it('returns a status 200 and no message', function(done){
      AssertPromise(HttpClient.get, { uri: TEST_HOST+'/ok' }, function(res){
        res.should.equal('OK');
      }, done);
    })
  })

  describe('when endpoint returns a 200 and a message', function(){
    it('returns a status 200 and a message', function(done){
      AssertPromise(HttpClient.get, { uri: TEST_HOST+'/message' }, function(res){
        res.should.deep.equal({ message: 'hey there' });
      }, done);
    })
  })

  function testFailStatus(endpoint, expectedStatus, err){
    describe('when endpoint returns a '+expectedStatus+(!err?'':' and an error'), function(){
      it('returns a status '+expectedStatus, function(done){
        HttpClient.get({ uri: TEST_HOST+endpoint }).then(function(){
          done('Expected error')
        }, function(res){
          res.status.should.equal(expectedStatus);
          if(err){
            res.err.should.equal(err);
          }
          done();
        });
      })
    })
  }

  testFailStatus('/notfound', 404);
  testFailStatus('/badrequest', 400);
  testFailStatus('/badrequesterr', 400, 'InvalidToken');
  testFailStatus('/servererror', 500);
  testFailStatus('/servererrorwitherr', 500, 'There was a massive disaster');
})
