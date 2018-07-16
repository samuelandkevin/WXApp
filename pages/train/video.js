Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{"id":"5", "title": "2017年全国税务稽查工作重点及2016年度企业所得税汇算清缴难点（总7节）", "coverUrl": "https://csapp.gtax.cn/taxtao/static/images/train05.jpg", "summary": "税务稽查的重大改革——双随机、法律编纂、联合检查2017稽便函29号2017年税务稽查重点工作安排...", "time":"4月25日 张辉"},
      { "id": "1", "title": "聚焦营改增后的房地产企业企业所得税清缴（总6节）", "coverUrl": "https://csapp.gtax.cn/taxtao/static/images/traininglist_banner.jpg", "summary": "2016财税45号关于公益股权捐赠企业所得税政策问题的通知货物捐赠：增值税暂行条例实施细则...", "time": "12月16日 张辉" },
      { "id": "2",  "title": "企业集团税务管理与“营改增”应对策略及辅导（总4节）", "coverUrl": "https://csapp.gtax.cn/taxtao/static/images/train02.jpg", "summary": "税务征管部门如何利用增值税的原理，利用销项税额与进项税额构成一个完整...", "time": "4月29日 源恒" },
      { "id": "3",  "title": "房地产集团营业税成本控制、争议处理大全（总7节）", "coverUrl": "https://csapp.gtax.cn/taxtao/static/images/train03.jpg", "summary": "房地产企业集团的收入会计核算分布在“营业收入”“营业外收入”“投资收益”...", "time": "5月18日 吴克红" },
      { "id": "4", "title": "房地产集团企业所得税管理大全（总17节）", "coverUrl": "https://csapp.gtax.cn/taxtao/static/images/train04.jpg", "summary": "房地产企业所得税如何避免被国税局管辖，有何益处？很多在港上市的著名...", "time": "6月8日 吴克红" }]
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

  //点击详情
  onDetail:function(e){
    var id = e.currentTarget.dataset["id"];
    console.log(id);
  }
})