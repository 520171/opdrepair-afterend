const request = require('request')
const config = require('../config/config').xcxConfig
const accToken = require('../server/server').acc
const fs = require('fs')
const path = require('path')

const getAccessToken = function (agentID, edit=false) {
  const currentSeconds = new Date().getTime()
  return new Promise((res, rej) =>{
    if(!edit){
      accToken.showAccessToken('tb_acctoken', '*', 'at_agentid', agentID)
        .then(msg => {
          if(0 != msg.length){
            if(currentSeconds - msg[0].at_date >= 6000000){
              requestAccessToken()
                .then(accessToken => {
                  // console.log(`change:${accessToken}`)
                  res(accessToken)
                  accToken.editAccTokenByAgentId(accessToken, currentSeconds, agentID)
                })
                .catch(err => rej(err))
            }else{
              res(msg[0].at_msg)
            }
          }else{
            requestAccessToken()
              .then(accessToken => {
                res(accessToken)
                accToken.addAccessToken('tb_acctoken', ['at_agentid', 'at_msg', 'at_date'], [agentID, accessToken, currentSeconds])
              })
              .catch(err => err)
          }
        })
        .catch(err => rej('error'))
    } else {
      // console.log(`tokenelse`)
      requestAccessToken()
        .then(accessToken => {
          // console.log(`change:${accessToken}`)
          res(accessToken)
          accToken.editAccTokenByAgentId(accessToken, currentSeconds, agentID)
        })
        .catch(err => rej(err))
    }
  })
}

const requestAccessToken = function(){
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.AppID}&secret=${config.AppSecret}`
  return new Promise((res, rej) => {
    request(url, function(error, response, body) {
      body = JSON.parse(body)
      // console.log(body)
      if (!error && response.statusCode == 200) {
        res(body.access_token)
      } else {
        rej('err')
      }
    })
  })
}

// 获取小程序码
const getQRCode = function(agentId, access_token, name, jobNo) {
  const url = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${ access_token }` //发送模板消息的接口
  const requestData = { //发送模板消息的数据
    path: `pages/index/index?name=${name}&jobNo=${jobNo}`
  }
  return new Promise((res, rej) => {
    request({
      body: JSON.stringify(requestData),
      method: "POST",//请求方式，默认为get
      url: url,
      headers: {
        "content-type": "application/json",
      },
      encoding: 'base64'
    }, function(error, response, body) {
      const msg = Buffer.from(body, 'base64').toString()
      // console.log(msg)
      if (!error && response.statusCode == 200) {
        // console.log(body)
        if (-1 == msg.indexOf('"errcode":40001')) {
          // success
          const dataBuffer = Buffer.from(body, 'base64')
          const dirPath = path.join(__dirname, `../public/uploads/QRCode/${name}_${jobNo}.jpg`)
          fs.writeFile(dirPath, dataBuffer, function(err) {
            if(err){
              rej({ msg: '图片写入失败' })
            }else{
              res({ msg: '图片写入成功' })
            }
          })
        } else {
          // token 失效
          getAccessToken(agentId, true)
            .then(token => {
              // console.log(`token:${token}`)
              getQRCode(agentId, token, name, jobNo)
            })
            .catch(err => console.log(err))
        }
      } else {
        rej({ mag: '请求qrcode失败' })
      }
    })
  })
}

const getopenId = function (code, appid = config.AppID, secret = config.AppSecret) {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
  return new Promise((res, rej) => {
    request(url, function(error, response, body) {
      body = JSON.parse(body)
      if (!error && response.statusCode == 200) {
        res(body)
      } else {
        rej('err')
      }
    })
  })
}


module.exports = {
  getQRCode,
  getAccessToken,
  getopenId
}

// getAccessToken('1000003', false)
//   .then(token => {
//     getQRCode('1000003', 10001 , '马悦', '1002')
//   })
//   .catch(err => {console.log(err)})
