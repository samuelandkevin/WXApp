var netUtil = require("../../utils/netUtil.js");
var QQMapWX = require('../../utils/qqmap-wx-jssdk/qqmap-wx-jssdk.js');
var callback = netUtil.callback;
var qqmapsdk;
var that;
var userLoc;//用户位置

Page({
  data: {
    isUpdated: false,
    latitude: null,
    longitude: null,
    markers: null,
    list: [],
    address:''
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onReady: function (e) {
    //获取用户位置
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     console.log(res);
    //     var latitude = res.latitude;
    //     var longitude = res.longitude;
    //     that.setData({
    //       latitude: latitude,
    //       longitude: longitude,
    //       markers: [{
    //         id: 1,
    //         latitude: latitude,
    //         longitude: longitude
    //       }]
    //     });
    //   },
    // })
  },
  onLoad: function (options) {
    that = this;
    that.mapCtx = wx.createMapContext('myMap');
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'TZIBZ-VGYCP-6N3DM-VL3O2-CW32V-K4BUY'
    });
    var latitude  = options.lat;
    var longitude = options.long;
    var address   = options.address;
    if(latitude != undefined && longitude != undefined){
      that.setData({
        latitude: latitude,
        longitude: longitude,
        address:address,
        markers: [{
          id: 1,
          latitude: latitude,
          longitude: longitude
        }]
      });
    } 
  },
  //点击回到焦点
  onLocation: function () {
    that = this;
    console.log("点击回到焦点");
    this.mapCtx.moveToLocation();
  },
  //地图渲染更新完成时触发
  bindupdated: function () {
    that = this;
    console.log("地图渲染更新完成");
    that.setData({
      isUpdated: true
    });
  },
})
