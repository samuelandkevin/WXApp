
var netUtil  = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
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
    that = this;
    this._getLatestCases({
      success: function (ret){
        if (ret.data != null && ret.data.code == 999){
          var list  = ret.data.data;
          if(list != null || list != undefined){
            list = that._handleCaseList(list);
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
            list = that._handleCaseList(list);
            that.setData({
              hotCases: list
            })
          }
        }
      }
    });
    
  },

  /**网络请求 */
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

  //处理案例列表数据
  _handleCaseList:function(list){
    for (var i = 0; i < list.length; i++) {
      var aData = list[i];
      aData.taxType = dataUtil.getTax(aData.taxType);
      aData.taxSubType = dataUtil.getTax(aData.taxSubType);
      aData.createTime = dataUtil.dateFormat(aData.createTime, "yyyy-MM-dd");
    }
    return list;
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
    
  },

  //点击某一条案例
  onCase: function (event) {
    var caseId = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../../pages/case/caseDetail?caseId=' + caseId,
    })
    
  },
  //点击资讯
  onCallNews:function(event){
    wx.navigateTo({
      url: '../../pages/infor/infor',
    })
  },
  //点击案例首页
  onCaseIndex:function(event){
    wx.navigateTo({
      url: '../../pages/case/index',
    })
  }
})