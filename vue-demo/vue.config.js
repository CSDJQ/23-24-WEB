const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:12345', // 目标地址
        changeOrigin: false, // 是否改变原始主机头为目标URL
        pathRewrite: {
          '^/api': '' // 路径重写，将/api替换为空字符串
        }
      }
    }
  }
};
