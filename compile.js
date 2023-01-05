#!/usr/bin/env node
var chokidar = require('chokidar')
var path = require('path')
var axios = require('axios')

// CocosCreator编译接口（等效于界面点击Recompile）
var url = 'http://localhost:7456/update-db'
// 编译标识，防止重复编译
var compling = false

// 通过接口请求CocosCreator编译
function requestForUpdate (path) {
  // 如果不是在编译中或者后缀名不是ts的直接跳过
  if (compling || path.indexOf('.ts') + 3 !== path.length) return
  compling = true
  axios.get(url).then(function (res) {
    var date=new Date();
    console.info('%s - 自动编译成功', date.toLocaleDateString()+"  "+date.toLocaleTimeString(), res.data)
    setTimeout(() => {
      compling = false
    }, 300)
  })
}

// 监听文件夹变化 
chokidar.watch(path.join(__dirname, './assets/Script'), {
  ignored: /[\/\\]\./,
  persistent: true
}).on('change', requestForUpdate)
  .on('add', requestForUpdate)