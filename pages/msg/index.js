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
            //处理消息文本
            item.lastContent = that.imContent(item);
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


  imContent: function (item) {
    var that = this;
    if (item.status == 1) {
      return "撤回一条消息";
    }
    var type = item.msgType;
    var content = item.lastContent || "";
    //支持的html标签
    var html = function (end) {
      return new RegExp('\\n*\\[' + (end || '') + '(pre|div|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
    };
    content = (content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;') //XSS
      .replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2') //转义@
      .replace(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|%)+)/g,
      function (url) {
        return url;
      }) //转义网址
      .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;').replace(/\s{2}/g, '&nbsp;') //转义空格
      .replace(/img\[([^\s]+?)\]/g,
      function (img) { //转义图片
        return '[图片]';
      }).replace(/voice\[([^\s]+?)\]/g,
      function (voice) { //转义语音
        return '[语音]';
      }).replace(/file\([\s\S]+?\)\[[\s\S]*?\]/g,
      function (str) { //转义文件
        return '[文件]';
      }).replace(/checkin\([\s\S]+?\)\[[\s\S]*?\]\[[\s\S]*?\]/g,
      function (str) { //转义签到
        return '[签到]';
      })
      .replace(/location\([\s\S]+\)\[[\s\S]+\]/g, function (location) {	//转义定位
        return '[位置]';
      }).replace(/face\[([^\s\[\]]+?)\]/g,
      function (face) { //转义表情
        var alt = face.replace(/^face/g, '');
        return alt;
      }).replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g,
      function (str) { //转义链接
        var href = (str.match(/a\(([\s\S]+?)\)\[/) || [])[1];
        var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
        if (!href) return str;
        return '<a href="' + href + '" target="_blank">' + (text || href) + '</a>';
      }).replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
      .replace(/\n/g, '<br>') //转义换行 
    return content;
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
      url: '../../pages/msg/detail?toUid=' + toUid + '&isGroupChat=' + isGroupChat,
    })
  }
})