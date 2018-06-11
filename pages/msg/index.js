var netUtil = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
var callback = netUtil.callback;
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cursor:null,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this._requestChatList(this.data.cursor, {
      success: function (ret) {
        if (ret.data != null && ret.statusCode == 200) {
          console.log(ret.data);
          //数据处理
          var list = ret.data;
          for (var index in list) {
            var item = list[index];
            //日期格式化
            var createTime = dataUtil.friendly_time(item.createTime);
            item.createTime = createTime;
            //处理群头像
            var heads = item.sessionUserHead.split(",");
            item.sessionUserHead = heads;

            //未读信息条数
            item.isRead = item.isRead > 100 ? "99+" : item.isRead;
          }
          that.setData({
            list: list
          })
        }
      },
      fail: function () {

      },
      complete: function () {

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

  /**网络请求 */
  _requestChatList:function(cursor,callback){
    var params = new Object();
    var url = "/taxtao/api/im/chat_history_list";
    params.accessToken = app.data.userInfo.accessToken;
    if (cursor != null){
      parmas.cursor = cursor;
    }
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
    });
  },

  //点击事件
  onChat:function(e){
    var toUid       = e.currentTarget.dataset.sessionuid;
    var isGroupChat = e.currentTarget.dataset.isgroupchat;
    wx.navigateTo({
      url: '../../pages/msg/chatSingle?toUid=' + toUid + '&isGroupChat=' + isGroupChat,
    })
  }
})