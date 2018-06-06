var netUtil = require("../utils/netUtil.js");
var app     = getApp();
var callback= netUtil.callback;

//获取我的名片
function getMyCard(callback) {
  var url = '/taxtao/api/account/my_account';
  var params = new Object();
  params.accessToken = app.data.userInfo.accessToken;
  params.userId = app.data.userInfo.account.id;

  netUtil.GET({
    url: url,
    params: params,
    success: function (ret) {
      callback.success(ret);
    },
    fail: function () {
      callback.fail();
    },
    complete: function () {
      callback.complete();
    },
  });
}

module.exports = {
  getMyCard: getMyCard
}

