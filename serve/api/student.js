// 引入express模块
const express = require("express");
//引入连接池模块
const pool = require("../pool.js");
// 创建路由器对象
const router = express.Router();

const { throws } = require("assert");
const { Console } = require("console");
var sillyTime = require("silly-datetime");
//导入配置文件
const setting = require('../setting');
//导入 token 校验文件
const verify = require('../verify');

// 添加模块下的所有路由
// 添加学生
router.post("/addStudent", async(req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header])
  if(!token){
    return res.send({
      status:-1,
      msg:"token失效，请重新登录！"
    })
  }
  var params = req.body;
  console.log(params);
  if (!params.studentName) {
    return res.send({
      status: -1,
      msg: "学生姓名不能为空",
    });
  }
  var createDate = sillyTime.format(new Date(), "YYYY-MM-DD HH:mm:ss");
  //   console.log(createDate)
  pool.query(
    "INSERT INTO students ( studentName, phone , age , createDate,updateDate, gender , surplusClassTime , allClassTime , className , teacherName,school,grade,addPeople) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      params.studentName,
      params.phone,
      params.age,
      createDate,
      createDate,
      params.gender,
      params.allClassTime,
      params.allClassTime,
      params.className,
      params.teacherName,
      params.school,
      params.grade,
      params.addPeople
    ],
    function (err, result) {
      // var data = req.body;
      //   console.log(result);
      //   console.log(err)
      if(err) {
        return res.send({
          status:-1,
          msg:"学生添加失败"
        })
      }
      if (result.affectedRows == 1) {
        return res.send({
          status: 1,
          msg: "学生添加成功",
          // data: data
        });
      } else {
        return res.send({
          status: -1,
          msg: "学生添加失败",
          // data: data
        });
      }
    }
  );
});

// 查询学生列表
router.post("/getStudentList", async(req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header])
  if(!token){
    return res.send({
      status:-1,
      msg:"token失效，请重新登录！"
    })
  }
  var params = req.body;
  var pageSize = params.pagesize;
  var pageNum = (params.pagenum - 1) * pageSize;
  var name = params.name;
  var power = params.power;
  var studentName = params.studentName;
  var teacherName = params.teacherName;
  //   console.log(params);
  var sql1 = "";
  var arr1 = [];
  var sql2 = "";
  var arr2 = [];
  if (power == 99) {
    sql1 = "select COUNT(*) from students where valid = ?";
    arr1 = [1];
    sql2 = "select * from students where valid = ? limit ?,?";
    arr2 = [1, pageNum, pageSize];

    if (studentName) {
      sql1 =
        "select COUNT(*) from students where valid = ? and studentName like ?";
      arr1 = [1, "%" + studentName + "%"];
      sql2 =
        "select * from students where valid = ? and studentName like ? limit ?,?";
      arr2 = [1, "%" + studentName + "%", pageNum, pageSize];
    }

    if (teacherName) {
      sql1 =
        "select COUNT(*) from students where valid = ? and teacherName like ?";
      arr1 = [1, "%" + teacherName + "%"];
      sql2 =
        "select * from students where valid = ? and teacherName like ? limit ?,?";
      arr2 = [1, "%" + teacherName + "%", pageNum, pageSize];
    }

    if (studentName && teacherName) {
      sql1 =
        "select COUNT(*) from students where valid = ? and teacherName like ? and studentName like ?";
      arr1 = [1, "%" + teacherName + "%", "%" + studentName + "%"];
      sql2 =
        "select * from students where valid = ? and teacherName like ? and studentName like ? limit ?,?";
      arr2 = [
        1,
        "%" + teacherName + "%",
        "%" + studentName + "%",
        pageNum,
        pageSize,
      ];
    }
  } else if (power == 20 || power == 10 || power == 2) {
    sql1 = "select COUNT(*) from students where valid = ?";
    arr1 = [1];
    sql2 =
      "select studentId,age,allClassTime,surplusClassTime,className,age,gender,grade,school,studentName,teacherName from students where valid = ? limit ?,?";
    arr2 = [1, pageNum, pageSize];

    if (studentName) {
      sql1 =
        "select COUNT(*) from students where valid = ? and studentName like ?";
      arr1 = [1, "%" + studentName + "%"];
      sql2 =
        "select studentId,age,allClassTime,surplusClassTime,className,age,gender,grade,school,studentName,teacherName from students where valid = ? and studentName like ? limit ?,?";
      arr2 = [1, "%" + studentName + "%", pageNum, pageSize];
    }

    if (teacherName) {
      sql1 =
        "select COUNT(*) from students where valid = ? and teacherName like ?";
      arr1 = [1, "%" + teacherName + "%"];
      sql2 =
        "select studentId,age,allClassTime,surplusClassTime,className,age,gender,grade,school,studentName,teacherName from students where valid = ? and teacherName like ? limit ?,?";
      arr2 = [1, "%" + teacherName + "%", pageNum, pageSize];
    }

    if (studentName && teacherName) {
      sql1 =
        "select COUNT(*) from students where valid = ? and teacherName like ? and studentName like ?";
      arr1 = [1, "%" + teacherName + "%", "%" + studentName + "%"];
      sql2 =
        "select studentId,age,allClassTime,surplusClassTime,className,age,gender,grade,school,studentName,teacherName from students where valid = ? and teacherName like ? and studentName like ? limit ?,?";
      arr2 = [
        1,
        "%" + teacherName + "%",
        "%" + studentName + "%",
        pageNum,
        pageSize,
      ];
    }
  } else {
    sql1 =
      "select COUNT(*) from students where valid = ? and teacherName like ?";
    arr1 = [1, "%" + name + "%"];
    sql2 =
      "select studentId,age,allClassTime,surplusClassTime,className,age,gender,grade,school,studentName,teacherName from students where valid = ? and teacherName like ? limit ?,?";
    arr2 = [1, "%" + name + "%", pageNum, pageSize];

    if (studentName) {
      sql1 =
        "select COUNT(*) from students where valid = ? and teacherName like ? and studentName like ?";
      arr1 = [1, "%" + name + "%", "%" + studentName + "%"];
      sql2 =
        "select studentId,age,allClassTime,surplusClassTime,className,age,gender,grade,school,studentName,teacherName from students where valid = ? and teacherName like ? and studentName like ? limit ?,?";
      arr2 = [1, "%" + name + "%", "%" + studentName + "%", pageNum, pageSize];
    }
  }

  pool.query(sql1, arr1, async(err, result) =>{
  var headers = JSON.parse(JSON.stringify(req.headers));
    let token = await verify.getToken(headers[setting.token.header])
  if(!token){
    return res.send({
      status:-1,
      msg:"token失效，请重新登录！"
    })
  }
    var total = 0;
    if (result) {
      total = result[0]["COUNT(*)"];
    }
    pool.query(sql2, arr2, function (err, result) {
      //   console.log(result)
      var data = result;
      return res.send({
        status: 1,
        msg: "查询成功",
        list: data,
        total: total,
        pageNum: pageNum,
        pageSize: pageSize,
      });
    });
  });
});

