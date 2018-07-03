var netUtil = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
var WxParse = require('../../utils/wxParse/wxParse.js');
var callback = netUtil.callback;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBuy:false,
    is_iOS:true,
    is_iOSUnderReview:false,
    is_mobile:false,
    is_shuidao:false,
    caseInfo:{},
    caseInfo1:[],//可能感兴趣的案例列表
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var caseId = options.caseId;
    console.log("caseId = " + caseId);
    this._getCaseDetail(caseId, {
      success: function (ret) {
        if (ret.data != null && ret.data.code == 999) {
          var data = ret.data.data;
          data.caseInfo.createTime = dataUtil.dateFormat(data.caseInfo.createTime, "yyyy-MM-dd");
          console.log(data);
          var content = data.caseInfo.content;
          WxParse.wxParse('content', 'html', content, that, 5);
          that.setData({
            isBuy: data.isBuy,
            is_iOS: data.is_iOS,
            is_iOSUnderReview: data.is_iOSUnderReview,
            is_mobile: data.is_mobile,
            is_shuidao: true,
            caseInfo: data.caseInfo,
            caseInfo1: data.caseInfo1
          })
        }
      },
      fail:function(){

      },
      complete:function(){
        that.setData({
          loading:false
        });
      }
    }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
      
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


  /**网络请求 */
  //获取案例详情
  _getCaseDetail: function (caseId,callback) {
    var params = new Object();
    var url = "/taxtao/api/case/" + caseId + "?accessToken=";
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