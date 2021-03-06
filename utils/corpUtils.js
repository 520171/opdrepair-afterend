const request = require('request')
const config = require('../config/config').corpsConfig
const accToken = require('../server/server').acc
// const sha1 = require('node-sha1') //加密模块
// const crypto = require('crypto')


const getAccessToken = function (config, edit=false) {
  const currentSeconds = new Date().getTime()
  return new Promise((res, rej) =>{
    if(!edit){
      accToken.showAccessToken('tb_acctoken', '*', 'at_agentid', config.AgentId)
        .then(msg => {
          if(0 != msg.length){
            if(currentSeconds - msg[0].at_date >= 6000000){
              requestAccessToken(config)
                .then(accessToken => {
                  // console.log(`change:${accessToken}`)
                  res(accessToken)
                  accToken.editAccTokenByAgentId(accessToken, currentSeconds, config.AgentId)
                })
                .catch(err => rej(err))
            }else{
              res(msg[0].at_msg)
            }
          }else{
            requestAccessToken(config)
              .then(accessToken => {
                res(accessToken)
                accToken.addAccessToken('tb_acctoken', ['at_agentid', 'at_msg', 'at_date'], [config.AgentId, accessToken, currentSeconds])
              })
              .catch(err => err)
          }
        })
        .catch(err => rej('error'))
    } else {
      // console.log(`tokenelse`)
      requestAccessToken(config)
        .then(accessToken => {
          // console.log(`change:${accessToken}`)
          res(accessToken)
          accToken.editAccTokenByAgentId(accessToken, currentSeconds, config.AgentId)
        })
        .catch(err => rej(err))
    }
  })
}

const requestAccessToken = function(config){
  // let result = 0
  // const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=${grant_type}&appid=${appid}&secret=${secret}`
  const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${config.corpid}&corpsecret=${config.corpsecret}`
  return new Promise((res, rej) => {
    request(url, function(error, response, body) {
      body = JSON.parse(body)
      if (!error && response.statusCode == 200 && 0 == body.errcode) {
        res(body.access_token)
      } else {
        rej('err')
      }
    })
  })
}
// 企业微信报修请求模板
function sendTemplateMsg(access_token, touser, userName, department, detail, config) {
  // const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}` //发送模板消息的接口
  const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${access_token}` //发送模板消息的接口
  const requestData = { //发送模板消息的数据
    "touser": touser,
    "msgtype": "text",
    "agentid" : config.AgentId,
    "text" : {
      "content" : `你有新的报修请求\n报修人：${userName}\n报修人所属部门：${department}\n故障现象：${detail}`
    },
  }
  request({
    body: JSON.stringify(requestData),
    method: "POST",//请求方式，默认为get
    url: url
  }, function(error, response, body) {
    console.log(body)
    body = JSON.parse(body)
    if (!error && response.statusCode == 200) {
      if(0 == body.errcode){
        console.log('消息推送成功')
      } else if(40014 == body.errcode|| 42001 == body.errcode) {
        getAccessToken(config,true)
          .then(token => {
            console.log(`token:${token}`)
            sendTemplateMsg(token, touser, userName, department, detail)
          })
          .catch(err => console.log(err))
      }
    } else {
      console.log('消息推送失败')
    }
  })
}



// 小程序通知消息
function sendXCXMsg(access_token, config){
  const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${access_token}`
  const requestData = {
    "touser" : config.touser,
    "msgtype" : config.msgtype,
    "miniprogram_notice" : config.miniprogram_notice
  }
  request({
    body: JSON.stringify(requestData),
    method: "POST",//请求方式，默认为get
    url: url
  }, function(error, response, body) {
    console.log(body)
    body = JSON.parse(body)
    if (!error && response.statusCode == 200) {
      if(0 == body.errcode){
        console.log('消息推送成功')
      } else if(40014 == body.errcode || 42001 == body.errcode) {
        getAccessToken(config, true)
          .then(token => {
            console.log(`token:${token}`)
            sendXCXMsg(token, config)
          })
          .catch(err => console.log(err))
      }
    } else {
      console.log(body.errcode)
    }
  })
}

