var netUtil = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
// var wxSortPickerView = require('../../utils/wxSortPickerView/wxSortPickerView.js');
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
    that = this;
    that._requestMyCollect(null,{
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

  /**
	 * 转换内容 
	 * @param {Object} item：当前处理的消息对象 
	 */
  imContent: function (item) {
    var that = this;

    var type = item.type;
    var content = item.content || "&nbsp;";
    //支持的html标签
    var html = function (end) {
      return new RegExp('\\n*\\[' + (end || '') + '(pre|div|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
    };
    content = (content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;') //XSS
      .replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2') //转义@
      .replace(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|%)+)/g,
      function (url) {
        if (type == 0) {
          return '<a href="javascript:;" data-web="' + url + '" style="text-decoration:underline;">' + url + '</a>';
        }
        return url;
      }) //转义网址
      .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;').replace(/\s{2}/g, '&nbsp;') //转义空格
      .replace(/img\[([^\s]+?)\]/g,
      function (img) { //转义图片
        // return '<img style="height:35%;width:75%;"  class="layui-layim-photos" src="' + img.replace(/(^img\[)|(\]$)/g, '') + '" />';
        return img.replace(/(^img\[)|(\]$)/g, '') ;

      }).replace(/voice\[([^\s]+?)\]/g,
      function (voice) { //转义语音
        var color = '#fff';
        var cls = 'iconfont icon-voice1';
        if (item.direction == 1) {
          color = '#00bf8f';
          cls = 'iconfont icon-voice';
        }
        return '<a style="color: ' + color + ';" class="' + cls + ' " href="javascript:;" data-url="' + voice.replace(/(^voice\[)|(\]$)/g, '') + '"></a>';
      }).replace(/file\([\s\S]+?\)\[[\s\S]*?\]/g,
      function (str) { //转义文件
        var href = (str.match(/file\(([\s\S]+?)\)\[/) || [])[1];
        var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
        if (!href) return str;
        var color = '#fff';
        if (item.direction == 1) {
          color = '#00bf8f';
        }
        return '<a style="color:' + color + ';display: block;text-align: center;" class="layui-layim-file" href="' + href + '" download="' + (text || '下载文件') + '" target="_blank"><i style="font-size: 80px;line-height: 80px;" class="iconfont icon-file-download2"></i><a style="display: block;line-height: 20px;font-size: 12px;">' + (text || '下载文件') + '</a></a>';
      }).replace(/checkin\([\s\S]+?\)\[[\s\S]*?\]\[[\s\S]*?\]/g,
      function (str) { //转义签到
        var bgImg = (str.match(/checkin\(([\s\S]+?)\)\[/) || [])[1];
        var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
        var address = (str.match(/\]\[([\s\S]*?)\]/) || [])[1];
        var checkinHtml = '';

        if (bgImg) {
          checkinHtml += '<div class="layim-chat-text" style="background: url(' + bgImg + ') no-repeat; background-size: 100% 100%;"><div class="checkin-text">' + text + '</div></div>';
        } else {
          checkinHtml += '<div class="layim-chat-text"><div class="checkin-text">' + text || "" + '</div></div>';
        }

        if (address) {
          checkinHtml += '<div class="checkin-location">' + address || "" + '</div>';
        }

        return checkinHtml += '</div><div class="checkin-tips"><i class="mui-icon mui-icon-location-filled"></i>签到</div>';
      })
      .replace(/location\([\s\S]+\)\[[\s\S]+\]/g, function (location) {	//转义定位

        ///location\([\s\S]+\)\[[\d\\.]+,[\d\\.]+\]/g
        //var latitude = (location.match(/\[([\d\\.]+)/)||[])[1];
        //var longitude = (location.match(/,([\d\\.]+)/)||[])[1];
        var address = (location.match(/location\(([\s\S]+)\)/) || [])[1];
        var snapshotImgUrl = (location.match(/\[([\s\S]+)\]/) || [])[1];

        var addressHtml = '';
        item.snapshotImgUrl = snapshotImgUrl;

        return address;
      }).replace(/face\[([^\s\[\]]+?)\]/g,
      function (face) { //转义表情
        var alt = face.replace(/^face/g, '');
        return '<img alt="' + alt + '" title="' + alt + '" src="' + that.faces()[alt] + '">';
      }).replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g,
      function (str) { //转义链接
        var href = (str.match(/a\(([\s\S]+?)\)\[/) || [])[1];
        var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
        if (!href) return str;
        return '<a href="' + href + '" target="_blank">' + (text || href) + '</a>';
      }).replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
      .replace(/\n/g, '<br>') //转义换行 
    return content;
  },


  //网络请求
  _requestMyCollect: function(cursor){
    that = this;
    var params = new Object();
    params.accessToken = app.data.userInfo.accessToken;
    if (cursor != undefined || cursor != null){
      params.cursor = cursor;
    }
    var url = '/taxtao/api/collect/';
    netUtil.GET({
      url: url,
      params: params,
      success: function (ret) {
        console.log("获取我的收藏列表成功：");
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
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            //日期格式化
            var createdDate = dataUtil.friendly_time(item.createdDate);
            item.createdDate = createdDate;
            item.imContent = that.imContent(item);
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
  }
})