// 引入express模块
const express = require("express");
//引入连接池模块
const pool = require("../pool.js");
// 创建路由器对象
const router = express.Router();

const { throws } = require("assert");

const { Console } = require("console");

//导入配置文件
const setting = require("../setting");
//导入 token 校验文件
const verify = require("../verify");

// 添加模块下的所有路由
// 登录接口
router.post("/login", (req, res) => {
  var params = req.body;
  // console.log(params);
  pool.query(
    "select * from admin_user where userName = ? and passWord = ?",
    [params.userName, params.passWord],
    async (err, result) => {
      console.log(result)
      
      var data = result[0];
      if (result.length === 0) {
        return res.send({
          status: -1,
          msg: "用户名或密码错误",
        });
      } else {
        if (data.mg_state == 0) {
          return res.send({
            status: -1,
            msg: "该账号暂不可以用，请联系管理员",
          });
        }
        let token = await verify.setToken(params.userName, params.passWord);
        return res.send({
          status: 1,
          msg: "登录成功",
          result: {
            userName: params.userName,
            realName: data.realName,
            power: data.power,
            id: data.id,
            token: token,
          },
        });
      }
    }
  );
});

// 创建用户
router.post("/createUser", async (req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header]);
  if (!token) {
    return res.send({
      status: -1,
      msg: "token失效，请重新登录！",
    });
  }
  var params = req.body;
  if (params.power != 99) {
    return res.send({
      status: -1,
      msg: "您没有权限，请联系管理员",
    });
  }
  if (!req.body.userName) {
    return res.send({
      status: -1,
      msg: "用户名不能为空",
    });
  }
  if (!req.body.passWord) {
    return res.send({
      status: -1,
      msg: "密码不能为空",
    });
  }
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var createDate =
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  pool.query(
    "INSERT INTO admin_user ( userName, passWord , createDate,updateDate, realName , power , phone , mg_state , role) VALUES (?,?,?,?,?,?,?,?,?)",
    [
      req.body.userName,
      req.body.passWord,
      createDate,
      createDate,
      req.body.realName,
      1,
      req.body.phone,
      0,
      "教师",
    ],
    function (err, result) {
      // var data = req.body;
      console.log(result.affectedRows);
      if (result.affectedRows == 1) {
        return res.send({
          status: 1,
          msg: "添加用户成功",
          // data: data
        });
      } else {
        return res.send({
          status: -1,
          msg: "添加用户失败",
          // data: data
        });
      }
    }
  );
});

// 查询用户列表
router.post("/getUserList", async (req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header]);
  if (!token) {
    return res.send({
      status: -1,
      msg: "token失效，请重新登录！",
    });
  }
  var params = req.body;
  var pageSize = params.pagesize;
  var pageNum = (params.pagenum - 1) * pageSize;
  var power = params.power;
  var realName = params.realName;
  var role = params.role;
  var sql1 = "";
  var arr1 = [];
  var sql2 = "";
  var arr2 = [];
  if (realName) {
    if (power == 99) {
      sql1 = "select COUNT(*) from admin_user wherr realName = ?";
      arr1 = [realName];
      sql2 =
        "select userName,power,realName,role,id,mg_state,phone from admin_user where realName = ? limit ?,?";
      arr2 = [realName, pageNum, pageSize];
    } else {
      sql1 =
        "select COUNT(*) from admin_user where mg_state = ? and realName = ?";
      arr1 = [1, realName];
      sql2 =
        "select userName,power,realName,role,id,mg_state,phone from admin_user where mg_state = ? and realName = ? limit ?,?";
      arr2 = [1, realName, pageNum, pageSize];
    }
  } else if (role) {
    if (power == 99) {
      sql1 = "select COUNT(*) from admin_user wherr role = ?";
      arr1 = [role];
      sql2 =
        "select userName,power,realName,role,id,mg_state,phone from admin_user where role = ? limit ?,?";
      arr2 = [role, pageNum, pageSize];
    } else {
      sql1 = "select COUNT(*) from admin_user where mg_state = ? and role = ?";
      arr1 = [1, role];
      sql2 =
        "select userName,power,realName,role,id,mg_state,phone from admin_user where mg_state = ? and role = ? limit ?,?";
      arr2 = [1, role, pageNum, pageSize];
    }
  } else {
    if (power == 99) {
      sql1 = "select COUNT(*) from admin_user ";
      arr1 = [];
      sql2 =
        "select userName,power,realName,role,id,mg_state,phone from admin_user limit ?,?";
      arr2 = [pageNum, pageSize];
    } else {
      sql1 = "select COUNT(*) from admin_user where mg_state = ? ";
      arr1 = [1];
      sql2 =
        "select userName,power,realName,role,id,mg_state,phone from admin_user where mg_state = ? limit ?,?";
      arr2 = [1, pageNum, pageSize];
    }
  }
  // console.log(params);
  pool.query(sql1, arr1, function (err, result) {
    //   console.log(result[0]
    var total = 0;
    if (result) {
      total = result[0]["COUNT(*)"];
    }
    pool.query(sql2, arr2, function (err, result) {
      if (err) {
        return res.send({
          status: -1,
          msg: "查询失败",
        });
      }
      var data = result;
      return res.send({
        status: 1,
        msg: "查询成功",
        list: data,
        total: total,
      });
    });
  });
});

