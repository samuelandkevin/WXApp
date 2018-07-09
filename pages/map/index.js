var netUtil = require("../../utils/netUtil.js");
var QQMapWX = require('../../utils/qqmap-wx-jssdk/qqmap-wx-jssdk.js');
var callback = netUtil.callback;
var qqmapsdk;
var that;
Page({
  data: {
    isUpdated:false,
    markers: null,
    list:[]
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onReady: function (e) {
   
  },
  onLoad:function(){
   
  }
})
