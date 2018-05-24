var netUtil = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
var callback = netUtil.callback;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      loadFinish:false,
      page:1,
      totalPage: 1,
      count:20,
      accessToken:'',
      keyword:'',
      typeVal:'',
      list:[]
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
  _getList: function (accessTokenVal, pageVal, countVal, keywordVal, typeVal,callback){
    var params = new Object();
    if (keywordVal != null && keywordVal != '' && typeVal != null && typeVal != '') {
      params = { 
         accessToken: accessTokenVal,
         page: pageVal,
         count: countVal,
         keyword: keywordVal, 
         type: typeVal, 
       };
    } else {
      params = { 
         accessToken: accessTokenVal,
         page: pageVal, 
         count: countVal 
      };
    }

    var url = "/taxtao/api/lawlib/search";
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
      page: 1,
      totalPage: 1,
    });

  //参数：accessTokenVal, pageVal, countVal, keywordVal, typeVal
    var accessTokenVal = this.data.accessToken;
    var pageVal = this.data.page;
    var countVal = this.data.count;
    var keywordVal = this.data.keyword;
    var typeVal = this.data.typeVal;
    this._getList(accessTokenVal, pageVal, countVal, keywordVal, typeVal,   {
      success: function (ret) {
        if (ret.data != null && ret.data.code == 999) {
          var data = ret.data.data;
          var list = data.articles;
          list = that._handleCaseList(list);
          that.setData({
            list:list
          });
        }
      },
      complete: function () {
        that.setData({
          loadFinish: true
        })
      }
    });
  },

  _handleCaseList: function (list) {
    for (var i = 0; i < list.length; i++) {
      var aData = list[i];
      aData.updateTime = dataUtil.dateFormat(aData.updateTime, "yyyy-MM-dd");
    }
    return list;
  },

})