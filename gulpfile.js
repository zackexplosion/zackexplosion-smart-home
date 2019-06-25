const NODE_ENV = process.env.NODE_ENV || 'development'
const STARTED_LOG_STRING = 'started'
const { watch, src, dest, series, parallel } = require('gulp')
const sass = require('gulp-sass')
const minifyCSS = require('gulp-csso')
const sourcemaps = require('gulp-sourcemaps')
const nodemon = require('gulp-nodemon')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpackStream = require('webpack-stream')
const browserSync = require('browser-sync').create()
const path = require('path')
const app_dir = './monitor-server'
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack_param = {
  mode: NODE_ENV,
  entry: {
    app: `${app_dir}/js/app.js`,
  },
  output: {
    filename: '[name]-[chunkhash].js',
    // filename: '[name].js',
    path: path.resolve(__dirname, app_dir, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: true
            }
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    ]
  }
}

function webpack (done) {
  return src(`${app_dir}/js/app.js`)
    .pipe(webpackStream(webpack_param))
    .pipe(dest(`${app_dir}/dist`))
    .on('error', e => {
      console.log(e)
      done()
    })
    .pipe(browserSync.stream())
    .on('end', e =>{
      done()
    })
}

function css() {
  return src(`${app_dir}/sass/*.sass`)
    // .pipe(sourcemaps.init())
    .pipe(sourcemaps.init())
    .pipe(sass())
    // .pipe(sourcemaps.write('./maps'))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`${app_dir}/dist`))
    .pipe(browserSync.stream())
}

const build = parallel(css, webpack)
function startNodemon (cb) {
  nodemon({
    script: `${app_dir}/index.js`,
    ext: '*.js',
    ignore : [
      'gulpfile.js',
      "js/**",
      "dist/**",
      "tmp/**",
      "public/**",
      "views/**"
    ],
    stdout: false,
  })
  .on('stdout', function (stdout) {
    // print origin stdout
    console.log(stdout.toString())

    // check if app ready
    const isReady = stdout.toString().includes(STARTED_LOG_STRING)

    if (!isReady) { return }
    cb()
  })
  .on('restart', () => {
    browserSync.reload()
  })
  .on('stderr', (err) =>{
    console.log(err.toString())
  })

}

function startBrowserSync (cb) {
  const PORT = parseInt(process.env.PORT) || 3000
  browserSync.init({
    proxy: `http://localhost:${PORT}`,
    ws: true,
    ui: {
      port: PORT+1
    },
    port: PORT+1
  }, cb)
}


function watcher (cb) {
  watch([`${app_dir}/views/*.pug`]).on('change', browserSync.reload)
  watch([`${app_dir}/sass/*.sass`], css)
  watch([
    `${app_dir}/js/*.js`,
    `${app_dir}/components/*.vue`
  ], webpack)
  cb()
}

// exports.js = js
exports.build = build
// exports.default = build
exports.default = series(
  build,
  startNodemon,
  startBrowserSync,
  watcher
)