// 引入express模块
const express = require("express");
//引入连接池模块
const pool = require("../pool.js");
// 创建路由器对象
const router = express.Router();

const { throws } = require("assert");

const { Console } = require("console");
const dayjs = require("dayjs");
const url = require("url");

// 引入文件接收
const formidable = require("formidable");
var fs = require("fs");
var path = require("path");
const { createDirsSync } = require("../utils");
//导入配置文件
const setting = require("../setting");
//导入 token 校验文件
const verify = require("../verify");

//导入excel
var nodeExcel = require("excel-export");

// 添加模块下的所有路由

// 保存/编辑文章
router.post("/saveArticle", async (req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header]);
  if (!token) {
    return res.send({
      status: -1,
      msg: "token失效，请重新登录！",
    });
  }
  let params = req.body;
  // console.log(params);
  let createDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
  let updateDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
  let sql = "";
  let data = [];
  let successMsg = "";
  let errMsg = "";
  if (params.id) {
    successMsg = "文章编辑成功！";
    errMsg = "文章编辑失败！";
    sql =
      "UPDATE `article` SET `title`=?,`subtitle`=?,`content`=?,`updateDate`=?,`releaseTime`=?,`status`=?,`editor`=?,`type`=? WHERE id = ?";
    data = [
      params.title,
      params.subtitle,
      params.content,
      updateDate,
      updateDate,
      params.status,
      token.data.name,
      params.type,
      params.id,
    ];
  } else {
    successMsg = "文章添加成功！";
    errMsg = "文章添加失败！";
    sql =
      "INSERT INTO article ( title, subtitle, content, createDate, releaseTime, status, author, type) VALUES (?,?,?,?,?,?,?,?)";
    data = [
      params.title,
      params.subtitle,
      params.content,
      createDate,
      createDate,
      params.status,
      token.data.name,
      params.type,
    ];
  }

  pool.query(sql, data, function (err, result) {
    if (err) {
      console.log(err);
      return res.send({
        status: -1,
        msg: errMsg,
      });
    }
    if (result.affectedRows == 1) {
      return res.send({
        status: 1,
        msg: successMsg,
        // data: data
      });
    } else {
      return res.send({
        status: -1,
        msg: errMsg,
        // data: data
      });
    }
  });
});
//删除文章（逻辑删除）
router.post("/delArticle", async (req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header]);
  if (!token) {
    return res.send({
      status: -1,
      msg: "token失效，请重新登录！",
    });
  }
  let params = req.body;
  let sql = "UPDATE `article` SET `valid`=? WHERE id = ?";
  let data = [0, params.id];
  pool.query(sql, data, function (err, result) {
    if (err) {
      // console.log(err);
      return res.send({
        status: -1,
        msg: "文章删除失败！",
      });
    }
    if (result.affectedRows == 1) {
      return res.send({
        status: 1,
        msg: "文章删除成功！",
        // data: data
      });
    } else {
      return res.send({
        status: -1,
        msg: "文章删除失败！",
        // data: data
      });
    }
  });
});
//查找全部文章
router.get("/articleAll", async (req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify
    .getToken(headers[setting.token.header])
    .catch(() => {});
  let params = url.parse(req.url, true);
  // console.log(params)
  var oldPageNum = params.query.pageNum ? Number(params.query.pageNum) : 1;
  var pageSize = params.query.pageSize ? Number(params.query.pageSize) : 10;
  var pageNum = (oldPageNum - 1) * pageSize;
  var type = params.query.type || "";

  var sql1 =
    "select COUNT(id) from article where valid = ? and status = ? and (type = ? or ? = '')";
  let data1 = [1, 1, type, type];
  var sql2 =
    "select id,author,title,subtitle,content,type,type_name as typeName,createDate,updateDate from article a left join article_type b on a.type=b.type_id where valid = ? and status = ? and (type = ? or ? = '') ORDER BY releaseTime desc limit ?,? ";
  let data2 = [1, 1, type, type, pageNum, pageSize];
  if (token) {
    sql1 =
      "select COUNT(id) from article where valid = ? and (type = ? or ? = '')";
    data1 = [1, type, type];
    sql2 =
      "select id,author,title,subtitle,content,type,type_name as typeName,createDate,updateDate from article a left join article_type b on a.type=b.type_id where valid = ? and (type = ? or ? = '')  ORDER BY releaseTime desc limit ?,? ";
    data2 = [1, type, type, pageNum, pageSize];
  }
  pool.query(sql1, data1, function (err, result) {
    if (err) {
      return res.send({
        status: -1,
        msg: err,
      });
    }
    let total = 0;
    // console.log(result)

    if (result) {
      total = result[0]["COUNT(id)"];
    }
    pool.query(sql2, data2, function (err, result) {
      if (err) throw err;

      var data = result;
      return res.send({
        status: 1,
        msg: "查询成功",
        result: data,
        total: total,
        pageNum: oldPageNum,
        pageSize: pageSize,
      });
    });
  });
});
//查找文章 id
router.get("/articleId", async (req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify
    .getToken(headers[setting.token.header])
    .catch(() => {});
  let params = url.parse(req.url, true);
  // console.log(params.query);
  var sql = "select * from article where id = ? and valid = ? and status = ?";
  let data = [params.query.id, 1, 1];
  if (token) {
    sql = "select * from article where id = ? and valid = ? ";
    data = [params.query.id, 1];
  }
  pool.query(sql, data, function (err, result) {
    //   console.log(result)
    if (err) throw err;
    var data = result[0];
    if (data) {
      return res.send({
        status: 1,
        msg: "查询成功",
        result: data,
      });
    } else {
      return res.send({
        status: -1,
        msg: "此id无效",
        result: [],
      });
    }
  });
  //文章浏览量
  var ip =
    req.headers["x-real-ip"] ||
    req.headers["x-wq-realip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  // console.log(ip)
  let cResult = await check_ip(ip);
  if (cResult.length == 0) {
  }
});

//文章类型
router.get("/articleType", async (req, res) => {
  // let params = url.parse(req.url, true);
  let sql = "select type_id as id, type_name as label from article_type";
  pool.query(sql, [], (err, result) => {
    if (err) throw err;
    return res.send({
      status: 1,
      msg: "查询成功",
      result: result,
    });
  });
});

//点赞
router.post("/like", async (req, res) => {
  let params = req.body;
  var ip =
    req.headers["x-real-ip"] ||
    req.headers["x-wq-realip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  // console.log(ip)
  let cResult = await check_ip(ip);
  // console.log(cResult)
  if (cResult.length == 0) {
    let aResult = await add_ip(ip, params.isLike).catch((err) => {
      return res.send({
        status: -1,
        msg: "点赞失败，请从新操作！",
      });
    });
    if (aResult.affectedRows == 1) {
      let count = await getCount();
      return res.send({
        status: 1,
        msg: "点赞成功！",
        result: {
          count: count,
        },
      });
    } else {
      return res.send({
        status: -1,
        msg: "点赞失败，请从新操作！",
      });
    }
  } else {
    let uResult = await update_ip(ip, params.isLike).catch((err) => {
      return res.send({
        status: -1,
        msg: "点赞失败，请从新操作！",
      });
    });
    if (uResult.affectedRows == 1) {
      let count = await getCount();
      return res.send({
        status: 1,
        msg: "点赞成功！",
        result: {
          count: count,
        },
      });
    } else {
      return res.send({
        status: -1,
        msg: "点赞失败，请从新操作！",
      });
    }
  }
  // let sql1 = "select id from user_ip where ip = ? limit ?";
  // let data1 = [ip, 1];
  // pool.query(sql1, data1, (err, result) => {
  //   if (err) throw err;
  //   if (result.length == 0) {
  //     let sql2 = "INSERT INTO user_ip ( ip, isLike) VALUES (?,?)";
  //     let data2 = [ip, params.isLike];
  //     pool.query(sql2, data2, async (err, result) => {
  //       if (err) {
  //         return res.send({
  //           status: -1,
  //           msg: "点赞失败，请从新操作！",
  //         });
  //       }
  //       if (result.affectedRows == 1) {
  //         let count = await getCount();
  //         return res.send({
  //           status: 1,
  //           msg: "点赞成功！",
  //           result: {
  //             count: count,
  //           },
  //         });
  //       } else {
  //         return res.send({
  //           status: -1,
  //           msg: "点赞失败，请从新操作！",
  //           // data: data
  //         });
  //       }
  //     });
  //   } else {
  //     let sql3 = "UPDATE `user_ip` SET `isLike`=? WHERE ip = ?";
  //     let data3 = [params.isLike, ip];
  //     pool.query(sql3, data3, async (err, result) => {
  //       if (err) {
  //         // console.log(err);
  //         return res.send({
  //           status: -1,
  //           msg: "点赞失败，请重新操作！",
  //         });
  //       }
  //       if (result.affectedRows == 1) {
  //         let count = await getCount();
  //         return res.send({
  //           status: 1,
  //           msg: "点赞成功！",
  //           result: {
  //             count,
  //           },
  //         });
  //       } else {
  //         return res.send({
  //           status: -1,
  //           msg: "点赞失败，请重新操作！",
  //           // data: data
  //         });
  //       }
  //     });
  //   }
  // });
});
//判断ip是否存在方法
function check_ip(ip) {
  return new Promise((resolve, reject) => {
    let sql = "select id, isLike, article_id from user_ip where ip = ? limit ?";
    let data = [ip, 1];
    pool.query(sql, data, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}
//添加ip方法
function add_ip(ip, isLike) {
  return new Promise((resolve, reject) => {
    let createDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
    let sql = "INSERT INTO user_ip ( ip, isLike, createDate) VALUES (?,?,?)";
    pool.query(sql, [ip, isLike, createDate], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}
//跟新ip方法
function update_ip(ip, isLike = "", article_id = "") {
  return new Promise((resolve, reject) => {
    let updateDate = dayjs().format("YYYY-MM-DD HH:mm:ss");
    let sql =
      "UPDATE `user_ip` SET `isLike`=?,`updateDate`=?,`article_id`=? WHERE ip = ?";
    let data = [];
    if (isLike == "" && article_id != "") {
      data = [updateDate, article_id, ip];
    } else if (article_id == "" && isLike != "") {
      data = [updateDate, ip];
    } else if (article_id == "" && isLike == "") {
      data = [ip];
    } else {
      data = [isLike, updateDate, article_id, ip];
    }
    pool.query(sql, data, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}
//查询数量方法
function getCount() {
  return new Promise((resolve, reject) => {
    let sql = "select COUNT(id) from user_ip where isLike = ?";
    pool.query(sql, [1], (err, result) => {
      if (err) {
        reject(err);
      }
      let total = 0;
      if (result) {
        total = result[0]["COUNT(id)"];
      }
      resolve(total);
    });
  });
}

//查询数量
router.get("/like_count", async (req, res) => {
  var ip =
    req.headers["x-real-ip"] ||
    req.headers["x-wq-realip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  console.log(ip);
  let isLike = false;
  let cResult = await check_ip(ip);
  if (cResult.length == 0) {
    await add_ip(ip, 0);
  } else {
    isLike = cResult[0].isLike ? true : false;
  }
  let count = await getCount();
  return res.send({
    status: 1,
    msg: "查询成功！",
    result: {
      count: count,
      isLike,
    },
  });
});

// 上传文件
router.post("/upload", async (req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header]);
  if (!token) {
    return res.send({
      status: -1,
      msg: "token失效，请重新登录！",
    });
  }
  const uploadUrl = path.join(__dirname + "/../static/upload/");
  var date = dayjs().format("YYYY/MM/DD");
  var dar = uploadUrl + date;
  createDirsSync(dar, "/", (t) => {
    if (t != true) {
      return res.send({
        status: -1,
        msg: "上传失败！",
      });
    }
    var form = new formidable.IncomingForm();
    form.encoding = "utf-8";
    form.uploadDir = dar;
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 20 * 1024 * 1024; //默认200 * 1024 * 1024（200mb）；限制上传文件的大小。
    //处理图片
    form.parse(req, function (err, fields, files) {
      console.log(files.file.originalFilename);
      console.log(files);
      var filename = files.file.originalFilename;
      var nameArray = filename.split(".");
      var type = nameArray[nameArray.length - 1];
      var name = "";
      for (var i = 0; i < nameArray.length - 1; i++) {
        name = name + nameArray[i];
      }
      var time = dayjs();
      var avatarName = name + "_" + time + "." + type;
      var newPath = path.join(form.uploadDir + "/" + avatarName);
      fs.renameSync(files.file.filepath, newPath); //重命名

      res.send({
        status: 1,
        msg: "上传成功",
        result: {
          fileName: date + "/" + avatarName,
        },
      });
    });
  });
});

// -------------------------------------------------------------------------------------------------------------------
// 菜单
router.post("/menus", async (req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header]);
  if (!token) {
    return res.send({
      status: -1,
      msg: "token失效，请重新登录！",
    });
  }
  var params = req.body;
  //   var sql = "SELECT * FROM menus_api as api LEFT JOIN memus as main ON main.menus_id = api.menus_id WHERE main.menus_id is not null";
  var sql = "SELECT * FROM `menus`";
  //   console.log(params);
  pool.query(sql, [], function (err, result) {
    if (err) throw err;

    // var data = JSON.parse(JSON.stringify(result));
    return res.send({
      status: 1,
      msg: "获取菜单列表成功",
      data: result,
    });
  });
});

// 查询角色列表
router.post("/getRolesList", async (req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header]);
  if (!token) {
    return res.send({
      status: -1,
      msg: "token失效，请重新登录！",
    });
  }
  var params = req.body;
  // console.log(params);
  pool.query(
    "select * from roles  ORDER BY id desc",
    [],
    function (err, result) {
      if (err) throw err;
      return res.send({
        status: 1,
        msg: "查询成功",
        data: result,
      });
    }
  );
});

//导出excel
router.post("/downloadExcel", async (req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header]);
  if (!token) {
    return res.send({
      status: -1,
      msg: "token失效，请重新登录！",
    });
  }
  var conf = {}; //创建一个写入格式map，其中cols(表头)，rows(每一行的数据);
  var cols = [
    "学号",
    "姓名",
    "年龄",
    "性别",
    "电话",
    "课程",
    "老师",
    "剩余课时",
    "总课时",
    "年级",
    "学校",
    "更新时间",
    "创建时间",
    "添加人员",
    "是否有效",
  ]; //手动创建表头中的内容
  conf.cols = []; //在conf中添加cols
  let fileName = "students"; //下载文件名
  conf.name = "students"; //这里标识在excel底部的表名
  for (var i = 0; i < cols.length; i++) {
    var tits = {}; //创建表头数据所对应的类型,其中包括 caption内容 type类型
    tits.caption = cols[i]; //添加内容
    tits.type = "string"; //添加对应类型，这类型对应数据库中的类型，入number，data但一般导出的都是转换为string类型的
    conf.cols.push(tits); //将每一个表头加入cols中
  }
  var sql = "select * from students";
  pool.query(sql, [], (err, result) => {
    if (err) {
      return res.send({
        status: -1,
        msg: "导出excel失败",
      });
    }
    let data = result;
    var rows = [
      "studentId",
      "studentName",
      "age",
      "gender",
      "phone",
      "className",
      "teacherName",
      "surplusClassTime",
      "allClassTime",
      "grade",
      "school",
      "updateDate",
      "createDate",
      "addPeople",
      "valid",
    ]; //创建一个和表头对应且名称与数据库字段对应数据，便于循环取出数据
    //创建一个和表头对应且名称与数据库字段对应数据，便于循环取出数据
    var datas = []; //用于承载数据库中的数据
    for (var i = 0; i < data.length; i++) {
      //循环数据库得到的数据，因为取出的数据格式为
      //[{'id':2312,'name':'张三','age':'22','sex':'男','banji':'高三一班'},{…………},{…………}]
      var row = []; //用来装载每次得到的数据
      for (var j = 0; j < rows.length; j++) {
        //内循环取出每个
        if (rows[j] == "gender") {
          data[i][rows[j]] = data[i][rows[j]] == 1 ? "男" : "女";
        }
        row.push(data[i][rows[j]].toString()); //或者tow.push((data[i].tows[j]).toString());两种形式都是相同的
      }
      datas.push(row); //将每一个{ }中的数据添加到承载中
    }
    conf.rows = datas; //将所有行加入tows中
    var excel = nodeExcel.execute(conf); //将所有数据写入nodeExcel中
    console.log(excel);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats;charset=utf-8"
    ); //设置响应头
    res.setHeader(
      "Content-Disposition",
      "attachment;filename=" + fileName + ".xlsx"
    ); //设置下载文件命名
    res.end(excel, "binary"); //将文件内容传入
    // return res.send({
    //     status:1,
    //     data: excel,
    //     mgs:""
    // })
  });
});

// //about下
// //厨师查询
// router.get('/about',(req,res)=>{
//     pool.query('select *from cook',(err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     });
// });
// //index下
// //菜单-午餐晚餐数据查询
// router.get('/index',(req,res)=>{
//     var time=new Date();
// 	var week=time.getDay();
// 	// console.log(week);
//     pool.query('select *from menu limit ?,6',[(week)*6],(err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     });
// });
// //菜单-今日特价数据查询
// router.get('/index1',(req,res)=>{
//     var time=new Date();
// 	var week=time.getDay();
// 	// console.log(week);
//     pool.query('select *from menu limit ?,3',[(week)*3],(err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     });
// });

// //menu下
// //菜单-主菜数据查询
// // router.get('/menu1',(req,res)=>{
// //     // var n=req.body;
// //     // console.log(n);
// //     pool.query('select *from menu where mtype="主菜" limit 0,6',(err,result)=>{
// //         if(err) throw err;
// //         res.send(result);
// //     });
// // });
// //menu下
// //菜单-主菜数据查询
// router.post('/menu2',(req,res)=>{
//     var n=parseInt(req.body.xh);
//     // console.log(n);
//     pool.query('select *from menu where mtype="主菜" limit ?,6',[(n-1)*6],(err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     });
// });

// //菜单-开胃菜数据查询
// // router.get('/menu3',(req,res)=>{
// //     // var n=req.body;
// //     // console.log(n);
// //     pool.query('select *from menu where mtype="开胃菜" limit 0,6',(err,result)=>{
// //         if(err) throw err;
// //         res.send(result);
// //     });
// // });
// //菜单-开胃菜数据查询
// router.post('/menu4',(req,res)=>{
//     var n=parseInt(req.body.xh);
//     // console.log(n);
//     pool.query('select *from menu where mtype="开胃菜" limit ?,6',[(n-1)*6],(err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     });
// });

// //菜单-甜点数据查询
// // router.get('/menu5',(req,res)=>{
// //     // var n=req.body;
// //     // console.log(n);
// //     pool.query('select *from menu where mtype="甜品" limit 0,6',(err,result)=>{
// //         if(err) throw err;
// //         res.send(result);
// //     });
// // });
// //菜单-甜点数据查询
// router.post('/menu6',(req,res)=>{
//     var n=parseInt(req.body.xh);
//     // console.log(n);
//     pool.query('select *from menu where mtype="甜品" limit ?,6',[(n-1)*6],(err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     });
// });
// //菜单-酒水数据查询
// // router.get('/menu7',(req,res)=>{
// //     // var n=req.body;
// //     // console.log(n);
// //     pool.query('select *from menu where mtype="酒水" limit 0,6',(err,result)=>{
// //         if(err) throw err;
// //         res.send(result);
// //     });
// // });
// //菜单-酒水数据查询
// router.post('/menu8',(req,res)=>{
//     var n=parseInt(req.body.xh);
//     // console.log(n);
//     pool.query('select *from menu where mtype="酒水" limit ?,6',[(n-1)*6],(err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     });
// });

// // Gallery下
// // 画廊-数据查询
// router .get('/galler',(req,res)=>{
//     pool.query('select *from gallery',(err,result)=>{
//         if(err) throw err;
//         res.send(result);
//     });
// });
// 导出路由器
module.exports = router;
