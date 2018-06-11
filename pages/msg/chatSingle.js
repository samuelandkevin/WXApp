var netUtil  = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
var WxParse = require('../../utils/wxParse/wxParse.js');
var callback = netUtil.callback;
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: netUtil.netUtil,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var toUid = options.toUid;
    var isGroupChat = options.isGroupChat;
    this._initWS(toUid, isGroupChat,{
        success:function(res){

        },
        fail:function(res){

        }
    });
    this.getChatmessage(toUid, isGroupChat,{
        success:function(ret){
          if (ret.data != null && ret.statusCode == 200) {
            console.log("获取聊天消息成功");
            console.log(ret.data);
            that.setData({
              list:ret.data
            });
          }
        },
        fail:function(){

        },
        complete:function(){

        }
    });

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
    this.closeWS();
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

  _initWS: function ( toUid, isGroupChat,callback){
    var baseUrl = this.baseUrl;
    var token = app.data.userInfo.accessToken;
    if (token == ''){
      console.log("token is nil");
      return;
    }
    var url = "wss://csapp.gtax.cn";
    if(isGroupChat == 1){
      url = url + "/taxtao/web_im.ws?access_token=" + token + "&to_user_id=" + toUid + "&is_group=1&type=1";
    }else{
      url = url + "/taxtao/web_im.ws?access_token=" + token + "&to_user_id=" + toUid + "&is_group=0&type=0";
    }
     
    wx.connectSocket({
      url: url
    });
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！');
      callback.success(res);
    });
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！');
      callback.fail(res);
    });
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
  },

  closeWS:function(){
    wx.closeSocket();
  },

  //获取聊天消息
  getChatmessage:function(toUid,isGroupChat,callback){
    var params = new Object();
    var url = '/taxtao/api/im/chat_messages';
    params.accessToken = app.data.userInfo.accessToken;
    params.audienceId  = toUid;
    params.isGroupChat = isGroupChat;
    params.limit       = 30;
    
    netUtil.POST({
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
    });
  }

})