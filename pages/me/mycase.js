var netUtil = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
var wxSortPickerView = require('../../utils/wxSortPickerView/wxSortPickerView.js');
var callback = netUtil.callback;
var app = getApp();
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
    this._requestMyCaseList({
      success:function(){

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

  //请求我的案例列表
  _requestMyCaseList:function(){
    that = this;
    var params = new Object();
    params.accessToken = app.data.userInfo.accessToken;
    params.productType = 3;
    params.status = 1; 
    var url = '/taxtao/web/case/pay_list';
    netUtil.GET({
      url: url,
      params: params,
      success: function (ret) {
        console.log("获取我的案例列表成功：");
        console.log(ret.data);
        if (ret.statusCode == 401) {
          wx.showModal({
            title: '',
            content: '账号异常登录,请重新登录',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../pages/login/index',
                })
              }
            }
          })
        }
        if (ret.data != null && ret.data.code == 999) {
          var data = ret.data.data;
          for(var i =0;i<data.length;i++){
            var aData = data[i];
            aData.createTime = dataUtil.dateFormat(aData.createTime, "yyyy/MM/dd");
          }
          that.setData({
            list: data
          })
        }
      },
      fail: function () {

      },
      complete: function () {

      }
    })
  },
  //点击某一条案例
  onCase: function (event) {
    var caseId = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../../pages/case/caseDetail?caseId=' + caseId,
    })
  },
})