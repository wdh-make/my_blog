
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  // chainWebpack: config => {
  //   config.resolve.alias
  //     .set('~', resolve('src/'))
  //     .set('~threejs', resolve('src/assets/threejs'))
  // },
  devServer: {
    port: 8808,
    proxy: {
      '/api': {
        target: 'http://localhost:3001/',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '/api': ''  //默认所有请求都加了easwift-boot前缀，需要去掉
        }
      },
    }
  },
}