// 按名字查找学生
router.post("/getStudentList/studentName", async(req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header])
  if(!token){
    return res.send({
      status:-1,
      msg:"token失效，请重新登录！"
    })
  }
  var params = req.body;
  var studentName = params.studentName;
  var power = params.power;
  //   console.log(params);
  if(!studentName) {
    return res.send({
      status: -1,
      msg: "请输入学生姓名",
    });
  }
  if (power == 99) {
    var sql = "select * from students where valid = ? and studentName like ?";
    var arr = [1, "%" + studentName + "%"];
  } else {
    var sql =
      "select studentId,age,allClassTime,surplusClassTime,className,age,gender,grade,school,studentName,teacherName from students where valid = ? and studentName like ?";
    var arr = [1, "%" + studentName + "%"];
  }
  pool.query(sql, arr, function (err, result) {
    //   console.log(result)
    if (err) throw err;
    var data = result;
    return res.send({
      status: 1,
      msg: "查询成功",
      list: data,
    });
  });
});

// 按老师查找学生
router.post("/getStudentList/teacherName", async(req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header])
  if(!token){
    return res.send({
      status:-1,
      msg:"token失效，请重新登录！"
    })
  }
  var params = req.body;
  var teacherName = params.teacherName;
  var power = params.power;
  //   console.log(params);
  if (power == 99) {
    var sql = "select * from students where valid = ? and teacherName like ?";
    var arr = [1, "%" + teacherName + "%"];
  } else {
    var sql =
      "select studentId,age,allClassTime,surplusClassTime,className,age,gender,grade,school,studentName,teacherName from students where valid = ? and teacherName like ?";
    var arr = [1, "%" + teacherName + "%"];
  }

  pool.query(sql, arr, function (err, result) {
    //   console.log(result)
    if (err) throw err;
    var data = result;
    return res.send({
      status: 1,
      msg: "查询成功",
      list: data,
    });
  });
});

