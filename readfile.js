var fs = require('fs')

function main(argv){
	fs.stat(argv[0], function(errm, stats){
		var size = stats.size;		
		console.log('文件的大小为：' + size);
		if(size>1024*1024*10){
			console.log("文件过大， 使用大文件读写方法");
			copyBig(argv[0], argv[1]);
		}else{
			console.log("文件正常大小");
			copy(argv[0], argv[1]);
		}
	})
}

/**
 * 函数入口
 * main方法作为当前文件默认执行入口,会在文件调用时候立即执行
 */

 main(process.argv.slice(2))

 /**
  * 匿名函数，理论上可以用作构造方法使用，由于其立即执行特性
  */
(function(){
	console.log('kinjb')
})()


/**
 * 小文件读写
 * @param {*} src 源文件
 * @param {*} dst 目标文件夹
 */
function copy(src, dst){
	fs.writeFileSync(dst, fs.readFileSync(src));
}

/**
 * 大文件读写
 */
function copyBig(src, dst){
	fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

module.exports = {
	copy,
	copyBig
}