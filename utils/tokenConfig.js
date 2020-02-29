const jwt = require('jsonwebtoken')
const expressJwt = require("express-jwt")
const secret = 'zjj' // 设置


// 过滤
const tokenFilter = function(req) {
  return req.originalUrl.startsWith('/users') || req.originalUrl === '/login' || req.originalUrl === '/' || req.originalUrl.startsWith('/qywx')
}

// 生成token
const generatorToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: 60*60*72 })
}


// 验证token
const analyzeToken = expressJwt({
  secret
}).unless(tokenFilter)

// 处理401错误
const handleErr = function (err, req, res, next) {
  // console.log(req.headers)
  if ('UnauthorizedError' === err.name) {
    res.status(401).send('未授权！！！')
  } else {
    next(err)
  }
}

module.exports = {
  generatorToken,
  analyzeToken,
  handleErr
}