// /////////////解密/////////////////////////////////////////////////////
//
// function decrypt(req, token, encodingAESKey, encrypt) {
//   const query = req.query
//   // console.log('Request URL: ', req.url)
//   const signature = query.msg_signature
//   const timestamp = query.timestamp
//   const nonce = query.nonce
//   let echostr
//   // console.log('encrypt', encrypt)
//   if (!encrypt) {
//     echostr = query.echostr
//   } else {
//     echostr = encrypt
//   }
//   // console.log('timestamp: ', timestamp)
//   // console.log('nonce: ', nonce)
//   // console.log('signature: ', signature)
//   // 将 token/timestamp/nonce 三个参数进行字典序排序
//   const tmpArr = [token, timestamp, nonce, echostr]
//   const tmpStr = sha1(tmpArr.sort().join(''))
//   console.log('Sha1 String: ', tmpStr)
//   // 验证排序并加密后的字符串与 signature 是否相等
//   if (tmpStr === signature) {
//     // 原样返回echostr参数内容
//     const result = _decode(echostr, encodingAESKey)
//     // console.log('last', result)
//     // console.log('Check Success')
//     return result
//   } else {
//     // console.log('Check Failed')
//     return 'failed'
//   }
// }
//
// function PKCS7Decoder (buff) {
//   let pad = buff[buff.length - 1]
//   if (pad < 1 || pad > 32) {
//     pad = 0
//   }
//   return buff.slice(0, buff.length - pad)
// }
//
// function _decode(data, encodingAESKey) {
//   let aesKey = Buffer.from(encodingAESKey + '=', 'base64')
//   let aesCipher = crypto.createDecipheriv("aes-256-cbc", aesKey, aesKey.slice(0, 16))
//   aesCipher.setAutoPadding(false)
//   let decipheredBuff = Buffer.concat([aesCipher.update(data, 'base64'), aesCipher.final()])
//   decipheredBuff = PKCS7Decoder(decipheredBuff)
//   let len_netOrder_corpid = decipheredBuff.slice(16)
//   let msg_len = len_netOrder_corpid.slice(0, 4).readUInt32BE(0)
//   const result = len_netOrder_corpid.slice(4, msg_len + 4).toString()
//   return result // 返回一个解密后的明文-
// }

// requestAccessToken()
//   .then(msg => console.log(msg))
//   .catch(msg => console.log(msg))

// getAccessToken('1000002')
//   .then(msg => console.log(msg))
//   .catch(err => console.log(err))

// 处理多段请求
const handlePostMsg = function(req){
  return new Promise((resolve, reject) => {
    let data = ''
    req.setEncoding('utf8')
    req.on('error', () => {
      reject({'error': 1})
    })
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      resolve(data)
    })
  })
}

// 明文被动回复--text
// const msg_encrypt = function(toUser, fromUser, createTime, content){
//   return `<xml>
//    <ToUserName><![CDATA[${toUser}]]></ToUserName>
//    <FromUserName><![CDATA[${fromUser}]]></FromUserName>
//    <CreateTime>1348831860</CreateTime>
//    <MsgType><![CDATA[text]]></MsgType>
//    <Content><![CDATA[${content}]]></Content>
//   </xml>`
// }

// 被动响应包的数据
// const responseText = function(msg_encrypt, msg_signature, timestamp, nonce, corpid, encodingAESKey){
//   msg_encrypt = encrypt(corpid, msg_encrypt, encodingAESKey)
//   return `
//     <xml>
//      <Encrypt><![CDATA[${msg_encrypt}]]></Encrypt>
//      <MsgSignature><![CDATA[${msg_signature}]]></MsgSignature>
//      <TimeStamp>${timestamp}</TimeStamp>
//      <Nonce><![CDATA[${nonce}]]></Nonce>
//     </xml>`
// }

