const request = require('request')
const crypto = require('crypto')
const XMLParser = require('xml2js')
const thunkify = require('thunkify')
const Templates = require('./templates')
const fs = require('fs')

// config格式
// const configWX = {
//   token: config.token, // 随机数，用于消息服务器验证
//   encodingAESKey: config.encodingAESKey, // 消息加密密钥
//   corpid: config.corpid, // 公司ID
//   secret: config.secret, // 应用密钥
//   agentid: config.AgentId, // 应用ID
//   touser: 'ZhongJunJie', // userID
// }

let parseXML = thunkify(XMLParser.parseString)
let buildXML = new XMLParser.Builder({
  rootName:'xml',
  cdata:true,
  headless:true,
  renderOpts: {
    indent:' ',
    pretty:'true'
  }
})

let base = {
  url: 'https://qyapi.weixin.qq.com/cgi-bin',
}

const WorkWechat = function (options) {
  this.options = options
  this.res = null
  this.secret = this.options.secret
  this.agentid = this.options.agentid
  this.touser = this.options.touser
  // 验证 URL 所需参数
  this.token = this.options.token
  this.corpid = this.options.corpid
  this.aesKey = Buffer.from(this.options.encodingAESKey + '=', 'base64')
  this.iv = this.aesKey.slice(0, 16)

}

