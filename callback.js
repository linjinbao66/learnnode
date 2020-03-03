/**
 * NodeJS异步编程-回调
 */

 /**
  * @description 函数定义
  * @param {*调用次数} n 
  * @param {回调方法} callback 
  */
 function heavyCompute(n, callback){
     var count = 0, i, j;

     for(i = n; i>0; i--){
         for(j = n; j>0; j--){
             count += 1;
         }
     }
     callback(count);
 }

 /**
  * @description 函数调用
  */
heavyCompute(1000, function(count){
    console.log(count);
})
 

console.log('end')