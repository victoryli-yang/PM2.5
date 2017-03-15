// 引入基础库
var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.json())

// 配置静态文件目录
app.use(express.static('echart'))

var log = function () {
    console.log.apply(console, arguments)
}

const registerRoutes = function(app, routes) {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        // 下面这段是重点
        app[route.method](route.path, route.func)
    }
}

var sendHtml = function(path, response) {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    fs.readFile(path, options, function(err, data){
        console.log(`读取的html文件 ${path} 内容是`, data)
        response.send(data)
    })
}
app.get('/data', function(request, response) {
    var path = 'node/data.json'
    log('***JSON path :', path)
    sendHtml(path, response)
})

app.get('/', function(request, response) {
    var path = 'echart/index.html'
    log('***主页 path :', path)
    sendHtml(path, response)
})


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