WorkWechat.prototype = {
  constructor: WorkWechat,
  timestamp (delay) {
    delay = Number(delay) || 0
    return parseInt(new Date().valueOf() / 1000) + delay * 1000
  },
  PKCS7Decoder (buff) {
    let pad = buff[buff.length - 1]
    if (pad < 1 || pad > 32) {
      pad = 0
    }
    return buff.slice(0, buff.length - pad)
  },
  PKCS7Encode(buff) {
    let blockSize = 32
    let needPadLen = 32 - buff.length % 32
    if( needPadLen == 0) {
      needPadLen = blockSize
    }
    let pad = Buffer.allocUnsafe(needPadLen)
    pad.fill(needPadLen)
    let newBuff = Buffer.concat([buff, pad])
    return newBuff
  },
  encrypt (xmlMsg) {
    /*
     *@params String xmlMsg 格式化后的 xml 字符串
     *@return String 加密后的字符串 填入到 Encrypt 节点中
     * 参照官方文档 需要返回一个buf: 随机16字节 + xmlMsg.length(4字节）+xmlMsg+appid。
     * buf的字节长度需要填充到 32的整数，填充长度为 32-buf.length%32, 每一个字节为 32-buf.length%32
     */
    let random16 = crypto.pseudoRandomBytes(16)
    let msg = Buffer.from(xmlMsg)
    let msgLength = Buffer.allocUnsafe(4)
    msgLength.writeUInt32BE(msg.length, 0)
    let corpid = Buffer.from(this.corpid)
    let raw_msg = Buffer.concat([random16, msgLength, msg, corpid])
    let cipher = crypto.createCipheriv('aes-256-cbc', this.aesKey, this.iv)
    cipher.setAutoPadding(false)//重要，autopadding填充的内容无法正常解密
    raw_msg = this.PKCS7Encode(raw_msg)
    let cipheredMsg = Buffer.concat([cipher.update(/*encoded*/raw_msg), cipher.final()])
    return cipheredMsg.toString('base64')
  },
  decrypt (echostr) {
    let aesCipher = crypto.createDecipheriv("aes-256-cbc", this.aesKey, this.iv)
    aesCipher.setAutoPadding(false)
    let decipheredBuff = Buffer.concat([aesCipher.update(echostr, 'base64'), aesCipher.final()])
    decipheredBuff = this.PKCS7Decoder(decipheredBuff)
    let len_netOrder_corpid = decipheredBuff.slice(16)
    let msg_len = len_netOrder_corpid.slice(0, 4).readUInt32BE(0)
    let result = len_netOrder_corpid.slice(4, msg_len + 4).toString()

    return result // 返回一个解密后的明文
  },
  getSignature (token, timestamp, nonce, echostr) {

    let key =  [token, timestamp, nonce, echostr].sort().join('')
    let sha1 = crypto.createHash('sha1')
    sha1.update(key)

    return sha1.digest('hex')
  },
  verifyURL (signature, token, timestamp, nonce, echostr) {
    return this.getSignature(token, timestamp, nonce, echostr) == signature
  },
  // 消息加密
  encryptMsg (replyMsg, opts) {
    let options = opts || {}
    let encrypt = this.encrypt(replyMsg)
    let nonce = options.nonce || parseInt((Math.random() * 10000000000), 10)
    let timestamp = options.timestamp || this.timestamp()
    let msgsignature = this.getSignature(this.token, timestamp, nonce, encrypt)
    // 标准回包
    let resXml = `
      <xml>
        <Encrypt><![CDATA[${encrypt}]]></Encrypt>
        <MsgSignature><![CDATA[${msgsignature}]]></MsgSignature>
        <TimeStamp>${timestamp}</TimeStamp>
        <Nonce><![CDATA[${nonce}]]></Nonce>
      </xml>
    `

    return resXml
    // result.Encrypt = this.encrypt(replyMsg)
    // result.Nonce = options.nonce || parseInt((Math.random() * 10000000000), 10)
    // result.TimeStamp = options.timestamp || this.timestamp()
    // result.MsgSignature = this.getSignature(this.token, result.TimeStamp, result.Nonce, result.Encrypt)
    // return buildXML.buildObject(result)
  },
  // 消息解密
  decryptMsg (msgSignature, token, timestamp, nonce, echostr) {
    let msgEncrypt = echostr.Encrypt
    if (this.getSignature(token, timestamp, nonce, msgEncrypt) != msgSignature) {
      console.log('消息签名不一致')
      return false
    }
    let decryptedMsg = this.decrypt(msgEncrypt)
    return parseXML(decryptedMsg, {explicitArray: false})
  },
  /**
   * 解析请求中的文字信息
   * eg.
   * <xml>
   *   ...
   *   <Content>hello world</Content>
   * </xml>
   *
   * return hello world
   */
  getMsg (req) {
    let xmlMsg = this.decrypt(req.body.xml.Encrypt[0])
    let data = null
    XMLParser.parseString(xmlMsg, function (err, result) {
      data = result
    })
    return data.xml.Content[0]
  },
  getMsgObj (req) {
    let xmlMsg = this.decrypt(req.body.xml.Encrypt[0])
    let data = null
    XMLParser.parseString(xmlMsg, function (err, result) {
      data = result
    })
    // console.log(data)
    return data.xml
  },
  // 获取 access_token
  getAccessToken () {
    let url = `${base.url}/gettoken?corpid=${ this.corpid }&corpsecret=${ this.secret }`
    let options = {
      method: 'GET',
      url: url
    }
    return new Promise((resolve, reject) => {
      request(options, function (err, res, body) {
        if (res) {
          resolve(JSON.parse(body))
        } else {
          reject(err)
        }
      })
    })
  },
  saveToken () {
    this.getAccessToken().then(res => {
      let token = res['access_token']
      fs.writeFile('./token', token, function (err) {
        console.log('token saved.')
      })
    })
  },
  updateToken () {
    this.saveToken()
    setInterval(function () {
      this.saveToken()
    }, 7000 * 1000) // ≈ 2h
  },
  /**
   * 接收消息服务器配置
   */
  connectServer (req, res) {
    let msg = req.query
    if (this.verifyURL(msg.msg_signature, this.token, msg.timestamp, msg.nonce, msg.echostr)) {
      res.send(this.decrypt(msg.echostr))
    } else {
      console.log('Error!')
    }
  },
  /**
   * 被动回复消息
   * @param {Object} options - 配置对象{type:[text|image|...], content: ['hello'|'hi, <a>...</a>']}
   * 文本类型的回复options {type:text, content: 'xxx'}
   */
  reply(res, options) {
    let config = {
      toUser: this.touser,
    }
    // console.log(options)
    this.res = res
    this.res.writeHead(200, { 'Content-Type': 'application/xml' })
    let resMsg = Templates[options.type](config.toUser, this.corpid, this.timestamp(), options.content)
    // console.log('resMsg')
    // console.log(resMsg)
    let msgEncrypt = this.encryptMsg(resMsg)
    // console.log(msgEncrypt)
    this.res.end(msgEncrypt)
  }
}

module.exports = {
  WorkWechat
}
