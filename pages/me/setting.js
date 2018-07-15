import md5 from "../../utils/md5.js";
var netUtil  = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
var userUtil = require("../../data/userUtil.js");
var toast    = require("../../utils/toast/toast.js");
var app      = getApp();
var callback = netUtil.callback;
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{ "id": 0, "title": "账号信息" },
    { "id": 1, "title": "字体大小" },
    { "id": 2, "title": "清理缓存" },
    { "id": 3, "title": "友情链接" }],
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

  //点击事件
  logout:function(){
    that = this;
    this._requestLogout({
      success:function(){
        app.ToastPannel();
        that.showToast('退出登录成功', 1500);
        var userInfo =  {
          accessToken: null,
          account: null, //登录账户信息
          userCard: null,//用户名片
        };
        app.data.userInfo = userInfo;
        wx.setStorage({
          key: 'userInfo',
          data: userInfo,
        });
        wx.navigateBack({

        });
        
      },
      fail:function(){
        app.ToastPannel();
        that.showToast('退出登录失败', 1500);
      },
      complete:function(){

      }
    })
  },

  //网络请求
  //退出登录
  _requestLogout:function(callback){
    var url =  "/app_core_api/v1/account/logout";
    var params = new Object();
    params.accessToken = app.data.userInfo.accessToken;
    params.app_id      = "6f76a5fbf03a412ebc7ddb785d1a8b10";
    netUtil.POST({
        url:url,
        params: params,
        success: function (ret) {
          if (ret.data != null && ret.data.code == 999) {
            callback.success(ret);
          }
        },
        fail: function () {
          callback.fail();
        },
        complete: function () {

        }
     }
    )
   
  }
})