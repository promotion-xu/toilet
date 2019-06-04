var express = require('express');
var router = express.Router();
var fs = require('fs');
var PATH = './public/data/';

//读取数据模块，供客户端调用
//查询接口，token校验
//公共接口，无需校验
//data/read?type=it
//data/read?type=it.json
router.get('/read', function(req, res, next) {
  var type = req.query.type || '';
  fs.readFile(PATH + type + '.json', function(err, data){
    if(err){
      return res.send({
        status:0,
        info:'读取文件出现异常'
      });
    }
    var COUNT = 50;
    //TODO: try
    var obj = [];
    try{
      obj = JSON.parse(data.toString());
    }catch(e){
      obj = [];
    }
    if(obj.length > COUNT){
      obj = obj.slice(0, COUNT);
    }
    return res.send({
      status:1,
      data:obj
    });
  });
});

//数据存储模块 后台开发使用
router.post('/write', function (req, res, next) {
  console.log(req.body);
  var type = req.query.type || '';
  var url = req.baseUrl + req.url || '';
  var img = req.query.img || '';
  var title = req.query.title || '';
  if(!type || !url || !title || !img) {
    return res.send({
      status: 0,
      info: '提交的字段不全'
    })
  }
  // （1）需要拿到文件信息， 
  var filePath = PATH + type + '.json';
  fs.readFile(filePath, function (err, data) {
    if(err) {
      return res.send({
        status: 0,
        info: '读取数据失败'
      });
    }
    var arr = JSON.parse(data.toString());
    // 代表每一条记录
    var obj = {
      img: img,
      url: url,
      title: title,
      id: guidGenerate(),
      time: new Date()
    };
    arr.splice(0, 0, obj);
    // （2）写入文件
    var newData = JSON.stringify(arr);
    fs.writeFile(filePath, newData, function (err, data) {
      if(err) {
        return  res.send({
          status: 0,
          info: '写入失败'
        });
      }
      return res.send({
        status: 1,
        info: obj
      });

    })
  })
})



//阅读模块写入接口 后台开发使用
router.post('/write_config', function (req, res, next) {
  // xss 
  // npm install xss
  // require('xss);
  // var str = xss(name);
  var data = req.body.data;
  var obj = JSON.parse(data);
  var newData = JSON.stringify(obj);
  fs.writeFile(PATH + 'config.json', newData, function (err) {
    if(err) {
      res.send({
        status: 0,
        info: '写入失败'
      });
    }
    return res.send({
      status: 1,
      info: obj
    })
  })
})


//guid
function guidGenerate() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }).toUpperCase();
}

module.exports = router;
