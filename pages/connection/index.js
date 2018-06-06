
var netUtil = require("../../utils/netUtil.js");
var wxSortPickerView = require('../../utils/wxSortPickerView/wxSortPickerView.js');
var callback = netUtil.callback;
var app = getApp();
var that;

Page({
  
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
    //kun调试
    this._requestMyFris();
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
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 1000)
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

  }, /**
   * 页面的初始数据
   */
  data: {

  },

  //网络请求
  _requestMyFris:function(){
    that = this;
    var params = new Object();
    params.accessToken = app.data.userInfo.accessToken;
    params.userId      = app.data.userInfo.id;
    params.count       = 1000;
    params.page        = 1;
    var url = '/taxtao/api/friendships/friends';
    netUtil.POST({
      url: url,
      params: params,
      success:function(ret){
        console.log("获取好友列表成功：");
        console.log(ret.data);
        if (ret.data != null && ret.data.code == 999) {
          var data = ret.data.data;
          var fris = data.friends;
          console.log(fris);
          var arr = [];
          for(var index in fris){
            arr.push(fris[index].name);
          }
          wxSortPickerView.init(arr, that);
        }
      },
      fail:function(){

      },
      complete:function(){

      }
    })
  },

  wxSortPickerViewItemTap: function (e) {
    console.log(e.target.dataset.text);
  }
})