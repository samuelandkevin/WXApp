var netUtil = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
var callback = netUtil.callback;
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      inforList:[],
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
    this._getInforList('', '',{
      success: function (ret) {
        if (ret.data != null && ret.data.code == 999) {
          var list = ret.data.data;
          if (list != null || list != undefined) {
            console.log(list.data);
            list.data = that._handleInforList(list.data);
            that.setData({
              inforList : list.data,
            })
          }
        }
      }
    });
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
  //加载咨询列表
  _getInforList:function(atype,cursor,callback){
    var params    = new Object();
    params.cursor = cursor;
    params.type   = atype;
    var url = "/taxtao/infor/list";
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
  _handleInforList: function (list) {
    for (var i = 0; i < list.length; i++) {
      var aData = list[i];
      aData.createdDate = dataUtil.dateFormat(aData.createdDate, "yyyy-MM-dd");
    }
    return list;
  },

})