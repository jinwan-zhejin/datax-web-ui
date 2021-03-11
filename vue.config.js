'use strict'
const { TRUE } = require('node-sass')
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'DATAX-ADMIN' // page title
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
const port = 8080 // dev port
// eslint-disable-next-line no-unused-vars
const apiPort = 9527

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },

    proxy: {
      [process.env.VUE_APP_API]: {
        ws: false,
        // target: `http://localhost:${apiPort}/api`,
        // target: 'http://47.103.79.104:9090',
        target: 'http://183.194.64.166:9527',
        // target: 'http://192.168.3.83:8080', // 曹海生
        // target: 'http://192.168.3.70:8083', // 刘向前
        // target: 'http://192.168.3.39:8080', // 侯峰
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_API]: '/' + process.env.VUE_APP_API
        }
      },
      // // 数据共享接口 - share
      // '/mock': {
      //   ws: false,
      //   target: 'http://47.103.79.104:3000',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     ['^' + '/share']: '/share'
      //   }
      // },
      // 元数据接口 - Atlas
      '/atlasApi': {
        ws: false,
        target: 'http://123.56.96.151:8079',
        changeOrigin: true,
        pathRewrite: {
          ['^' + '/atlasApi']: '/api/atlas'
        }
      },
      // Atlas登录
      '/j_spring_security_check': {
        ws: false,
        target: 'http://123.56.96.151:8079',
        changeOrigin: true,
        pathRewrite: {
          ['^' + '/j_spring_security_check']: '/j_spring_security_check'
        }
      },
      '/login': {
        ws: false,
        target: 'http://47.103.79.104:8079',
        changeOrigin: true,
        pathRewrite: {
          ['^' + '/login']: '/login'
        }
      },
      // Datains接口
      '/welcome': {
        ws: false,
        target: 'http://47.103.79.104:8079',
        changeOrigin: true,
        pathRewrite: {
          ['^' + '/welcome']: '/datains/welcome'
        }
      },
      '/test': {
        ws: false,
        // target: 'http://192.168.3.60:9000', // 韩家敏
        // target: 'http://192.168.3.74:7000', // 侯峰
        target: 'http://192.168.3.70:8080', // 刘向前
        // target: 'http://47.103.79.104:9528',
        changeOrigin: true,
        pathRewrite: {
          ['^' + '/test']: '/api'
        }
      },
      // 韩家敏接口跳转登录成功返回页面
      '/login': {
        ws: false,
        target: 'http://192.168.3.60:9000', // 韩家敏
        changeOrigin: true,
        pathRewrite: {
          ['^' + '/login']: '/login'
        }
      },
      // 韩家敏接口跳转登录成功返回页面
      '/superset/welcome': {
        ws: false,
        target: 'http://192.168.3.60:9000', // 韩家敏
        changeOrigin: true,
        pathRewrite: {
          ['^' + '/superset/welcome']: '/superset/welcome'
        }
      },
      // // Datains接口
      // '/welcome': {
      //   ws: false,
      //   target: 'http://47.103.79.104:8080',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     ['^' + '/welcome']: '/datains/welcome'
      //   }
      // },
      '/dbeaver/gql': {
        ws: false,
        // target: 'http://192.168.3.66:8978',
        // target: 'http://47.103.79.104:8979',
        target: 'http://183.194.64.166:9528', // 可用
        changeOrigin: true,
        // headers: {
        //   host: "http://192.168.3.74:8978",
        //   origin: "http://192.168.3.74:8978"
        // }
        pathRewrite: {
          ['^' + '/dbeaver/gql']: '/dbeaver/gql'
        }
      },
      // /api
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      // 代理 /dev-api/api 到 http://localhost:8066/api

      // /
      // mock 的代理
      // change xxx-api/login => mock/login

      [process.env.VUE_APP_BASE_API]: {
        ws: false,
        // target: `http://localhost:${port}/mock`,
        // target: 'http://47.103.79.104:9527',
        target: 'http://47.103.79.104:9090',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    after: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
