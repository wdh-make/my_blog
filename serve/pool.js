// 引入mysql模块
const mysql=require('mysql');
// 创建连接池对象
const pool=mysql.createPool({
    host:'数据库地址', //数据库地址
    port:'3306',//端口号
    user:'用户名', //用户名
    password:'*****', //密码
    database:'数据库名称',//数据库名称
    connectionLimit:20
});
//导出连接池对象
module.exports=pool;
