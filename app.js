var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('hello world');
})

app.listen(3000,function(){
	console.log('Example app listening on port 3000');
})

app.post('/hello', function(req, res){
	res.send('POST request allowed')
})

app.get('/ab*cd', function(req, res){
	res.send('abcd')
})
