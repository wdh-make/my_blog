const fs = require('fs')
const path = require("path")
/**
 *生成多层目录
 * @param dir 多层目录
 * @param split 分隔符，ex:'/' 对应的目录地址:'2015/10/10'
 * @param mode 目录权限（读写权限），默认0777
 * @param callback
 */
function createDirsSync (dir, split, callback) {
    if (!fs.existsSync(dir)) {
        var url = __dirname + '\\static\\upload\\' // 本地 \
        // var url = __dirname + '\/static\/upload\/' // 线上 /
        var dirUrl = dir.replace(url,'')
        var dirArr = dirUrl.split(split);
        var pathtmp;
        dirArr.forEach((item) =>{
            if (pathtmp) {
                pathtmp = path.join(pathtmp, item);
            }
            else {
                pathtmp = url + item;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, '0777')) {
                    // cb(null, item);
                    callback(false)
                }
            }
        })
        callback(true);
    }
    else {
        callback(true);
    }
}
const utils = {
    createDirsSync
}
module.exports = utils 