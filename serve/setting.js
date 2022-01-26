module.exports = {
  token: {
    // token密匙
    signKey: "密匙",//自己命名
    // 过期时间
    signTime: 3600*24,
    // 请求头参数
    header: "x-access-token",
    //不用校验的路由
    unRoute: [ "/api/user/login","/api/info/articleId", "/api/info/articleAll" ,/^\/static\/.*/],
  },
};
