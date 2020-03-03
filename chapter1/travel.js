var fs = require('fs') 
var path = require('path')
var readfile = require('./readfile')

/**
 * 读取指定目录下所有文件
 * @param {*} dir 指定目录
 * @param {*} callback 回调方法，处理输出
 */
function travel(dir, callback){
    fs.readdirSync(dir).forEach(function(file){
        var pathname = path.join(dir, file);
        if(fs.statSync(pathname).isDirectory()){
            travel(pathname, callback);
        }else{
            callback(pathname);
        }
    });
}

function main(){
    console.log('begin');
    travel('D:/apidoc', function(pathname){
        console.log(pathname);
    });
    var src = './readfile.js';
    var dst = './readfile.js.bak';
    readfile.copy(src,dst);
};

main();
