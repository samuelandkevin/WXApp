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
    list:[],
    loadFinish:false,
    lastTimestamp:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.loadNew();
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

  //处理案例列表数据
  _handleCaseList: function (list) {
    for (var i = 0; i < list.length; i++) {
      var aData = list[i];
      aData.taxType = dataUtil.getTax(aData.taxType);
      aData.taxSubType = dataUtil.getTax(aData.taxSubType);
      aData.createTime = dataUtil.dateFormat(aData.createTime, "yyyy/MM/dd");
    }
    return list;
  },

  /**网络请求 */
  //获取列表
  _getCaseLists: function (cursor, caseType, taxType,industryTypeId,callback) {

    var params = new Object();
    params.cursor         = cursor,
    params.caseType       = caseType,
    params.taxType        = taxType,
    params.industryTypeId = industryTypeId

    var url = "/taxtao/web/case/list";
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

  loadNew: function () {
    that = this;
    that.setData({
      list:[],
      lastTimestamp: ''
    });
    this._getCaseLists('', '', '', '', {
      success: function (ret) {
        if (ret.data != null && ret.data.code == 999) {
          var data = ret.data.data;
          var lastTimestamp = dataUtil.get_unix_time(data[data.length - 1].createTime);
          data = that._handleCaseList(data);
          that.setData({
            list: data,
            lastTimestamp: lastTimestamp
          })
        }
      },
      complete: function () {
        that.setData({
          loadFinish: true
        });
        wx.stopPullDownRefresh();
      }
    });
  },

  loadMore:function(){
    that = this;
    var lastTimestamp = this.data.lastTimestamp;
    this._getCaseLists(lastTimestamp, '', '', '', {
      success: function (ret) {
        if (ret.data != null && ret.data.code == 999) {
          var data = ret.data.data;
          var lastTimestamp = dataUtil.get_unix_time(data[data.length - 1].createTime);
          data = that._handleCaseList(data);
          data = that.data.list.concat(data);
          that.setData({
            list: data,
            lastTimestamp: lastTimestamp
          })
        }
      },
      complete: function () {
        that.setData({
          loadFinish: true
        });
        wx.stopPullDownRefresh();
      }
    });
  },

  /**刷新代理 */
  onPullDownRefresh: function () {
    this.loadNew();
  },

  onReachBottom:function(){
    this.loadMore();
  },

  /**点击事件 */
  onDetail:function(event){
    var id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../../pages/case/caseDetail?caseId='+id,
    })
  }
  
})