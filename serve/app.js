//导入express模块
const express = require("express");
//导入cors模块
const cors = require("cors");
// 引入路由器对象
const user=require('./api/user.js');
const info=require('./api/info.js');
const student=require('./api/student.js');
const static=require('./api/static.js');
//引入body-parser中间件
const bodyParser = require("body-parser");
//检查token是否过期
const expressJWT = require('express-jwt');

//导入配置文件
const setting = require("./setting");
const path = require("path")
//创建web服务器
const server = express();
//创建mysql连接处
// const pool = mysql.createPool({
//   host: "127.0.0.1",
//   port: 3306,
//   user: "mall",
//   password: "123456",
//   database: "mall",
//   connectionLimit: 15,
// });
//引用body-parser中间件，将post请求数据解析为对象
server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
server.use(express.static(path.join(__dirname , "static")));
// 自定义跨域中间件
var allowCors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};
server.use(allowCors);//使用跨域中间件
// server.use(function(req, res, next) {
//   next(createError(404));
// });
//使用cors模块
server.use(
  cors({
    origin: ["http://localhost:3001", "http://127.0.0.1"],
  })
);


// 使用expressJWT 验证token是否过期
server.use(expressJWT({
  secret: setting.token.signKey, // 签名的密钥 或 PublicKey
  algorithms:['HS256'],
  credentialsRequired:true // 是否需要验证
}).unless({ // 设置并规定哪些路由不用验证 token
  path: setting.token.unRoute  // 指定路径不经过 Token 解析
}));


//当token失效返回提示信息 时间过期了执行这一条
server.use((err, req, res, next) => {
  if (err.status === 401) {
    return res.json({
      status: err.status,
      msg: 'token失效',
      error: err.name + ':' + err.message
    })
  }
});

//设置端口号
server.listen(3001,'0.0.0.0', () => {//'0.0.0.'获取ipV4地址
// server.listen(3001, () => {
  console.log("服务器启动...");
});

// 挂载并添加前缀
server.use('/api/user',user);
server.use('/api/info',info);
server.use('/api/student',student);
server.use('/static',static);

//设置路由
// 推荐
// server.get("/pecommend", (req, res) => {
//   let cstate = req.query.cstate;
//   let page = req.query.page;
//   let pageSize = 4;
//   let ym = (page - 1) * pageSize;

//   pool.query(
//     "select  cid,cname,ctitle,cprice,cphoto from commodity where cstate=" +
//       cstate +
//       " limit " +
//       ym +
//       "," +
//       pageSize,
//     (err, result) => {
//       if (err) throw err;
//       pool.query(
//         "select count(cid) as count from commodity where cstate=?",
//         [cstate],
//         (err, record) => {
//           if (err) throws;
//           //    console.log(record[0].count);
//           let count = Math.ceil(record[0].count / pageSize);
//           res.send({ result, count });
//         }
//       );
//       //    console.log(result);
//     }
//   );
// });
// // 限时
// server.get("/myHome", (req, res) => {
//   let page = req.query.page;
//   let state = req.query.cstate;
//   let pageSize = 3;
//   let offset = (page - 1) * pageSize;
//   pool.query(
//     "select cid,cname,ctitle,cprice,cphoto from commodity where cstate=? limit ?,?",
//     [state, offset, pageSize],
//     (err, result) => {
//       if (err) throws;
//       res.send({ message: "查询成功", code: 1, result: result });
//     }
//   );
// });

// // 登录
// server.post("/login", (req, res) => {
//   let uaccount = req.body.uaccount;
//   let upwd = req.body.upwd;
//   // console.log(uaccount);
//   // console.log(upwd);
//   pool.query(
//     "select uid,uname,uaccount,upwd,uphone,utime from user where uaccount=?",
//     [uaccount],
//     (err, isuaccount) => {
//       if (err) throws;
//       if (isuaccount.length == 1) {
//         pool.query(
//           "select uid,uname,uaccount,upwd,uphone,utime,uimg from user where uaccount=? and upwd=?",
//           [uaccount, upwd],
//           (err, result) => {
//             if (err) throw err;
//             //    console.log(result);
//             if (result.length == 0) {
//               res.send({ code: 0 });
//             } else if (result.length == 1) {
//               res.send({ code: 1, result });
//             }
//           }
//         );
//       } else {
//         res.send({ code: -1 });
//       }
//     }
//   );
// });
// // 注册
// server.post("/register", (req, res) => {
//   // let uaccount=req.body.uaccount;
//   // let uphonet=req.body.uaccount;
//   // let upwd=req.body.upwd;
//   let utime = new Date().toLocaleString();
//   let uname = uuid.v1().substr(0, 13);
//   let obj = req.body;
//   obj.utime = utime;
//   obj.uname = uname;
//   // console.log(obj);
//   // console.log(uaccount);
//   // console.log(upwd);
//   pool.query("insert into user set ?", [obj], (err, result) => {
//     if (err) throw err;
//     //    console.log(result);
//     result.affectedRows == 1 ? res.send("1") : res.send("0");
//   });
//   // res.send('ok');
// });
// // 验证用户是否存在
// server.get("/getCode", (req, res) => {
//   let uaccount = req.query.uaccount;
//   pool.query(
//     "select uid,uname,uaccount,upwd,uphone,utime from user where uaccount=?",
//     [uaccount],
//     (err, result) => {
//       if (err) throw err;
//       //    console.log(result);
//       result.length == 0 ? res.send("1") : res.send("0");
//     }
//   );
// });
// // 用户信息查询
// server.get("/accountData", (req, res) => {
//   let uid = req.query.uid;
//   pool.query(
//     "select uid,uname,usex,ubirthday,uintro,uimg from user where uid=?",
//     [uid],
//     (err, result) => {
//       if (err) throws;
//       res.send(result);
//     }
//   );
// });

