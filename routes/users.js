//users路由
var express = require('express')
var router = express.Router()
const getUload = require('../handleUploads/handleUpload')
const server = require('../server/server').users
const utils = require('../utils/corpUtils')
const config = require('../config/config').corpsConfig
const xcxUtils = require('../utils/xcxUtils')
// var upload = multer({ dest: 'uploads/'}) // 文件储存路径
// upload.single('file')//中的参数是post提交的文件的key

let path = 'medias'

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource')
// })

//上传报修附件，并将附件地址存入数据库 !!!
router.post('/uploadImage', getUload(path), function(req, res, next) {
  // console.log(req.body)
  // console.log(req.file)
  let sid = req.body.insertId
  let url = `https://www.opdgr.cn/${path}/${req.file.filename}`
  let isImg = ('video/mp4' == req.file.mimetype ? 0:1)
  server.addImgUrl('tb_annex', ['s_id', 'a_url', 'a_isImg'], [sid, url, isImg])
  .then(function(msg){
    res.json({message: "ok", insertId: msg.insertId})
    console.log(msg)
  })
  .catch(function(msg){
    res.json({message: "fail"})
    console.log(msg)})
})

//提交报修请求 !!!
router.post('/repair',  function(req, res, next) {
  console.log(req.body)
  const arr1 = ['u_jobno', 's_type', 's_date', 's_msg']
  const arr2 = [req.body.jobNo, req.body.malfunctionNo, req.body.date, req.body.detailMsg]
  server.addRepairMsg('tb_service', arr1, arr2)
  .then(function(msg){
    res.json({ message: "ok", insertId: msg.insertId })
    // console.log('success')
    // console.log(msg)
    server.getMaintenanceStaff("tb_user", ["u_name", "u_jobno", "u_userid" ], "u_flag", "1")
      .then(msg => {
        msg.forEach(currentValue => {
          if (req.body.jobNo != currentValue.u_jobno) {
            const configuration = {
              req,
              "name": currentValue.u_name,
              "jobNo": currentValue.u_jobno,
              "touser": currentValue.u_userid,
              "description": "报修请求"
            }
            utils.sendRepairMsg(configuration)
          }
        })
      })
      .catch(err => console.log(err))
    const configuration = {
      req,
      "name": req.body.name,
      "jobNo": req.body.jobNo,
      "touser": req.body.u_userid,
      "description": "报修请求已提交"
    }
    utils.sendRepairMsg(configuration)
  })
  .catch(function(msg){
    res.json({ message: "fail" })
    // console.log('fail')
    console.log(msg)})
})


//发送留言记录 !!!
router.post('/sendDialog',  function(req, res, next) {
  console.log(req.body)
  server.addDialog('tb_dialog', ['s_id', 'u_jobno', 'da_msg', 'da_date'], [req.body.sid, req.body.jobNo, req.body.dialog, req.body.date])
    .then(function(msg){
    // console.log(msg)
      if(req.body.u_flag){
        // 1
        if (req.body.jobNo != req.body.to_jobNo) {
          const configuration = {
            req,
            "name": req.body.to_name,
            "jobNo": req.body.to_jobNo,
            "touser": req.body.to_u_userid,
            "description": "维修人员回复"
          }
          utils.sendReplyMsg(configuration)
        }
      } else {
        // 0
        server.getMaintenanceStaff("tb_user", ["u_name", "u_jobno", "u_userid" ], "u_flag", "1")
          .then(msg => {
            msg.forEach(currentValue => {
              console.log(currentValue)
              const configuration = {
                req,
                "name": currentValue.u_name,
                "jobNo": currentValue.u_jobno,
                "touser": currentValue.u_userid,
                "description": "报修人回复"
              }
              utils.sendReplyMsg(configuration)
            })
          })
          .catch(err => console.log(err))
      }
    return server.showDialogs(req.body.sid)
  })
    .then(function (msg){
    // console.log(msg)
    res.json({message: msg})})
    .catch(function(msg){
    // console.log(msg)
    res.json({message: "fail"})})
})

// ////////////////////////查询///////////////////////////////////////////////////

// 获取报修记录!!!
router.post('/getMsg',  function(req, res, next) {
  // console.log(req.body)
  const jobNo = req.body.jobNo
  server.checkUserType('tb_user', 'u_flag', 'u_jobno', jobNo)
    .then(msg => {
        return server.showRecords(req.body.jobNo, msg[0].u_flag)
    })
    .then(function(msg){
    // console.log(msg)
    res.json({message: msg})})
    .catch(function(msg){
    // console.log(msg)
    res.json({message: "fail"})})

})

//获取报修附件!!!
router.post('/getAnnex',  function(req, res, next) {
  console.log(req.body)
  let sid = req.body.sid
  console.log(sid)
  server.showAnnex('tb_annex', ['a_url', 'a_isImg'], 's_id', sid)
  .then(function(msg){
    console.log(msg)
    res.json({message: msg})})
  .catch(function(msg){
    console.log(msg)
    res.json({message: "fail"})})
})

//获取留言记录!!!!

router.post('/getDialogs',  function(req, res, next) {
  // console.log(req.body)
  let sid = req.body.sid
  // console.log(sid)
  server.showDialogs(sid)
  .then(function(msg){
    // console.log(msg)
    res.json({message: msg})})
  .catch(function(msg){
    // console.log(msg)
    res.json({message: "fail"})})
})

//小程序端登陆验证
router.post('/login',  function(req, res, next) {
  // console.log(req.body)
  // xcxUtils.getopenId(req.body.code)
  //   .then(body => {
  //     console.log(body.openid)
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })

  server.login('u_name', req.body.name, 'u_jobno', req.body.jobNo)
  .then(function(msg){
    console.log(msg)
    res.json({ message: 1 === msg.length?'ok':'fail', msg: msg}) })
  .catch(function(msg){
    // console.log(msg)
    res.json({ message: "fail" })})
})

module.exports = router
