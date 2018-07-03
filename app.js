// import { ToastPannel } from '../../utils/toast/toast.js'
import { ToastPannel} from './utils/toast/toast.js'
var that;
App({
  ToastPannel,
  data: {
    userInfo: {
      accessToken: null,
      account: null, //登录账户信息
      userCard: null,//用户名片
    }, //税道用户信息
    isLogin: false, //是否登录
    wxUserInfo: null,//微信用户信息
    isDebug: true,  //调试
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (ret) {
        console.log("缓存的用户信息：");
        console.log(ret.data);
        if (ret.data != null ){
          getApp().data.userInfo.accessToken = ret.data.accessToken,
            getApp().data.userInfo.account = ret.data.account,
            getApp().data.userInfo.userCard = ret.data.userCard
        }
      },
    })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },


})