// // 商品列表查询
// server.get("/class", (req, res) => {
//   pool.query("select classid,classname from classify", (err, result) => {
//     if (err) throws;
//     res.send(result);
//   });
// });
// //分类商品查询
// server.get("/classify", (req, res) => {
//   let ctype = req.query.ctype;
//   let page = req.query.page;
//   // console.log(ctype);
//   // console.log(page);
//   let pageSize = 6;
//   let ym = (page - 1) * pageSize;
//   pool.query(
//     "select cid,cname,ctitle,cprice,cphoto from commodity where ctype=" +
//       ctype +
//       " limit " +
//       ym +
//       "," +
//       pageSize,
//     (err, result) => {
//       if (err) throw err;
//       pool.query(
//         "select count(cid) as count from commodity where ctype=?",
//         [ctype],
//         (err, record) => {
//           if (err) throws;
//           //    console.log(record[0].count);
//           let count = Math.ceil(record[0].count / pageSize);
//           res.send({ result });
//         }
//       );
//       // console.log(result);
//     }
//   );
// });

// //商品详情
// server.get("/details", (req, res) => {
//   cid = req.query.cid;
//   pool.query(
//     "select num,cid,cname,info,cprice,top_details,center_details,lb1_cdetails,lb2_cdetails,lb3_cdetails,lb4_cdetails,bottom_details,cspecs,top_lb from commodity where cid=?",
//     [cid],
//     (err, result) => {
//       if (err) throws;
//       res.send(result);
//     }
//   );
// });

// // 商品规格
// server.get("/specs", (req, res) => {
//   let cid = req.query.cid;
//   // console.log(cid);
//   pool.query(
//     "select sid,sedition,sprice,cid from specs where cid=?",
//     [cid],
//     (err, specs) => {
//       if (err) throws;
//       pool.query(
//         "select colorid,ccolor,img,cid from color where cid=?",
//         [cid],
//         (err, color) => {
//           if (err) throws;
//           res.send({ specs: specs, color: color });
//         }
//       );
//     }
//   );
// });

// // 创建购物车
// server.post("/cart", (req, res) => {
//   let obj = req.body;
//   console.log(obj);
//   pool.query("insert into cart set ?", [obj], (err, result) => {
//     result.affectedRows == 1 ? res.send("1") : res.send("0");
//   });
// });

// //查询购物车
// server.get("/cart", (req, res) => {
//   let uid = req.query.uid;
//   let result = [];
//   console.log(uid);
//   // console.log(1);
//   pool.query(
//     "select cart_id,uid,cid,colorid,sid,count from cart where uid=?",
//     [uid],
//     async (err, cart) => {
//       if (err) throw err;
//       // console.log(cart);
//       // console.log(cart.length);
//       await new Promise(function(resolve) {
//         let j = 0;
//         for (let i = 0; i < cart.length; i++) {
//           pool.query(
//             "select cname,num,cid from commodity where cid=?",
//             [cart[i].cid],
//             (err, commodity) => {
//               if (err) throw err;
//               // return commodity[0];
//               // console.log(commodity[0]);
//               pool.query(
//                 "select sedition,sprice from specs where cid=? and sid=?",
//                 [cart[i].cid, cart[i].sid],
//                 (err, specs) => {
//                   if (err) throw err;
//                   // return specs[0]
//                   // console.log(specs[0]);

//                   pool.query(
//                     "select ccolor,img from color where cid=? and colorid=?",
//                     [cart[i].cid, cart[i].colorid],
//                     (err, color) => {
//                       if (err) throw err;
//                       let count = {
//                         count: cart[i].count,
//                         cart_id: cart[i].cart_id,
//                       };
//                       // return color[0]
//                       // console.log(Object.assign(commodity[0],specs[0],color[0]));
//                       // return result.push(Object.assign(commodity[0],specs[0],color[0]));
//                       // console.log(2)

//                       result.push(
//                         Object.assign(commodity[0], specs[0], color[0], count)
//                       );
//                       j++;
//                       // console.log(result);
//                       if (cart.length < j + 1) {
//                         resolve(result);
//                       }
//                       // console.log(j);
//                     }
//                   );
//                 }
//               );
//             }
//           );
//           // Console.log(a);
//         }

