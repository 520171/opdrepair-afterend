const express = require('express');
const router = express.Router();
const config = require('../config/config').corpsConfig
const wxUtil = require('../utils/wxUtil')
const configWX = {
  token: config.token, // 随机数，用于消息服务器验证
  encodingAESKey: config.encodingAESKey, // 消息加密密钥
  corpid: config.corpid, // 公司ID
  secret: config.secret, // 应用密钥
  agentid: config.AgentId, // 应用ID
  touser: 'ZhongJunJie', // userID
}

const wxcpt = new wxUtil.WorkWechat(configWX);

router.get('/', function(req, res, next){
  wxcpt.connectServer(req, res)
})

router.post('/', function(req, res, next){
  const xml = wxcpt.getMsgObj(req)
  switch (xml.MsgType[0]) {
    case 'text':
      console.log(xml.Content[0])
      // wxcpt.reply(res, {type: 'text', content: '冯绍峰'})
      wxcpt.reply(res,{ type: 'text', content: `被动回复测试：${xml.Content[0]}` })
      break;
    case 'voice':
      console.log('voice')
      wxcpt.reply(res,{ type: 'text', content: `被动回复测试：暂未添加语音识别功能` })
      break;
    case 'video':
      console.log('video')
      wxcpt.reply(res,{ type: 'text', content: `被动回复测试：暂未添加视频识别功能` })
      break;
    case 'image':
      console.log('image')
      wxcpt.reply(res,{ type: 'text', content: `被动回复测试：暂未添加图片识别功能` })
      break;
    case 'location':
      console.log('location')
      wxcpt.reply(res,{ type: 'text', content: `被动回复测试：暂未添加位置识别功能` })
      break;
    case 'link':
      console.log('link')
      wxcpt.reply(res,{ type: 'text', content: `被动回复测试：暂未添加链接识别功能` })
      break;
  }
})

module.exports = router