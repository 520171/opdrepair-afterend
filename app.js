const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
require ('body-parser-xml')(bodyParser)
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const qywx = require('./routes/qywx')
const history =  require('connect-history-api-fallback') // 使用connect-history-api-fallback中间件
const session = require('express-session')
const fs = require('fs') // 导入fs工具用于创建输出流

const app = express()
// 使用connect-history-api-fallback中间件 单页面应用防止刷新出错


// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(session({
  secret: 'opdzjj',
  resave: false,
  saveUninitialized: false,
  cookie : {
    maxAge : 1000 * 60 * 60 * 2 // 设置 session 的有效时间，单位毫秒
  }
}))

// 日志管理
// 自定义日期
// 第一个参数是定义的项名，第二参数是方法，该方法的返回值是该项对应的值
logger.token('localDate', function (req) {
  const date = new Date()
  return date.toLocaleString()
})
logger.format('opd', ':remote-addr - :remote-user [:localDate] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')
const loggerPath = fs.createWriteStream(path.join(__dirname, 'logger.txt'), {flags: 'a'}) // 创建输出流，flags为a表示append，以追加形式写入文件
app.use(logger('dev'))
app.use(logger('opd', { stream: loggerPath })) // 使用日志中间件，并设置输出流

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// parse application/x-www-form-urlencoded baodyparser可实现直接访问req.body
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.xml())

app.use(history({
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
  rewrites: [
    {
      from: /^\/.*$/,
      to: function (context) {
        return "/"
      }
    },
    {
      from: /^\/qywx/,
      to: function (context) {
        return context.parsedUrl.path
      }
    },
    // {
    //   from: /^\/qywx/,
    //   to: function (context) {
    //     return context.parsedUrl.path
    //   }
    // }
  ]
}))

// app.use( history())

app.all("*", (req, res, next) => {
  // console.log(req.cookies)
  if('https' === req.protocol && req.hostname.startsWith('www.')){
    next()
  } else {
    console.log(`https://www.opdgr.cn${req.path}`)
    res.redirect(307, `https://www.opdgr.cn${req.path}`)
  }
})

// 静态资源放在请求拦截之后
app.use(express.static(path.join(__dirname, 'public/dist')))
app.use(express.static(path.join(__dirname, 'public/uploads')))

//路由
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/qywx', qywx)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
