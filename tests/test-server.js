var Express = require('express'),
    Config = require('./config');

var app = new Express();

app.get('/ok', function(req,res){
  res.sendStatus(200);
});

app.get('/message', function(req,res){
  res.status(200).json({
    message: 'hey there'
  })
})

app.get('/badrequest', function(req,res){
  res.sendStatus(400);
})

app.get('/badrequesterr', function(req,res){
  res.status(400).json({
    err: 'InvalidToken'
  })
})

app.get('/servererror', function(req,res){
  res.sendStatus(500);
})

app.get('/servererrorwitherr', function(req,res){
  res.status(500).json({
    err: 'There was a massive disaster'
  });
})

module.exports = app.listen(Config.port, function(){
  console.log('listening')
})
