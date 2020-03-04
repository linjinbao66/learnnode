/**
 * 模块引入
 */
var fs = require('fs'),
    path = require('path'),
    http = require('http');


var MIME = {
    '.css':'text/css',
    '.js':'application/javascript'
}

/**
 * @description 文件拼接函数
 * @param {路径名称} pathnames 
 * @param {回调函数} callback 
 */
function combileFiles(pathnames, callback){
    var output = [];
    /**
     * 闭包函数
     * 从0开始，到pathnames.len截至 处理url中出现的文件数量
     */
    (function next(i, len){
        if(i<len){
            fs.readFile(pathnames[i], function(err, data){
                if(err){
                    callback(err)
                }else{
                    output.push(data);  //读到output中
                    next(i+1, len);     //递归调用
                }
            });
        }else{
            callback(null, Buffer.concat(output));  //Buffer.concat(output)最终会赋值到data
        }
    })(0, pathnames.length);

}

function main(argv){
    var config = JSON.parse(fs.readFileSync(argv[0], 'utf-8')),
        root = config.root || '.',
        port = config.port || 80;

    http.createServer(function(request, response){
        var urlInfo = parseURL(root, request.url);
        console.log('urlInfo = ' + urlInfo.pathnames)
        console.log('urlInfo = ' + urlInfo.mime)
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

/**
 * @description url解析
 * @param {根目录} root 
 * @param {*} url 
 * @returns mime 文件的扩展名
 * @returns pathnames 路径名称 pathnames = servercopy.js,server.js
 */
function parseURL(root, url) {
    var base, pathnames, parts;

    if (url.indexOf('??') === -1) {
        url = url.replace('/', '/??');  //替换
    }

    parts = url.split('??');    //切割
    base = parts[0];
    pathnames = parts[1].split(',').map(function (value) {
        return path.join(root, base, value);
    });
    console.log('pathnames = ' + pathnames)

    return {
        //path.extname返回path路径文件扩展名
        mime: MIME[path.extname(pathnames[0])] || 'text/plain',
        pathnames: pathnames
    };
}

/**
 * 入口
 */
main(process.argv.slice(2));

/**
 * 回调的理解：
 * 1. 程序进入main方法
 * ...
 * 2. combileFiles(urlInfo.pathnames, function(err, data) 这一行调用combileFiles函数，并传入两个参数，
 * 第二个参数是一个函数类型，并且该函数类型需要两个形参err,和data
 * 3. combileFiles(pathnames, callback) 函数需要两个参数，第二个是一个回调函数，即callback是调用combileFiles
 * 时调用者提供的，此处调用者是http.createServer，提供的callback是function(err, data)
 * 4. callback(null, Buffer.concat(output));参数null赋值给function(err, data)中的err,Buffer.concat(output)
 * 赋值给function(err, data)中的data
 * 5. 至此http.createServer取到了需要返回的数据放在data中，response.end(data);返回data数据
 */