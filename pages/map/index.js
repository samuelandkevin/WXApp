var QQMapWX = require('../../utils/qqmap-wx-jssdk/qqmap-wx-jssdk.js');
var qqmapsdk;
var that;
Page({
  data: {
    isUpdated:false,
    latitude: null,
    longitude: null,
    markers: null,
  },
  onReady: function (e) {
    that = this;
    that.mapCtx = wx.createMapContext('myMap');
    //获取用户位置
    wx.getLocation({
      success: function(res) {
        console.log(res);
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude,
          markers:[{
            id: 1,
            latitude: res.latitude ,
            longitude:res.longitude
          }]
        });
      },
    })
  },
  onLoad:function(){
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'TZIBZ-VGYCP-6N3DM-VL3O2-CW32V-K4BUY'
    });
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  //点击回到焦点
  onLocation:function(){
    this.mapCtx.moveToLocation();
    //kun调试
    this.onSearch('酒店');
    // this.rerverseGeo(this.data.latitude,this.data.longitude);
  },
  //地图渲染更新完成时触发
  bindupdated:function(){
    that = this;
    console.log("地图渲染更新完成");
    that.setData({
      isUpdated : true
    });
  },
  //点击搜索
  onSearch: function (keyword){
    //“酒店” “餐饮” “娱乐” “学校”
    qqmapsdk.search({
      keyword: keyword,
      location: location,
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  //反地理位置
  rerverseGeo: function (latitude, longitude){
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

})