// 修改学生信息
router.post("/updateStudent", async(req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header])
  if(!token){
    return res.send({
      status:-1,
      msg:"token失效，请重新登录！"
    })
  }
  var params = req.body;
  if (!params.studentId) {
    return res.send({
      status: -1,
      msg: "学生ID不能为空",
    });
  }
  var power = params.power;
  if (power != 99) {
    return res.send({
      status: -1,
      msg: "您不是管理员，无法进行修改",
    });
  }
  var sql = "";
  var arr = [];
  var updateDate = sillyTime.format(new Date(), "YYYY-MM-DD HH:mm:ss");

  sql =
    "UPDATE `students` SET `studentName`=?,`age`=?,`gender`=?,`phone`=?,`className`=?,`surplusClassTime`=?,`allClassTime`=?,`teacherName`=?,`updateDate`=?,`school`=?,`grade`=? WHERE studentId = ?";
  arr = [
    params.studentName,
    params.age,
    params.gender,
    params.phone,
    params.className,
    params.surplusClassTime,
    params.allClassTime,
    params.teacherName,
    updateDate,
    params.school,
    params.grade,
    params.studentId,
  ];

  // console.log(arr);

  pool.query(sql, arr, function (err, result) {
    // var data = req.body;
    // console.log(result.changedRows);
    if (result.changedRows == 1) {
      return res.send({
        status: 1,
        msg: "学生信息修改成功",
        // data: data
      });
    } else {
      return res.send({
        status: -1,
        msg: "学生信息修改失败",
      });
    }
  });
});

// 扣课时
router.post("/signIn", async(req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header])
  if(!token){
    return res.send({
      status:-1,
      msg:"token失效，请重新登录！"
    })
  }
  var params = req.body;
  if (!params.studentId) {
    return res.send({
      status: -1,
      msg: "学生ID不能为空",
    });
  }
  var name = params.name;
  var power = params.power;
  if (power != 99 && power != 10 && power != 1) {
    return res.send({
      status: -1,
      msg: "您的权限不足，请联系管理员",
    });
  }
  // var sql = "";
  // var arr = [];
  var updateDate = sillyTime.format(new Date(), "YYYY-MM-DD HH:mm:ss");

  var sql1 =
    "insert into signIn(studentName,studentId,teacherName,phone,gender,createDate,operator) (select studentName,studentId,teacherName,phone,gender ,? ,? from students where studentId = ?) ";
  var arr1 = [updateDate, name, params.studentId];
  pool.query(sql1, arr1, function (err, result1) {
    // console.log(err);
    if (result1.affectedRows == 1) {
      var sql3 =
        "UPDATE `students` SET `surplusClassTime`= surplusClassTime - 1,`updateDate`=? WHERE studentId = ?";
      var arr3 = [updateDate, params.studentId];

      pool.query(sql3, arr3, function (err, result3) {
        // var data = req.body;
        // console.log(err);
        // console.log(result.changedRows);
        if (result3.changedRows == 1) {
          return res.send({
            status: 1,
            msg: "签到成功",
            // data: data
          });
        } else {
          return res.send({
            status: -1,
            msg: "签到失败",
          });
        }
      });
      // var sql2 =
      //   "UPDATE `signIn` SET `createDate`= ?,`operator`=? WHERE studentId = ?";
      // var arr2 = [updateDate, name, params.studentId];
      // pool.query(sql2, arr2, function (err, result2) {
      //   // console.log(err);
      //   if (result2.changedRows == 1) {
      //     var sql3 =
      //       "UPDATE `students` SET `surplusClassTime`= surplusClassTime - 1,`updateDate`=? WHERE studentId = ?";
      //     var arr3 = [updateDate, params.studentId];

      //     pool.query(sql3, arr3, function (err, result3) {
      //       // var data = req.body;
      //       // console.log(err);
      //       // console.log(result.changedRows);
      //       if (result3.changedRows == 1) {
      //         return res.send({
      //           status: 1,
      //           msg: "签到成功",
      //           // data: data
      //         });
      //       } else {
      //         return res.send({
      //           status: -1,
      //           msg: "签到失败",
      //         });
      //       }
      //     });
      //   } else {
      //     return res.send({
      //       status: -1,
      //       msg: "签到失败",
      //     });
      //   }
      // });
    } else {
      return res.send({
        status: -1,
        msg: "签到失败",
      });
    }
  });
});

