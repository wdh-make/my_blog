// 引入express模块
const express = require("express");
//引入连接池模块
const pool = require("../pool.js");
// 创建路由器对象
const router = express.Router();

// 引入文件接收
const formidable = require("formidable");
// var fs = require("fs");
var path = require("path");
var url = require("url");

// 添加模块下的所有路由

//图片访问
router.get( '/upload/*' , function (req, res) {
    let fileUrl = path.join(__dirname + '/../static')
    res.sendFile(fileUrl + decodeURI(req.url));
    // console.log( "Request for " + url + " received." );
})

// 导出路由器
module.exports = router;
