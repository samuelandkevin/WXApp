var baseUrl = 'https://apps.gtax.cn'

var requestHandler = {
  url: '',
  params: {},
  success: function (res) {
    // success
  },
  fail: function () {
    // fail
  },
  complete: function () {},
}

var callback = {
  success: function (res) {
    // success
  },
  fail: function () {
    // fail
  },
  complete:function(){
    // complete
  }
}

//GET请求
function GET(requestHandler) {
  request('GET', requestHandler)
}
//POST请求
function POST(requestHandler) {
  request('POST', requestHandler)
}

function request(method, requestHandler) {
  //注意：可以对params加密等处理
  var params = requestHandler.params;
  var urlTail = requestHandler.url;
  wx.request({
    url: baseUrl + urlTail,
    data: params,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      //注意：可以对参数解密等处理
      requestHandler.success(res);
    },
    fail: function () {
      requestHandler.fail();
    },
    complete: function () {
      // complete
      requestHandler.complete();
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST,
  callback: callback, //回调
}