var netUtil = require("../../utils/netUtil.js");
var QQMapWX = require('../../utils/qqmap-wx-jssdk/qqmap-wx-jssdk.js');
var callback = netUtil.callback;
var qqmapsdk;
var that;
var userLoc;//用户位置
var selPOILoc;//选中的POI位置
Page({
  data: {
    isUpdated: false,
    latitude: null,
    longitude: null,
    markers: null,
    list: []
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  onReady: function (e) {
    that = this;
    that.mapCtx = wx.createMapContext('myMap');
    //获取用户位置
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res);
        that.rerverseGeo(res.latitude, res.longitude, {
          success: function (ret) {
            console.log("反地理编码成功");
            console.log(ret.result.address);
            var item = {};
            item.isSel = true;
            item.title = "";
            item.address = ret.result.address;
            var location = {};
            location.lat = res.latitude;
            location.lng = res.longitude;
            item.location = location;
            item.id = "myLocationId";
            selPOILoc = item;
            userLoc = item;
          },
          fail: function () {

          },
          complete: function () {

          }
        });
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude
          }]
        });
        //poi搜索
        that.onSearch('酒店', null, {
          success: function (res) {
            var list = [];
            list.push(selPOILoc);
            res.data.forEach(function (ele, index) {
              ele.isSel = false;
              list.push(ele);
            });
            that.setData({
              list: list
            });
          },
          fail: function () {
          }
        });
      },
    })
  },
  onLoad: function () {
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

  //点击回到焦点
  onLocation: function () {
    that = this;
    console.log("点击回到焦点");
    this.mapCtx.moveToLocation();
    var lat = userLoc.location.lat;
    var lng = userLoc.location.lng;
    if (lat != undefined && lng != undefined) {
      that.setData({
        latitude: lat,
        longitude: lng,
        markers: [{
          id: 1,
          latitude: lat,
          longitude: lng
        }]
      });
    }
  },
  //地图渲染更新完成时触发
  bindupdated: function () {
    that = this;
    console.log("地图渲染更新完成");
    that.setData({
      isUpdated: true
    });
  },
  //点击poi列表的某一条
  onPOILoc: function (e) {
    that = this;
    console.log("点击poi列表的某一条");
    var id = e.currentTarget.dataset['id'];
    var list = that.data.list;
    list.forEach(function (ele, index) {
      if (ele.id == id) {
        console.log("点击poi的id是");
        var lat = ele.location.lat;
        var lng = ele.location.lng;
        console.log(lat, lng);
        if (lat != undefined && lng != undefined) {
          that.setData({
            latitude: lat,
            longitude: lng,
            markers: [{
              id: 1,
              latitude: lat,
              longitude: lng
            }]
          });
        }
        ele.isSel = true;
      } else {
        ele.isSel = false;
      }
    });
    that.setData({
      list: list
    });
  },

  //点击搜索
  onSearch: function (keyword, location, callback) {
    //“酒店” “餐饮” “娱乐” “学校”
    qqmapsdk.search({
      keyword: keyword,
      location: location,
      fail: function (res) {
        console.log(res);
        callback.fail(res);
      },
      complete: function (res) {
        console.log(res);
        callback.success(res);
      }
    })
  },
  //反地理位置
  rerverseGeo: function (latitude, longitude, callback) {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(res);
        callback.success(res);
      },
      fail: function (res) {
        console.log(res);
        callback.fail(res);
      },
      complete: function (res) {
        console.log(res);
        callback.complete();
      }
    });
  },
  //监听地图视野变化
  bindregionchange: function (e) {
    that = this;
    console.log(e);
    if (e.type == "end") {
      console.log("地图视野变化结束");
      that.getLngLat({
        success: function (res) {

          that.rerverseGeo(res.latitude, res.longitude, {
            success: function (ret) {
              console.log("反地理编码成功");
              console.log(ret.result.address);
              var item = {};
              item.isSel = true;
              item.title = "";
              item.address = ret.result.address;
              var location = {};
              location.lat = res.latitude;
              location.lng = res.longitude;
              item.location = location;
              item.id = "myLocationId";
              selPOILoc = item;
            },
            fail: function () {

            },
            complete: function () {

            }
          });

          var location = {
            latitude: res.latitude,
            longitude: res.longitude,
          }

          //poi搜索
          that.onSearch('酒店', location, {
            success: function (res) {
              var list = [];
              list.push(selPOILoc);
              res.data.forEach(function (ele, index) {
                ele.isSel = false;
                list.push(ele);
              });
              that.setData({
                list: list
              });
            },
            fail: function () {
            }
          });
        }
      });
    }
  },
  //获取中间点的经纬度，并mark出来
  getLngLat: function (callback) {
    var that = this;
    this.mapCtx.getCenterLocation({
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          markers: [
            {
              id: 1,
              longitude: res.longitude,
              latitude: res.latitude
            }
          ]
        })
        callback.success(res);
      }
    })
  }
})