// 修改用户
router.post("/updateUser", async (req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header]);
  if (!token) {
    return res.send({
      status: -1,
      msg: "token失效，请重新登录！",
    });
  }
  var params = req.body;
  if (params.power != 99) {
    return res.send({
      status: -1,
      msg: "您没有权限，请联系管理员",
    });
  }
  if (!params.id) {
    return res.send({
      status: -1,
      msg: "用户ID不能为空",
    });
  }
  var power = params.power;
  var role =
    power == 99
      ? "超级管理员"
      : power == 10
      ? "教务主任"
      : power == 20
      ? "销售主管"
      : power == 1
      ? "教师"
      : "销售";
  var mg_state = params.mg_state;
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var updateDate =
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  var sql = "";
  var arr = [];
  if (power) {
    sql =
      "UPDATE `admin_user` SET `updateDate`=? , `power`=?, `role`=? WHERE `id`= ?";
    arr = [updateDate, power, role, params.id];
  } else if (mg_state) {
    sql = "UPDATE `admin_user` SET `updateDate`=? , `mg_state`=? WHERE `id`= ?";
    arr = [updateDate, mg_state, params.id];
  } else {
    sql =
      "UPDATE `admin_user` SET `updateDate`=? , `realName`=?, `phone`=? WHERE `id`= ?";
    arr = [updateDate, params.realName, params.phone, params.id];
  }
  console.log(arr);

  pool.query(sql, arr, function (err, result) {
    // var data = req.body;
    console.log(result.changedRows);
    if (result.changedRows == 1) {
      return res.send({
        status: 1,
        msg: "用户修改成功",
        // data: data
      });
    } else {
      return res.send({
        status: -1,
        msg: "用户修改失败",
      });
    }
  });
});

// 删除
router.post("/delUser", async (req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header]);
  if (!token) {
    return res.send({
      status: -1,
      msg: "token失效，请重新登录！",
    });
  }
  var params = req.body;
  if (params.power != 99) {
    return res.send({
      status: -1,
      msg: "您没有权限，请联系管理员",
    });
  }
  if (!params.id) {
    return res.send({
      status: -1,
      msg: "用户ID不能为空",
    });
  }
  pool.query(
    "DELETE FROM `admin_user` WHERE id=?",
    [params.id],
    function (err, result) {
      // var data = req.body;
      console.log(result.affectedRows);
      if (result.affectedRows == 1) {
        return res.send({
          status: 1,
          msg: "用户删除成功",
          // data: data
        });
      } else {
        return res.send({
          status: -1,
          msg: "用户删除失败",
        });
      }
    }
  );
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
