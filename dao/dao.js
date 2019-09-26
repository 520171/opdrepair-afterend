const db = require('../config/db')
var mysql = require("mysql")

const pageSize = 20;
const show = (tbName) => {
    return new  Promise((resolve, reject) => {
      let sql =  `select * from ??`
      const replaces = [tbName];
      sql = mysql.format(sql, replaces)
      db.query(sql, (err, rows) => {
        if(err) {
          reject(err);
        }
        resolve(rows);
      })
    });
}//显示全部 （select*）

//删除
const deleteRows = (tbName, attributename, attributes) => {
    return new  Promise((resolve, reject) => {
        let sql = 'delete from ?? where ?? in (?)'
        const replaces = [tbName, attributename, attributes]
        sql = mysql.format(sql, replaces)
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    });
}
  
// let selectOne = (tbName, attributename, attribute) => {
//     return new Promise((resolve, reject) => {
//         db.query(`select * from ${tbName} where ${attributename} = '${attribute}'`, (err, rows) => {
//         if(err) {
//             reject(err);
//         }
//         resolve(rows);
//         })
//     })
// }

// let update = (tbName, updateattributename, newdata,attributename,attribute) => {
//     return new Promise((resolve, reject) => {
//         db.query(`update ${tbName} set ${updateattributename} = '${newdata}' where ${attributename} = '${attribute}'`,(err,rows) => {
//         if(err) {
//             reject(err);
//         }
//         resolve(rows);
//         })
//     }) 
// }//修改



//多表查询报修记录!!!
// select tb_user.*, tb_service.* from tb_user inner join tb_service on tb_user.u_jobno = tb_service.u_jobno where tb_service.u_jobno = 1001;
const selectRecords = (jobNo, flag) => {
    return new Promise((resolve, reject) => {
        let sql = flag? 'select tb_user.*, tb_service.*, tb_department.* from tb_user inner join tb_service on tb_user.u_jobno =tb_service.u_jobno inner join tb_department on tb_department.d_no = tb_user.d_no order by tb_service.s_id desc' :
          'select tb_user.*, tb_service.*, tb_department.* from tb_user inner join tb_service on tb_user.u_jobno =tb_service.u_jobno inner join tb_department on tb_department.d_no = tb_user.d_no where tb_service.u_jobno = ? order by tb_service.s_id desc'

        let replaces = [jobNo];
        sql = mysql.format(sql, replaces);
        console.log(sql);
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    })
}

//增!!!
const insert = (tbName, attributenames, attributes) => {
    return new Promise((resolve, reject) => {
        let sql = 'insert into ??(??) values(?)';
        let replaces = [tbName, attributenames, attributes];
        sql = mysql.format(sql, replaces);
        db.query(sql, (err,rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    })
}

//单表查询!!!
const select = (tbName, colNames, attributename, attribute) => {
    let sql = 'select ?? from ?? where ?? = ?';
    let replaces = [colNames, tbName, attributename, attribute];
    sql = mysql.format(sql, replaces);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    })
}

//登陆
const login = (attributename, attribute, attributename2, attribute2) => {
    let sql = 'select tb_user.*, tb_department.* from tb_user inner join tb_department on tb_department.d_no = tb_user.d_no where ?? = ? and ?? =?';
    let replaces = [attributename, attribute, attributename2, attribute2];
    sql = mysql.format(sql, replaces);
    console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    })
}

//查询留言记录
const selectDialogs = (sid) => {
    let sql = 'select da_msg, u_name, newTbl.u_jobno, da_date from (select da_id, da_msg, u_jobno, da_date from tb_dialog where s_id = ?) newTbl inner join tb_user on newTbl.u_jobno = tb_user.u_jobno order by da_id desc';
    let replaces = [sid];
    sql = mysql.format(sql, replaces);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    })
}

///////////////////////////////////////////后台sql//////////////////////////////////////////////

//单表查询!!! 后台登陆
const loginSys = (tblName, attributename, attribute, attributename2, attribute2) => {
    let sql = 'select * from ??  where ?? = ? and ?? =?';
    let replaces = [tblName, attributename, attribute, attributename2, attribute2];
    sql = mysql.format(sql, replaces);
    console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    })
}

// 跨表查询用户信息
const selectAllUsers = (pageNo, name) => {
    let sql = name ? `select tb_user.*, tb_department.* from tb_user inner join tb_department on tb_department.d_no = tb_user.d_no where u_name like ? limit ?, ?`:
      `select tb_user.*, tb_department.* from tb_user inner join tb_department on tb_department.d_no = tb_user.d_no limit ?, ?`
    let replaces = name ? [`%${name}%`, (pageNo-1)*pageSize, pageSize] : [(pageNo-1)*pageSize, pageSize];
    sql = mysql.format(sql, replaces);
    console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    })
}

