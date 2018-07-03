
var netUtil = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
var callback = netUtil.callback;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    that = this;
    this._getList({
      success: function (ret) {
        if (ret.data != null && ret.data.code == 999) {
          var data = ret.data.data;
          if(data != null && data.length > 10){
              data = data.slice(0,10);
              data = that._handleList(data);
          }
          that.setData({
              list:data
          });
        }
      },
      fail:function(ret){
        console.log(ret);
      },
      complete:function(){
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  _handleList:function(list){
    for (var i = 0; i < list.length; i++) {
      var aData = list[i];
      aData.update_time = dataUtil.dateFormat(aData.update_time, "yyyy-MM-dd");
    }
    return list;
  },

  /**网络请求 */
  _getList:function(callback){
    var params = new Object();
    params.typeCode = 34;
    params.keydown = '';
    var url = "/taxtao/api/rule/search";
    netUtil.GET({
      url: url,
      params: params,
      success: function (res) {
        callback.success(res);
      },
      fail: function () {
        callback.fail();
      },
      complete: function () {
        callback.complete();
      },
    })
  },
})