var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCard: null
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
    var userCard = null;
    if (app.data.userInfo){
      userCard = app.data.userInfo.userCard;
    }
    this.setData({
      userCard: userCard
    });
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
  onDetail:function(e){
    var id = e.currentTarget.dataset["id"];
    if(id == 0 || id == 1 || id == 2 || id == 3 ){
      if (app.data.userInfo.accessToken == undefined) {
        wx.showModal({
          title: '',
          content: '请登录再使用',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../../pages/login/index',
              })
            }
          }
        })
        return;
      }
    }

    if(id == 0){
      // wx.navigateTo({
      //   url: '',
      // })
    }else if(id == 1){
      wx.navigateTo({
        url: '../../pages/me/mycase',
      })
    }else if(id == 2){
      wx.navigateTo({
        url: '../../pages/me/mycollect',
      })
    }else if(id == 4){
      wx.navigateTo({
        url: '../../pages/me/setting',
      })
    }
  }
})