/**
 * 开启子进程示例
 */

var child_process = require('child_process')

/**
 * 运行demo1.js文件
 */
var child = child_process.spawn('node', ['./chapter2/demo1.js']);

child.stdout.on('data', function(data){
    console.log('stderr: ' + data);
});

child.on('close', function(code){
    console.log('child process exited with code ' + code);
});

