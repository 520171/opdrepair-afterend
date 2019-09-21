const dao = require("../dao/dao");

/*
!!!
     添加记录
     tbName：表名
     arr1：字段名数组
     arr2：字段值数组
 */


const addRepairMsg = function(tbName, arr1, arr2){
    /* try {
        let result = await dao.insert(tbName, arr1, arr2);
        result;
    } catch (e) {
        return e;
    } */
    return dao.insert(tbName, arr1, arr2);

}

//将附件路径写入持久层!!!
const addImgUrl = function(tbName, arr1, arr2){
    return addRepairMsg(tbName, arr1, arr2);
}

//将留言记录写入持久层!!!
const addDialog = function(tbName, arr1, arr2){
    return addRepairMsg(tbName, arr1, arr2);
}

/////////////////////////////////////////////////////////////////

//获取报修记录!!!
const showRecords = function(jobNo, flag){
    return dao.selectRecords(jobNo, flag);
}

const showAnnex = function(tbName, colName, attributename, attribute){
    return dao.select(tbName, colName, attributename, attribute);
}

const showDialogs = function(sid){
    return dao.selectDialogs(sid);
}

const login = function( attributename, attribute, attributename2, attribute2){
    return dao.login( attributename, attribute, attributename2, attribute2);
}

const logSys = async function(tblName, attributename, attribute, attributename2, attribute2){
    return dao.loginSys(tblName, attributename, attribute, attributename2, attribute2);
}

const checkAllUsers = function(pageNo, name){
    return dao.selectAllUsers(pageNo, name)
}

const checkTotalNum = function(tblName, key, colName, name){
    return dao.selectTotalNum(tblName, key, colName, name);
}

const checkAllDepartments = function(tblName, pageNo, name){
    return dao.selectAllDepartments(tblName, pageNo, name)
}

const checkAll = function (tblName) {
    return dao.show(tblName)
}

// 查询用户类型
const checkUserType = function(tbName, colName, attributename, attribute){
  return dao.select(tbName, colName, attributename, attribute)
}

// 新增员工
const addUser = function(tbName, arr1, arr2){
    return addRepairMsg(tbName, arr1, arr2);
}

// 删除员工
const removeUsers = function(tbName, attributename, attributes){
    return dao.deleteRows(tbName, attributename, attributes)
}

//更新员工
const editUser = function(attribute, attribute2, attribute3, attribute4, attribute5, attribute6){
    return dao.updateUser(attribute, attribute2, attribute3, attribute4, attribute5, attribute6)
}

// //////////////////////////////部门管理///////////////////////
// 新增部门
const addDepartment = function(tbName, arr1, arr2){
    return addRepairMsg(tbName, arr1, arr2);
}

// 删除部门
const removeDepartments = function(tbName, attributename, attributes){
    return dao.deleteRows(tbName, attributename, attributes)
}

// 更新部门
const editDepartment =  function(attribute, attribute2, attribute3){
    return dao.updateDepartment(attribute, attribute2, attribute3)
}

// //////////////////////保修记录管理/////////////////////////
const checkRepairs =  function(colName, pageNo, name){
    return dao.selectRepairs(colName, pageNo, name)
}

const checkTotalServicesNum = function(colName, name){
    return dao.selectTotalServicesNum(colName, name);
}

// 删除报修记录
const removeRepairs = function(tbName, attributename, attributes){
    return dao.deleteRows(tbName, attributename, attributes)
}
// ////////////////////////accesstoken处理/////////////////////////////////////
// 插入accesstoken
const addAccessToken = function(tbName, arr1, arr2){
    return addRepairMsg(tbName, arr1, arr2)
}

const editAccTokenByAgentId = function(msg, date, agentId){
    return dao.updateAccTokenByAgentId(msg, date, agentId)
}

const showAccessToken = function(tbName, colName, attributename, attribute){
    return dao.select(tbName, colName, attributename, attribute);
}




module.exports.users = { checkAll, addRepairMsg, showRecords, addImgUrl, showAnnex, showDialogs,
    addDialog, login, checkUserType }
module.exports.index = {logSys, checkAllUsers, checkTotalNum, checkAllDepartments, addDepartment,
    removeDepartments, editDepartment, addUser, removeUsers, checkAll, editUser, checkRepairs,
    checkTotalServicesNum, removeRepairs }
module.exports.acc = { addAccessToken, showAccessToken, editAccTokenByAgentId }