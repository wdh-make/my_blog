module.exports = {
  token: {
    // token密匙
    signKey: "密匙",//自己命名
    // 过期时间
    signTime: 3600*24,
    // 请求头参数
    header: "x-access-token",
    //不用校验的路由
    unRoute: [ "/api/user/login","/api/user/check_token","/api/info/articleId", "/api/info/articleAll", "/api/info/articleType", "/api/info/like", "/api/info/like_count", /^\/static\/.*/],
  },
};
