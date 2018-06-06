var baseUrl = 'https://csapp.gtax.cn'

var requestHandler = {
  url: '',
  params: {},
  success: function (res) {
    // success
  },
  fail: function () {
    // fail
  },
  complete: function () {
    //complete
  },
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
  var header = {}
  request('GET', header, requestHandler)
}
//POST请求
function POST(requestHandler) {
  var header = { 
    "content-type": "application/x-www-form-urlencoded"
  };
  request('POST', header, requestHandler)
}

function request(method,header,requestHandler) {
  var params  = requestHandler.params;
  var urlTail = requestHandler.url;
  wx.request({
    url: baseUrl + urlTail,
    data: params,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: header, 
    success: function (res) {
      requestHandler.success(res);
    },
    fail: function () {
      requestHandler.fail();
    },
    complete: function () {
      requestHandler.complete();
    }
  })

}

module.exports = {
  baseUrl: baseUrl,
  GET: GET,
  POST: POST,
  callback: callback, //回调
}