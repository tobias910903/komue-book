const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pluginOptions: {
    electronBuilder:{
      preload: './src/preload.js',
      customFileProtocol: "./", // 解决 ElementUI 图标不显示的问题
    }
  }
})
