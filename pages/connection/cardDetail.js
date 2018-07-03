var netUtil  = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
var WxParse = require('../../utils/wxParse/wxParse.js');
var userUtil = require("../../data/userUtil.js");
var callback = netUtil.callback;
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var userId = options.userId;
    userUtil.getUserCard(userId,{
      success:function(ret){
        
        if (ret.data != null && ret.data.code == 999) {
            var data = ret.data.data;
            var account = data.account;
            //数据处理
            //标签
            var workMark = account.workMark;
            if (workMark.length == 0){
              workMark = [];
            }else{
              workMark = workMark.split(",");
            }
            account.workMark = workMark;

            account.profileImageUrl = account.profileImageUrl == '' ? 'http://csapp.gtax.cn/taxtao/static/webim/images/default_avatar@2x.png' : account.profileImageUrl;
            console.log(account);
            that.setData({
              userInfo: account
            });
        }
      },
      fail:function(){

      },
      complete:function(){

      }
    })

    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
    
  }
})