//查找签到记录
router.post("/getSignInList", async(req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header])
  if(!token){
    return res.send({
      status:-1,
      msg:"token失效，请重新登录！"
    })
  }
  var params = req.body;
  var pageSize = params.pagesize;
  var pageNum = (params.pagenum - 1) * pageSize;
  var studentName = params.studentName;
  var teacherName = params.teacherName;
  var power = params.power;
  //   console.log(params);
  var sql1 = "";
  var arr1 = [];
  var sql2 = "";
  var arr2 = [];
  if (power == 99) {
    sql1 = "select COUNT(*) from signIn ";
    arr1 = [];
    sql2 = "select * from signIn ORDER BY createDate desc limit ?,? ";
    arr2 = [pageNum, pageSize];

    if (studentName) {
      sql1 = "select COUNT(*) from signIn where  studentName like ?";
      arr1 = ["%" + studentName + "%"];
      sql2 =
        "select * from signIn where studentName like ? ORDER BY createDate desc limit ?,?";
      arr2 = ["%" + studentName + "%", pageNum, pageSize];
    }

    if (teacherName) {
      sql1 = "select COUNT(*) from signIn where teacherName like ?";
      arr1 = ["%" + teacherName + "%"];
      sql2 =
        "select * from signIn where teacherName like ? ORDER BY createDate desc limit ?,?";
      arr2 = ["%" + teacherName + "%", pageNum, pageSize];
    }

    if (studentName && teacherName) {
      sql1 =
        "select COUNT(*) from signIn where  studentName like ? and teacherName like ?";
      arr1 = ["%" + studentName + "%", "%" + teacherName + "%"];
      sql2 =
        "select * from signIn where studentName like ? and teacherName like ? ORDER BY createDate desc limit ?,?";
      arr2 = [
        "%" + studentName + "%",
        "%" + teacherName + "%",
        pageNum,
        pageSize,
      ];
    }
  } else {
    sql1 = "select COUNT(*) from signIn ";
    arr1 = [];
    sql2 =
      "select siId,studentName,studentId,teacherName,gender,operator,createDate from signIn ORDER BY createDate desc limit ?,?";
    arr2 = [pageNum, pageSize];

    if (studentName) {
      sql1 = "select COUNT(*) from signIn where  studentName like ?";
      arr1 = ["%" + studentName + "%"];
      sql2 =
        "select siId,studentName,studentId,teacherName,gender,operator,createDate from signIn where studentName like ? ORDER BY createDate desc limit ?,?";
      arr2 = ["%" + studentName + "%", pageNum, pageSize];
    }

    if (teacherName) {
      sql1 = "select COUNT(*) from signIn where teacherName like ?";
      arr1 = ["%" + teacherName + "%"];
      sql2 =
        "select siId,studentName,studentId,teacherName,gender,operator,createDate from signIn where teacherName like ? ORDER BY createDate desc limit ?,?";
      arr2 = ["%" + teacherName + "%", pageNum, pageSize];
    }

    if (studentName && teacherName) {
      sql1 =
        "select COUNT(*) from signIn where  studentName like ? and teacherName like ?";
      arr1 = ["%" + studentName + "%", "%" + teacherName + "%"];
      sql2 =
        "select siId,studentName,studentId,teacherName,gender,operator,createDate from signIn where studentName like ? and teacherName like ? ORDER BY createDate desc limit ?,?";
      arr2 = [
        "%" + studentName + "%",
        "%" + teacherName + "%",
        pageNum,
        pageSize,
      ];
    }
  }

  pool.query(sql1, arr1, function (err, result) {
    var total = 0;
    if (result) {
      total = result[0]["COUNT(*)"];
    }
    pool.query(sql2, arr2, function (err, result) {
      //   console.log(result)
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
        list: data || [],
        total: total,
        pageNum: pageNum,
        pageSize: pageSize,
      });
    });
  });
});

// 删除
router.post("/delStudent", async(req, res) => {
  var headers = JSON.parse(JSON.stringify(req.headers));
  let token = await verify.getToken(headers[setting.token.header])
  if(!token){
    return res.send({
      status:-1,
      msg:"token失效，请重新登录！"
    })
  }
  var params = req.body;
  if (!params.id) {
    return res.send({
      status: -1,
      msg: "用户ID不能为空",
    });
  }
  var power = params.power;
  if (power == 99) {
    return res.send({
      status: -1,
      msg: "您不是管理员，无法进行删除",
    });
  }
  var updateDate = sillyTime.format(new Date(), "YYYY-MM-DD HH:mm:ss");
  //修改数据有效值
  pool.query(
    "UPDATE `students` SET `valid`= ?,`updateDate`= ? WHERE studentId = ?",
    [0 , updateDate , params.id],
    function (err, result) {
      // var data = req.body;
      // console.log(result.changedRows);
      if (result.changedRows == 1) {
        return res.send({
          status: 1,
          msg: "学生删除成功",
          // data: data
        });
      } else {
        return res.send({
          status: -1,
          msg: "学生删除失败",
        });
      }
    }
  );
  //删除数据库，暂不使用，保留记录，防止误删
  // pool.query(
  //   "DELETE FROM `students` WHERE id=?",
  //   [params.id],
  //   function (err, result) {
  //     // var data = req.body;
  //     console.log(result.affectedRows);
  //     if (result.affectedRows == 1) {
  //       return res.send({
  //         status: 1,
  //         msg: "用户删除成功",
  //         // data: data
  //       });
  //     } else {
  //       return res.send({
  //         status: -1,
  //         msg: "用户删除失败",
  //       });
  //     }
  //   }
  // );
});
// 导出路由器
module.exports = router;
