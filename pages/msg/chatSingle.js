var netUtil  = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
var WxParse = require('../../utils/wxParse/wxParse.js');
var callback = netUtil.callback;
var that;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: netUtil.netUtil,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var toUid = options.toUid;
    var isGroupChat = options.isGroupChat;
    this._initWS(toUid, isGroupChat,{
        success:function(res){

        },
        fail:function(res){

        }
    });
    this.getChatmessage(toUid, isGroupChat,{
      
        success:function(ret){
          if (ret.data != null && ret.statusCode == 200) {
            console.log("获取聊天消息成功");
            console.log(ret.data);

            for(var i=0;i<ret.data.length;i++ ){
              var item = ret.data[i];
              //时间轴
              if (new Date().getTime() > that.getUnixTime(item.createTime) && that.getUnixTime(item.createTime)  > 60 * 1000){
                item.showCreateTime = that.chatDate(that.getUnixTime(item.createTime));
              }
              //消息撤回处理
              if(item.status == 1){
                item.speakerName = (item.speakerId == app.data.userInfo.userCard.id) ? "你" : '“' + item.speakerName + '”';
              }

              
              item.imContent = that.imContent(item.msgContent || "&nbsp;", item.msgType) 
              


            }
            

            that.setData({
              list:ret.data
            });
          }
        },
        fail:function(){

        },
        complete:function(){

        }
    });

  },

  /**
 * 表情库 
 */
  faces:function () {
    var alt = ["[微笑]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[白眼]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[哈欠]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡]", "[钱]", "[失望]", "[酷]", "[色]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[ok]", "[耶]", "[good]", "[NO]", "[赞]", "[来]", "[弱]", "[草泥马]", "[神马]", "[囧]", "[浮云]", "[给力]", "[围观]", "[威武]", "[奥特曼]", "[礼物]", "[钟]", "[话筒]", "[蜡烛]", "[蛋糕]", "[二哈]"], arr = {};
    for(var i = 0; i<alt.length; i++) {
  arr[alt[i]] = CTX + 'static/webim/images/face/' + i + '.gif';
}
return arr;
  },


  /**
	 * 转换内容 
	 * @param {Object} content
	 */
  imContent:function (content, type) {
    var that = this;
    //支持的html标签
    var html = function (end) {
      return new RegExp('\\n*\\[' + (end || '') + '(pre|div|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
    };
    content = (content || '')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;') //XSS
      .replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2') //转义@
      .replace(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|%)+)/g, function (url) {
        if (type == 0) {
          return '<a href="javascript:;" data-web="' + url + '" style="text-decoration:underline;">' + url + '</a>';
        }
        return url;
      })//转义网址
      .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
      .replace(/\s{2}/g, '&nbsp;') //转义空格
      .replace(/img\[([^\s]+?)\]/g, function (img) {  //转义图片
        return '<img class="layui-layim-photos" src="' + img.replace(/(^img\[)|(\]$)/g, '') + '">';
      })
      .replace(/voice\[([^\s]+?)\]/g, function (voice) {  //转义语音
        return '<a class="layui-layim-voice" href="javascript:;" data-url="' + voice.replace(/(^voice\[)|(\]$)/g, '') + '"></a>';
      })
      .replace(/file\([\s\S]+?\)\[[\s\S]*?\]/g, function (str) { //转义文件
        var href = (str.match(/file\(([\s\S]+?)\)\[/) || [])[1];
        var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
        if (!href)
          return str;
        return '<a class="layui-layim-file" href="' + href + '" download="' + (text || '下载文件') + '" target="_blank"><i class="webim-iconfont">&#xe60b;</i><cite>' + (text || '下载文件') + '</cite></a>';
      })
      .replace(/checkin\([\s\S]+?\)\[[\s\S]*?\]\[[\s\S]*?\]/g, function (str) { //转义签到
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
      .replace(/face\[([^\s\[\]]+?)\]/g, function (face) {  //转义表情
        var alt = face.replace(/^face/g, '');
        return '<img alt="' + alt + '" title="' + alt + '" src="' + that.faces[alt] + '">';
      }).replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, function (str) { //转义链接
        var href = (str.match(/a\(([\s\S]+?)\)\[/) || [])[1];
        var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
        if (!href)
          return str;
        return '<a href="' + href + '" target="_blank">' + (text || href) + '</a>';
      }).replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
      .replace(/\n/g, '<br>') //转义换行 
    return content;
  },



  getUnixTime: function (dateStr) {
    var newstr = dateStr.replace(/-/g, '/');
    var date = new Date(newstr);
    return date.getTime();
  },

  chatDate:function (timestamp) {
    var d = new Date(timestamp || new Date());
    if(new Date().getFullYear() > d.getFullYear()) {
      return this.dateFormat(d, 'yyyy-MM-dd W hh:mm');
    } else {
      return this.dateFormat(d, 'MM-dd W hh:mm');
    }
  },

  /** 
	 * 对日期进行格式化，
	 * @param date 要格式化的日期
	 * @param format 进行格式化的模式字符串
	 *     支持的模式字母有：
	 *     y:年,
	 *     M:年中的月份(1-12),
	 *     d:月份中的天(1-31),
	 *     h:小时(0-23),
	 *     m:分(0-59),
	 *     s:秒(0-59),
	 *     S:毫秒(0-999),
	 *     q:季度(1-4)
	 *     W:星期(星期一-星期天)
	 * @return String
	 */
  dateFormat:function (time, format) {
    if(!time) return "";
      var o = {
        "M+": time.getMonth() + 1, //月份
        "d+": time.getDate(), //日
        "h+": time.getHours(), //小时
        "m+": time.getMinutes(), //分
        "s+": time.getSeconds(), //秒
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度
        "W": this.transformWeek(time.getDay()),//星期
        "S": time.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return format;
  },


  handlePhotoData:function (item, ul) {
    if (item.imgSource == 1 || item.imgSource == 2) {//拍照||相册
      var liStr = '';
      var source = '该图片来自本地上传';
      if (item.imgSource == 1) {
        source = '该图片来自现场拍摄' + (item.address == "" || item.address == undefined || item.address == "undefined" || item.address == "null" ? "" : ("，拍摄地点：" + '<a class="photoOnLocation">' + item.address + '</a>'));
      }
      if (item.imgSource == 1) {
        if (item.address == "") {
          item.address = undefined;
        }
        if (item.longitude == "") {
          item.longitude = undefined;
        }
        if (item.latitude == "") {
          item.latitude = undefined;
        }
        liStr = '<li class="layim-chat-system layim-chat-retract" data-longitude= ' + item.longitude + ' data-latitude= ' + item.latitude + ' data-address= ' + item.address + '><span>' + source + '</span></li>'
      } else {
        liStr = '<li class="layim-chat-system layim-chat-retract"><span>' + source + '</span></li>'
      }
      ul.append(liStr);
    }
  },

  /**
	 * js星期转换为中文
	 * @param {Object} week
	 */
  transformWeek:function (week) {
    var result = "";
    switch(week) {
      case 1:
    result = "星期一";
    break;
    case 2:
    result = "星期二";
    break;
    case 3:
    result = "星期三";
    break;
    case 4:
    result = "星期四";
    break;
    case 5:
    result = "星期五";
    break;
    case 6:
    result = "星期六";
    break;
    case 0:
    result = "星期天";
    break;
    default:
    result = "";
  }
    return result;
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
    this.closeWS();
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

  _initWS: function ( toUid, isGroupChat,callback){
    var baseUrl = this.baseUrl;
    var token = app.data.userInfo.accessToken;
    if (token == ''){
      console.log("token is nil");
      return;
    }
    var url = "wss://csapp.gtax.cn";
    if(isGroupChat == 1){
      url = url + "/taxtao/web_im.ws?access_token=" + token + "&to_user_id=" + toUid + "&is_group=1&type=1";
    }else{
      url = url + "/taxtao/web_im.ws?access_token=" + token + "&to_user_id=" + toUid + "&is_group=0&type=0";
    }
     
    wx.connectSocket({
      url: url
    });
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！');
      callback.success(res);
    });
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！');
      callback.fail(res);
    });
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
  },

  closeWS:function(){
    wx.closeSocket();
  },

  //获取聊天消息
  getChatmessage:function(toUid,isGroupChat,callback){
    var params = new Object();
    var url = '/taxtao/api/im/chat_messages';
    params.accessToken = app.data.userInfo.accessToken;
    params.audienceId  = toUid;
    params.isGroupChat = isGroupChat;
    params.limit       = 30;
    
    netUtil.POST({
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
    });
  },

  handleData:function(){
    //时间抽
    
  }

})