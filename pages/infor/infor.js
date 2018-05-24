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
      lastTimestamp:'',
      loadFinish:false
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
    this.loadNew();
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
        callback.complete();
      },
    })
  },

  //处理案例列表数据
  _handleInforList: function (list) {
    //由于小程序节点限制，按需取字段
    list.forEach(function(item,index,arr){
        arr[index] = {
          id:item.id,
          title:item.title,
          createdDate: dataUtil.dateFormat(item.createdDate, "yyyy-MM-dd"),
          imgUrl: item.imgUrl
        }
    });
    return list;
  },

  //点击事件
  onDetail:function(event){
    var id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../../pages/infor/detail?inforId='+id,
    })
  },

  /**刷新代理 */
  onPullDownRefresh: function () {
    this.loadNew();
  },

  onReachBottom: function () {
    this.loadMore();
  },

  loadNew:function(){
    that = this;
    this.setData({
      lastTimestamp:'',
      inforList:[]
    });
    this._getInforList('', '', {
      success: function (ret) {
        if (ret.data != null && ret.data.code == 999) {
          var list = ret.data.data;
          if (list != null || list != undefined) {
            list.data = that._handleInforList(list.data);
            that.setData({
              inforList: list.data,
              lastTimestamp: list.lastTimestamp
            })
          }
        }
      },
      complete: function () {
        that.setData({
          loadFinish: true
        });
      }
    });
  },

  loadMore: function () {
    that = this;
    var lastTimestamp = this.data.lastTimestamp;
    this._getInforList('', lastTimestamp, {
      success: function (ret) {
        if (ret.data != null && ret.data.code == 999) {
          var list = ret.data.data;
          if (list != null || list != undefined) {
            var aListData = that._handleInforList(list.data);
            aListData = that.data.inforList.concat(aListData);
            that.setData({
              inforList: aListData,
              lastTimestamp: list.lastTimestamp
            })
          }
        }
      },
      complete:function(){
        that.setData({
          loadFinish:true
        });
      }
    });
  },

})