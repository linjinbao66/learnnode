var fs = require('fs');
var path = require('path');
var http = require('http');

var MIME = {
    '.css':'text/css',
    '.js':'application/javascript'
}

/**
 * 
 * @param {路径名称} pathnames 
 * @param {回调函数} callback 
 */
function combileFiles(pathnames, callback){
    var output = [];

    /**
     * 闭包函数
     */
    (function next(i, len){
        if(i<len){
            fs.readFile(pathnames[i], function(err, data){
                if(err){
                    callback(err)
                }else{
                    output.push(data);
                    next(i+1, len);
                }
            });
        }else{
            callback(null, Buffer.concat(output));
        }
    })(0, pathnames.len);

}

function main(argv){
    var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8')),
        root = config.root || '.',
        port = config.port || 80;

    http.createServer(function(request, response){
        var urlInfo = parseURL(root, request.url);

        combileFiles(urlInfo.pathnames, function(err, data){
            if(err){
                response.writeHead(404);
                response.end(err.message);
            }else{
                response.writeHead(200,{
                    'Content-Type':urlInfo.mime
                });
                response.end(data);
            }
        })

    }).listen(port)
    
}

function parseURL(root, url) {
    var base, pathnames, parts;

    if (url.indexOf('??') === -1) {
        url = url.replace('/', '/??');
    }

    parts = url.split('??');
    base = parts[0];
    pathnames = parts[1].split(',').map(function (value) {
        return path.join(root, base, value);
    });

    return {
        mime: MIME[path.extname(pathnames[0])] || 'text/plain',
        pathnames: pathnames
    };
}

/**
 * 入口
 */
main(process.argv.slice(2));
