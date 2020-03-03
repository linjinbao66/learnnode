var http = require('http')
var options = {
    hostname: 'localhost',
        port: 8080,
        path: '/upload',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
};

var request = http.request(options, function(response){})
request.write('hello ');
request.end;