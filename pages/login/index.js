import md5 from "../../utils/md5.js";
var netUtil  = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
var userUtil = require("../../data/userUtil.js");
var app      = getApp();
var callback = netUtil.callback;
var that;

Page({
  data: {
    focus: false,
    inputValue: '',
    phoneModel:"",
    phoneVer:""
  },
  onReady: function () {

  },
  onLoad: function (options){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
              phoneModel:res.model,
              phoneVer:res.version
        })
      }
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  bindReplaceInput: function (e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    var left
    if (pos !== -1) {
      // 光标在中间
      left = e.detail.value.slice(0, pos)
      // 计算光标的位置
      pos = left.replace(/11/g, '2').length
    }

    // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/11/g, '2'),
      cursor: pos
    }

    // 或者直接返回字符串,光标在最后边
    // return value.replace(/11/g,'2'),
  },
  bindHideKeyboard: function (e) {
    if (e.detail.value === '123') {
      // 收起键盘
      wx.hideKeyboard()
    }
  },

  onLogin:function(){
    //kun调试
    this._login('13501535588','123456',{
      success:function(res){
      },
      fail: function (ret){
      },
      complete:function(){
      }
    });
  },


/**
 * 网络请求
 */
  _login: function (phoneNum, passwdMD5,callback){
    var encrypted    = md5(passwdMD5);
    var params       = new Object();
    params.loginUser = phoneNum;
    params.password  = encrypted;
    params.platform  = "1";
    params.app_id    = "6f76a5fbf03a412ebc7ddb785d1a8b10";

    var url = "/app_core_api/v1/account/login" ;
    that = this;
    netUtil.POST({
      url: url,
      params: params,
      success: function (ret) {
        if (ret.data != null && ret.data.code == 999) {
          //获取uid，token
          var data = ret.data.data;
          var account = data.account;
          app.data.userInfo.accessToken = data.accessToken;
          app.data.userInfo.account = account;
          console.log("登录成功：");
          console.log(app.data.userInfo);

          //获取我的名片信息
          userUtil.getMyCard({
            success: function (ret) {
              if (ret.data.code == '999' && ret.data.data != null) {
                app.data.userInfo.userCard = ret.data.data.account;//用户名片
                console.log("获取我的名片成功："); 
                console.log(app.data.userInfo.userCard);
                
                wx.setStorage({
                  key: 'userInfo',
                  data: app.data.userInfo,
                })
              }
            },
            fail: function () {
            },
            complete: function () {
            }
          });
        }
      },
      fail:function(){
      },
      complete:function(){
      }
    })
  }     
  
})