// 查询表的记录数，用于前端分页
const selectTotalNum = (tblName, key , colName, name) => {
    console.log(name);
    let sql = name ? 'select ?? from ?? where ?? like ?' : 'select ?? from ??'
    let replaces = [key, tblName, colName, `%${name}%`]
    sql = mysql.format(sql, replaces);
    console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows?rows.length : 0);
        })
    })
}

// 更新员工
const updateUser = (attribute, attribute2, attribute3, attribute4, attribute5, attribute6) => {
    return new  Promise((resolve, reject) => {
        let sql = 'update tb_user set u_name = ?, u_jobno = ?, d_no = ?, u_gender = ?, u_flag = ? where u_id = ?';
        const replaces = [attribute, attribute2, attribute3, attribute4, attribute5, attribute6]
        sql = mysql.format(sql, replaces)
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    });
}

// /////////////////////部门管理////////////////////////////////////////////
// 查询所有的部门
const selectAllDepartments = (tblName, pageNo, name) => {
    let sql = name ? `select * from ?? where d_name like ? limit ?, ?` : `select * from ?? limit ?, ?`
    let replaces = name ? [tblName, `%${name}%`, (pageNo-1)*pageSize, pageSize] : [tblName, (pageNo-1)*pageSize, pageSize];
    sql = mysql.format(sql, replaces);
    console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    })
}

// 更新部门
const updateDepartment = (attribute, attribute2, attribute3) => {
    return new  Promise((resolve, reject) => {
        let sql = 'update tb_department set d_no = ?, d_name = ? where d_id = ?';
        const replaces = [attribute, attribute2, attribute3]
        sql = mysql.format(sql, replaces)
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    });
}

// ///////////////////////////////报修记录管理//////////////////////////////////
// 查询所有的报修记录
const selectRepairs = (colName, pageNo, name) => {
    let sql = name ? `select tb_user.*, tb_service.*, tb_department.* from tb_user inner join tb_department on tb_user.d_no = tb_department.d_no inner join tb_service on tb_service.u_jobno = tb_user.u_jobno where ?? like ? order by tb_service.s_id desc limit ?, ?` :
      `select tb_user.*, tb_service.*, tb_department.* from tb_user inner join tb_department on tb_user.d_no = tb_department.d_no inner join tb_service on tb_service.u_jobno = tb_user.u_jobno order by tb_service.s_id desc limit ?, ?`
    let replaces = name ? [colName, `%${name}%`, (pageNo-1)*pageSize, pageSize] : [(pageNo-1)*pageSize, pageSize ];
    sql = mysql.format(sql, replaces);
    console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    })
}

// 查询报修记录数，用于前端分页
const selectTotalServicesNum = (colName, name) => {
    console.log(name);
    let sql = name ? 'select s_id from tb_user inner join tb_department on tb_user.d_no = tb_department.d_no inner join tb_service on tb_service.u_jobno = tb_user.u_jobno where ?? like ?' :
      'select s_id from tb_user inner join tb_department on tb_user.d_no = tb_department.d_no inner join tb_service on tb_service.u_jobno = tb_user.u_jobno'
    let replaces = [colName, `%${name}%`]
    sql = mysql.format(sql, replaces);
    console.log(sql);
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows?rows.length : 0);
        })
    })
}

// ////////////////////////acctoken///////////////////////


const updateAccTokenByAgentId = function(msg, date, agentId){
    return new  Promise((resolve, reject) => {
        let sql = 'update tb_acctoken set at_msg = ?, at_date = ? where at_agentid = ?'
        const replaces = [msg, date, agentId]
        sql = mysql.format(sql, replaces)
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err);
            }
            resolve(rows);
        })
    });
}

// //////////////////统计//////////////////////////////////
const selectStatistics = function(){
    return new  Promise((resolve, reject) => {
        let sql = 'SELECT tb_user.d_no, d_name as name, count(tb_user.d_no) as value FROM tb_service inner join tb_user on tb_service.u_jobno = tb_user.u_jobno inner join tb_department on tb_department.d_no = tb_user.d_no  group by tb_user.d_no;'
        console.log(sql);
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err)
            }
            resolve(rows)
        })
    });
}

const selectStatistics2 = function(){
    return new  Promise((resolve, reject) => {
        let sql = 'SELECT s_type as type, count(s_type) as num FROM tb_service group by s_type;'
        console.log(sql);
        db.query(sql, (err, rows) => {
            if(err) {
                reject(err)
            }
            resolve(rows)
        })
    });
}


module.exports = { selectRecords, insert, select, selectDialogs, login, loginSys, selectTotalNum,
     selectAllUsers, selectAllDepartments, show, deleteRows, updateDepartment, updateUser, selectRepairs,
    selectTotalServicesNum, updateAccTokenByAgentId, selectStatistics,selectStatistics2 }

