const config = {
  token: 'opd123', //对应测试号接口配置信息里填的token
  appid: 'wx918ba0151645eaa2', //对应测试号信息里的appID
  secret: 'bc37c41d9d811c67383cfb0653b0bb29', //对应测试号信息里的appsecret
  grant_type: 'client_credential' //默认
}

// 企业微信开发的配置
const corpsConfig = {
  corpid: 'wwdd83397758bfd8ec',
  corpsecret: '-hVKG-w3ISUMpuXjbRq6znH7OTbdbv3rKVozvjGnc6o',
  AgentId: '1000002',
  token: 'opd',
  encodingAESKey: '7GAjqNCeI69B93q4XQXkepbGpaNqom3S2D9PSRNMcPQ'
}

// 小程序开发配置
const xcxConfig = {
  AppID: 'wx4b26aefcc1c5b55f',
  AppSecret: 'a3671ea331d4c4669c9f3c86ef723928',
  grant_type: 'client_credential'
}

module.exports = {
  config,
  corpsConfig,
  xcxConfig
}
