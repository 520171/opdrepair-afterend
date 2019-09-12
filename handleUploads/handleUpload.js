const multer  = require('multer');

///该方法用于设置小程序上传的图片，视频等资源的路径及修改后缀名
let getUload = function(pathName){
    let storage = multer.diskStorage({
        //设置上传后文件路径，uploads文件夹会自动创建。
        destination: `public/uploads/${pathName}/`,
        //给上传文件重命名，获取添加后缀名
        filename: function (req, file, cb) {
            cb(null,  file.originalname);
         }
    }); 
    
    let upload = multer({
        storage: storage
    });

    return upload.single('file');
}


module.exports = getUload;