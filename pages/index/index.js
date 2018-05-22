
var netUtil  = require("../../utils/netUtil.js");
var callback = netUtil.callback;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../images/banner/banner1.png',
      '../../images/banner/banner2.png',
      '../../images/banner/banner3.png'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    latestCases: [],
    hotCases: [],
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
    var that = this;
    this._getLatestCases({
      success: function (ret){
        if (ret.data != null && ret.data.code == 999){
          var list  = ret.data.data;
          if(list != null || list != undefined){
            console.log(list);
            that.setData({
              latestCases: list
            })
          } 
        }
      }
    });
    this._getHotCases({
      success: function (ret) {
        if (ret.data != null && ret.data.code == 999) {
          var list = ret.data.data;
          if (list != null || list != undefined) {
            console.log(list);
            that.setData({
              hotCases: list
            })
          }
        }
      }
    });
    
  },

  

  //获取最新案例
  _getLatestCases: function (callback) {

    var params = new Object();
    var url = "/taxtao/api/index/new_hot_case";
    netUtil.GET({
      url: url,
      params: params,
      success: function (res) {
        callback.success(res);
      },
      fail: function () {
        callback.fail();
      },
      complete:function(){
      },
    })
  },

  //获取热门案例
  _getHotCases: function (callback){
    
    var params = new Object();
    params.request_type = 'hot_case';
    var url = "/taxtao/api/index/new_hot_case";
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
      },
    })
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
    
  }
})