//         // Console.log(a);
//       });
//       // console.log(result);
//       if (cart.length > 0) {
//         res.send(result);
//       }
//       // console.log(result);
//     }
//   );
// });
// //删除购物车
// server.delete("/del_cart", (req, res) => {
//   let cart_id = req.query.cart_id;
//   console.log(cart_id);
//   pool.query(`delete from cart where cart_id in(${cart_id})`, (err, result) => {
//     // console.log(result);
//     result.affectedRows > 0
//       ? res.send(`${result.affectedRows}`)
//       : res.send("0");
//   });
// });
// //批量创建
// server.post("/palaceOrder1", (req, res) => {
//   let obj = req.body.str;
//   // console.log(obj);
//   pool.query(
//     "INSERT INTO `placeorder` (`oid`, `oname`, `oimage`, `oinfo`, `oprice`, `ocount`, `onumber`, `cid`, `uid`, `start_id`) VALUES " +
//       obj,
//     (err, result) => {
//       if (err) throw err;
//       // console.log(result);
//       result.affectedRows > 0 ? res.send("1") : res.send("0");
//     }
//   );
// });
// //订单创建
// server.post("/placeOrder", (req, res) => {
//   let obj = req.body;
//   // console.log(obj);
//   pool.query("insert into placeOrder set ?", [obj], (err, result) => {
//     if (err) throw err;
//     // console.log(result);
//     result.affectedRows == 1 ? res.send("1") : res.send("0");
//   });
// });

// //订单查询
// server.get("/placeOrder", (req, res) => {
//   let obj = req.query.onumber;
//   let uid = req.query.uid;
//   // console.log(req.query);
//   // console.log(obj,typeof obj);
//   pool.query(
//     `select onumber,oinfo,oprice,oname,ocount,oimage from placeOrder where onumber in(${obj}) and uid=?`,
//     [uid],
//     (err, result) => {
//       if (err) throw err;
//       // console.log(result);
//       res.send(result);
//     }
//   );
// });

// //订单状态修改
// server.post("/payMoney", (req, res) => {
//   let onumbers = req.body.onumber;
//   let start_id = req.body.start_id;
//   // console.log(req.body);
//   pool.query(
//     `update placeOrder set start_id=${start_id} where onumber in(${onumbers})`,
//     (err, result) => {
//       if (err) throw err;
//       result.affectedRows > 0 ? res.send("1") : res.send("0");
//     }
//   );
// });

// //状态类型
// server.get("/ordersList", (req, res) => {
//   let start_id = req.query.start_id;
//   let uid = req.query.uid;
//   // console.log(start_id);
//   pool.query("select start_name,start_id from start", (err, ordersList) => {
//     if (err) throw err;
//     if (start_id == 1) {
//       pool.query(
//         "select onumber,oinfo,oprice,oname,ocount,oimage,start_id from placeOrder where uid=?",
//         [uid],
//         (err, placeOrder) => {
//           if (err) throw err;
//           res.send({ ordersList, placeOrder });
//         }
//       );
//     } else {
//       pool.query(
//         "select onumber,oinfo,oprice,oname,ocount,oimage,start_id from placeOrder where start_id=? and uid=?",
//         [start_id, uid],
//         (err, placeOrder) => {
//           if (err) throw err;
//           res.send({ ordersList, placeOrder });
//         }
//       );
//     }
//   });
// });

// //删除订单
// server.delete("/deleteOrder", (req, res) => {
//   let onumber = req.query.onumber;
//   // console.log(onumber);
//   pool.query(
//     "delete from placeOrder where onumber=?",
//     [onumber],
//     (err, result) => {
//       if (err) throw err;
//       result.affectedRows == 1 ? res.send("1") : res.send("0");

//       // res.send(result);
//       // console.log(result);
//     }
//   );
// });

// // server.get('/categories',(req,res)=>{
// //     pool.query('select  *from xzqa_category',(err,result)=>{
// //        if(err) throw err;
// //        res.send(result);
// //     });
// //     // res.send('ok');
// // });
// // server.get('/articles',(req,res)=>{
// //     let cid=req.query.cid;
// //     let page=req.query.page;
// //     let pageSize=15;
// //     let ym=(page-1)*pageSize

// //     pool.query('select  *from xzqa_article where category_id='+cid+' limit '+ym+','+pageSize,(err,result)=>{
// //        if(err) throw err;
// //        pool.query('select count(id) as count from xzqa_article where category_id=?',[cid],(err,record)=>{
// //            if(err) throws;
// //         //    console.log(record[0].count);
// //            let count=Math.ceil((record[0].count)/pageSize);
// //            res.send({result,count});
// //        })
// //     //    console.log(result);

// //     });
// //     // res.send('ok');
// // server.get('/article',(req,res)=>{
// //     let id=req.query.id;
// //     pool.query('select *from xzqa_article where id=?',[id],(err,result)=>{
// //         if(err) throws;
// //         res.send(result);
// //         console.log(result);
// //     })
// // })
// // });
