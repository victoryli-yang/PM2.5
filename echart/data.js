var fs = require('fs')


var valuePath = './node/data.json'

const loadValue = function() {
    // 确保文件有内容, 这里就不用处理文件不存在或者内容错误的情况了
    // 注意, 一般都是这样不处理的
    var content = fs.readFileSync(valuePath, 'utf8')
    var value = JSON.parse(content)
    return value
}

var data = loadValue()
console.log('***data :', loadValue())

// 导出数据
module.exports = data
