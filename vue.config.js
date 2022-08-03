module.exports = {
  publicPath: "./",
  // 输出文件目录
  outputDir: "dist",
  // 静态资源存放的文件夹(相对于ouputDir)
  assetsDir: "static",
  // eslint-loader 是否在保存的时候检查(果断不用，这玩意儿我都没装)
  lintOnSave:false,
  // 我用的only，打包后小些
  runtimeCompiler: false,
  productionSourceMap: true, 
    css: {
        loaderOptions: {
            less: {
              lessOptions:{
                javascriptEnabled: true,
              }
            }
        }
    },
    devServer:{
        port: 3000,
        // host: '0.0.0.0',
        // hot: true,
        disableHostCheck: true,
        proxy: {
            '/v2/ajax': {
              target: 'http://localhost:9999/v2/',
              changeOrigin: true,
              pathRewrite: {
                '^/v2': '',
              },
            },
            '/api': {
              target: 'http://localhost:9999/api/',
              changeOrigin: true,
              pathRewrite: {
                '^/api': '',
              },
          }
        }
    }
  }