// /////////////////加密////////////////////////////////////////
// const encrypt  = function(corpid, content, encodingAESKey){
//   let aesKey  = new Buffer(encodingAESKey + '=', 'base64')
//   let IV = aesKey.slice(0, 16)
//   let random16 = crypto.pseudoRandomBytes(16)
//   let msg = new Buffer(content)
//   let msgLength = new Buffer(4)
//   msgLength.writeUInt32BE(msg.length, 0)
//
//   let corpId = new Buffer(corpid)
//
//   let raw_msg = Buffer.concat([random16,msgLength,msg ,corpId])
//   let cipher = crypto.createCipheriv('aes-256-cbc', aesKey, IV)
//
//   cipher.setAutoPadding(false)//重要，autopadding填充的内容无法正常解密
//   raw_msg = this.PKCS7Encode(raw_msg)
//
//   let cipheredMsg = Buffer.concat([cipher.update(/*encoded*/raw_msg), cipher.final()])
//   return cipheredMsg.toString('base64')
// }
//
// PKCS7Encode = function (buff) {
//   let blockSize = 32
//   let needPadLen = 32 - buff.length % 32
//   if( needPadLen == 0) {
//     needPadLen = blockSize
//   }
//   let pad = new Buffer(needPadLen)
//   pad.fill(needPadLen)
//   let newBuff = Buffer.concat([buff, pad])
//   return newBuff
// }

const sendRepairMsg = function(config) {
  // const config = {
  //   req,
  //   touser,
  //   name,
  //   jobNo,
  //   description
  // }
  const wxWorkconfig = {
    "AgentId": "1000003",
    "corpsecret": "P2Ujgzi6iQTKerguLUCmh66ZYVL3HWVJgvoIhF9GOU4",
    "corpid": "wwdd83397758bfd8ec",
    "touser" : config.touser || "ZhongJunJie",
    "msgtype": "miniprogram_notice",
    "miniprogram_notice" : {
      "appid": "wx4b26aefcc1c5b55f",
      "page": `pages/index/index?name=${config.name}&jobNo=${config.jobNo}`,
      "title": "报修消息推送",
      "description": config.description,
      "content_item": [
        {
          "key": "报修人姓名",
          "value": config.req.body.name
        },
        {
          "key": "所属部门",
          "value": config.req.body.departmentName
        },
        {
          "key": "报修类型",
          "value": 1 == config.req.body.malfunctionNo? "电脑故障" : 2 == config.req.body.malfunctionNo? '打印机故障' : "其他问题"
        },
        {
          "key": "报修详情",
          "value": config.req.body.detailMsg || "空"
        },
        {
          "key": "报修时间",
          "value": config.req.body.date
        }
      ]
    }
  }
  getAccessToken(wxWorkconfig)
    .then(token => {
      // console.log(token)
      sendXCXMsg(token, wxWorkconfig)
    })
    .catch(err => {
      console.log(err)
      // console.log(err)
    })
}

const sendReplyMsg = function(config) {
  // const config = {
  //   req,
  //   touser,
  //   name,
  //   jobNo,
  //   description
  // }
  const wxWorkconfig = {
    "AgentId": "1000003",
    "corpsecret": "P2Ujgzi6iQTKerguLUCmh66ZYVL3HWVJgvoIhF9GOU4",
    "corpid": "wwdd83397758bfd8ec",
    "touser" : config.touser || "ZhongJunJie",
    "msgtype": "miniprogram_notice",
    "miniprogram_notice" : {
      "appid": "wx4b26aefcc1c5b55f",
      "page": `pages/index/index?name=${config.name}&jobNo=${config.jobNo}`,
      "title": "报修消息推送",
      "description": config.description,
      "content_item": [
        {
          "key": "报修详情",
          "value": config.req.body.s_msg || "空"
        },
        {
          "key": "报修时间",
          "value": config.req.body.s_date || "空"
        },
        {
          "key": "回复人",
          "value": config.req.body.name || "空"
        },
        {
          "key": "回复时间",
          "value": config.req.body.date || "空"
        },
        {
          "key": "回复内容",
          "value": config.req.body.dialog || "空"
        }
      ]
    }
  }
  getAccessToken(wxWorkconfig)
    .then(token => {
      // console.log(token)
      sendXCXMsg(token, wxWorkconfig)
    })
    .catch(err => {
      console.log(err)
      // console.log(err)
    })
}



module.exports = {
  getAccessToken,
  // sendTemplateMsg,
  handlePostMsg,
  // sendXCXMsg,
  sendRepairMsg,
  sendReplyMsg
}
