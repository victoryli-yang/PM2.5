"use strict"

// 导入基本库
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

const log = function() {
    console.log.apply(console, arguments)
}

// 定义基本内容

const Pm25 = function() {
    // 名字
    this.name = ''
    // 指数
    this.value = 0
}

const saveJSON = function(path, data) {
    const fs = require('fs')
    const s = JSON.stringify(data, null, 4)
    fs.writeFile(path, s, function(error){
        if (error !== null) {
            log('*** 写入文件错误', error)
        } else {
            log('--- 保存成功')
        }
    })
}

const dataFromJSON = function(data, json) {
    var airObjects = JSON.parse(json)
    for (var i = 0; i < airObjects.length; i++) {
        var airObject = airObjects[i]
        var object = new Pm25()

        object.name = airObject.CITY.split('市')[0]
        object.value = parseInt(airObject.AQI)
        data.push(object)
    }
}

const jsonFromBody = function(body) {
    var options = {
        decodeEntities: false
    }
    const e = cheerio.load(body, options)
    var json = e('#gisDataJson').attr('value')
    return json
}

const writeToFile = function(path, data) {
    fs.writeFile(path, data, function(error) {
        if (error !== null) {
            log('*** 写入失败', path)
        } else {
            log('--- 写入成功', path)
        }
    })
}

const cachedUrl = function(pageNum, callback) {
    var formData = {
          'page.pageNo': `${pageNum}`,
          'xmlname': '1462259560614'
    }

    var postData = {
        url: 'http://datacenter.mep.gov.cn:8099/ths-report/report!list.action',
        formData: formData
    }

    const path = postData.url.split('/').join('-').split(':').join('-') + '-' + `${pageNum}`

    fs.readFile(path, function(err, data) {
        // 判断状态
        if (err !== null) {
            request.post(postData, function(error, response, body){
                if (error === null) {
                    // 写入内容
                    writeToFile(path, body)
                    callback(error, response, body)
                }
            })
        } else {
            log('读取到缓存的页面', path)
            const response = {
                statusCode: 200
            }
            callback(null, response, data)
        }
    })
}

const removeData = function (i) {
    var fs = require("fs");
    console.log("准备删除文件！");
    var path = 'http---datacenter.mep.gov.cn-8099-ths-report-report!list.action-' + i
    fs.unlink(path, function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("文件删除成功！");
    });
}


const _main = function() {
    var data = []
    var path = 'data.json'
    log('1')
    // 清除缓存
    for (var i = 0; i < 13; i++) {
        removeData(i)
    }
    // 加载新数据
    for (var i = 0; i < 13; i++) {
        cachedUrl(i, function(error, response, body){
            if (error === null && response.statusCode === 200) {
                log('读入成功')
                const json = jsonFromBody(body)
                dataFromJSON(data, json)
                saveJSON(path, data)
            } else {
                log('*** 请求失败', error)
            }
        })
    }
}


// 主程序
_main()
