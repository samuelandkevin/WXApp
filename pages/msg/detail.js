var netUtil  = require("../../utils/netUtil.js");
var dataUtil = require("../../data/dataUtil.js");
var toast    = require("../../utils/toast/toast.js");
var WxParse = require('../../utils/wxParse/wxParse.js');
var callback = netUtil.callback;
var that;
var app = getApp();
var totalTime     =  10; //总共可以录音的时长
var remainingTime; //剩余时间
var interval;  
const recorderManager = wx.getRecorderManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: netUtil.netUtil,
    isGroupChat:0,    //是否群聊
    toUid:'',         //会话人id
    list:[],
    showToast:{},
    // toastText:'',
    // toastIcon:'',
    showFaces:false,  //显示表情键盘
    showMore:false,   //显示更多选项
    showSpeaker:false,//显示按住说话
    text:'',          //输入框文本
    footerBot:0,      //输入框底部距离 
    inputH:45,        //输入框高度 
    footerH:0,        //底部条高度
    faceCurPage:0,    //表情轮播图当前页
    faceList: [
      //第一组表情
    [{
      "name":"face[微笑]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/0.gif"
    },
    {
      "name":"face[嘻嘻]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/1.gif"
    },
    {
      "name":"face[哈哈]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/2.gif"
    },
    {
      "name":"face[可爱]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/3.gif"
    },
    {
      "name":"face[可怜]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/4.gif"
    },
    {
      "name":"face[挖鼻]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/5.gif"
    },
    {
      "name":"face[吃惊]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/6.gif"
    },
    {
      "name":"face[害羞]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/7.gif"
    },
    {
      "name":"face[挤眼]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/8.gif"
    },
    {
      "name":"face[闭嘴]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/9.gif"
    },
    {
      "name":"face[鄙视]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/10.gif"
    },
    {
      "name":"face[爱你]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/11.gif"
    },
    {
      "name":"face[泪]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/12.gif"
    },
    {
      "name":"face[偷笑]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/13.gif"
    },
    {
      "name":"face[亲亲]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/14.gif"
    },
    {
      "name":"face[生病]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/15.gif"
    },
    {
      "name":"face[太开心]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/16.gif"
    },
    {
      "name":"face[白眼]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/17.gif"
    },
    {
      "name":"face[右哼哼]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/18.gif"
    },
    {
      "name":"face[左哼哼]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/19.gif"
    },
    {
      "name":"face[嘘]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/20.gif"
    }],
    //第二组表情
    [{
      "name":"face[衰]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/21.gif"
    },
    {
      "name":"face[委屈]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/22.gif"
    },
    {
      "name":"face[吐]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/23.gif"
    },
    {
      "name":"face[哈欠]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/24.gif"
    },
    {
      "name":"face[抱抱]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/25.gif"
    },
    {
      "name":"face[怒]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/26.gif"
    },
    {
      "name":"face[疑问]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/27.gif"
    },
    {
      "name":"face[馋嘴]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/28.gif"
    },
    {
      "name":"face[拜拜]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/29.gif"
    },
    {
      "name":"face[思考]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/30.gif"
    },
    {
      "name":"face[汗]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/31.gif"
    },
    {
      "name":"face[困]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/32.gif"
    },
    {
      "name":"face[睡]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/33.gif"
    },
    {
      "name":"face[钱]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/34.gif"
    },
    {
      "name":"face[失望]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/35.gif"
    },
    {
      "name":"face[酷]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/36.gif"
    },
    {
      "name":"face[色]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/37.gif"
    },
    {
      "name":"face[哼]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/38.gif"
    },
    {
      "name":"face[鼓掌]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/39.gif"
    },
    {
      "name":"face[晕]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/40.gif"
    }],
    //第三组表情
    [{
      "name":"face[悲伤]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/41.gif"
    },
    {
      "name":"face[抓狂]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/42.gif"
    },
    {
      "name":"face[黑线]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/43.gif"
    },
    {
      "name":"face[阴险]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/44.gif"
    },
    {
      "name":"face[怒骂]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/45.gif"
    },
    {
      "name":"face[互粉]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/46.gif"
    },
    {
      "name":"face[心]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/47.gif"
    },
    {
      "name":"face[伤心]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/48.gif"
    },
    {
      "name":"face[猪头]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/49.gif"
    },
    {
      "name":"face[熊猫]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/50.gif"
    },
    {
      "name":"face[兔子]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/51.gif"
    },
    {
      "name":"face[ok]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/52.gif"
    },
    {
      "name":"face[耶]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/53.gif"
    },
    {
      "name":"face[good]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/54.gif"
    },
    {
      "name":"face[NO]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/55.gif"
    },
    {
      "name":"face[赞]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/56.gif"
    },
    {
      "name":"face[来]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/57.gif"
    },
    {
      "name":"face[弱]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/58.gif"
    },
    {
      "name":"face[草泥马]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/59.gif"
    },
    {
      "name":"face[神马]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/60.gif"
    }],
    //第四组表情
    [{
      "name":"face[囧]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/61.gif"
    },
    {
      "name":"face[浮云]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/62.gif"
    },
    {
      "name":"face[给力]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/63.gif"
    },
    {
      "name":"face[围观]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/64.gif"
    },
    {
      "name":"face[威武]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/65.gif"
    },
    {
      "name":"face[奥特曼]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/66.gif"
    },
    {
      "name":"face[礼物]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/67.gif"
    },
    {
      "name":"face[钟]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/68.gif"
    },
    {
      "name":"face[话筒]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/69.gif"
    },
    {
      "name":"face[蜡烛]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/70.gif"
    },
    {
      "name":"face[蛋糕]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/71.gif"
    },
    {
      "name":"face[二哈]","url":"http://csapp.gtax.cn/taxtao/static/webim/images/face/72.gif"
    }]
    ],
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var toUid = options.toUid;
    var isGroupChat = options.isGroupChat;
    this.setData({
      toUid:toUid,
      isGroupChat: isGroupChat
    });
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
              var item  = ret.data[i];
              var nItem = ret.data[i+1];
              
              item.imContent = that.imContent(item,nItem,false); 
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
      arr[alt[i]] = netUtil.baseUrl + '/taxtao/static/webim/images/face/' + i + '.gif';
}
return arr;
  },
 

  /**
	 * 转换内容 
	 * @param {Object} item：当前处理的消息对象 nextItem：下一条消息对象 is_SendMsg:是否发送消息
	 */
  imContent:function (item,nextItem,is_SendMsg) {
    var that = this;

    //当前时间轴
    var cdate = new Date().getTime();
    var cTime = that.getUnixTime(item.createTime);
    
    //下一条消息时间轴
    var nTime = 0;
    if (nextItem != undefined || nextItem != null) {
      nTime = that.getUnixTime(nextItem.createTime);
    }

    if ((cdate > cTime && nTime - cTime > 60 * 1000 && !is_SendMsg) || ( cTime - nTime > 60 * 1000 && is_SendMsg)) {
      item.showCreateTime = that.chatDate(that.getUnixTime(item.createTime));
    } 

    //消息撤回处理
    if (item.status == 1) {
      item.speakerName = (item.speakerId == app.data.userInfo.userCard.id) ? "你" : '“' + item.speakerName + '”';
    }

    var type    = item.msgType;
    var content = item.msgContent || "&nbsp;";
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
        return '<img style="max-width: 100%;vertical-align: middle;"  class="layui-layim-photos" src="' + img.replace(/(^img\[)|(\]$)/g, '') + '" />';
      }).replace(/voice\[([^\s]+?)\]/g,
      function (voice) { //转义语音
        var color = '#fff';
        var cls = 'iconfont icon-voice1';
        if (item.direction == 1) {
          color = '#00bf8f';
          cls = 'iconfont icon-voice';
        }
        return '<a style="color: ' + color + ';" class="' +  cls  + ' " href="javascript:;" data-url="' + voice.replace(/(^voice\[)|(\]$)/g, '') + '"></a>';
      }).replace(/file\([\s\S]+?\)\[[\s\S]*?\]/g,
      function (str) { //转义文件
        var href = (str.match(/file\(([\s\S]+?)\)\[/) || [])[1];
        var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
        if (!href) return str;
        var color = '#fff';
        if(item.direction == 1){
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

  //监听输入框变化
  bindInput:function(e){
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    var text = this.data.text;
    if(value != undefined){
      text =  value;
      this.setData({
        text:text
      });
    }
  },
  //点击语音
  onSpeaker: function () {
    var showSpeaker = !this.data.showSpeaker;
    this.setData({
      showSpeaker: showSpeaker,
      showFaces:false,
      showMore:false,
      footerH:0,
      footerBot:0,
    })
  },
  //点击表情按钮
  onFaces:function(){
    console.log("onFaces");
    var footerBot = !this.data.showFaces ? 150 : 0;
    this.setData({
      showFaces:!this.data.showFaces,
      footerBot: footerBot,
      showMore: false,
      showSpeaker:false
    });
  },
  //点击更多按钮
  onMore: function () {
    console.log("onMore");
    var footerBot = !this.data.showMore ? 100 : 0;
    this.setData({
      showMore: !this.data.showMore,
      footerBot: footerBot,
      showFaces:false
    });
  },
  //点击某个表情
  onOneFace:function(e){
    var title = e.currentTarget.dataset['title'];
    var text = this.data.text;
    if(title != undefined){
      text = text + title;
      this.setData({
        text:text
      });
    }
  },
  //点击"发送"按钮
  onSend:function(){
    that = this;
    console.log("点击发送");
    var text = this.data.text;
    if(text != undefined){
      console.log(text);
      that._requestSendTextMsg(text);
    }
  },
  //点击头像
  onAvatar:function(e){
    var id = e.currentTarget.dataset['id'];
    console.log(id);
    wx.navigateTo({
      url: '../../pages/connection/cardDetail?userId=' + id,
    })
  },
  //输入框聚焦
  bindfocus: function (e) {
    if (e.detail.height != undefined) {

    }
  },
  //输入框失去焦点
  bindblur: function (e) {
    console.log(e);
  },
  //监听输入框行数变化
  bindLineChange:function(e){
    // 获取输入框的内容
    var lineCount = e.detail.lineCount;
    var height    = e.detail.height ;
    // height: 0, heightRpx: 0, lineCount: 0
    if (lineCount < 5){
      var footerH = height + 10;
      this.setData({
        inputH: height,
        footerH: footerH
      })
    } 
  },
  //监听滚动
  bindScroll: function (e) {
    if (this.data.footerBot != 0){
      this.setData({
        footerBot: 0,
        showMore:false,
        showFaces:false
      })
    }
  },
  //监听表情轮播图滚边
  faceCurPageChange:function(e){
    console.log(e.detail.current);
    this.setData({
      faceCurPage: e.detail.current
    })
  },
  //点击内容
  onContent:function(e){
    that = this;
    var msgType = e.currentTarget.dataset["type"];
    var msgId = e.currentTarget.dataset["id"];
    console.log(msgType, msgId);
    if (msgType == 2){
      var voiceUrl = '';
      //播放录音
      for(var index in this.data.list){
        var item = this.data.list[index];
        if (item.id == msgId){
          item.msgContent.replace(/voice\[([^\s]+?)\]/g,function(voice){
            voiceUrl = voice.replace(/(^voice\[)|(\]$)/g, '');
            console.log(voiceUrl);
            that.play(voiceUrl);
          });
          
          break;
        }
      }
    }
      
  },
  //长按"按住说话"
  onLongTapSpeaker:function(){
    // this.start();
    console.log("长按开始录音");
    this.start();
    this.countDown();
   
  },
  //长按"按住说话"结束
  onLongTapEndSpeaker:function(){
    console.log("松手，录音即将结束");
    that = this;
    app.ToastPannel();
    clearInterval(interval);
    //录音时间太短
    if (totalTime - remainingTime < 1){
      this.showToast('录音时间太短',1500);
    }else{
      this.hideToast();
      that.stop(function (res) {
        //时间到，自动发送录音
        that._uploadRecord(res.tempFilePath);
      });
    }
  },
  //倒计时
  countDown:function(){
    that = this;
    remainingTime = totalTime; 
     app.ToastPannel();
     interval = setInterval(function () {
      remainingTime -= 1;
      var title = '剩余' + remainingTime + '秒';
      that.showToast(title);
      console.log(remainingTime);
      if (remainingTime <= 0){
        that.hideToast();
        clearInterval(interval);
        that.stop(function(res){
          //时间到，自动发送录音
           that._uploadRecord(res.tempFilePath);
        });
       
       
      }
    }, 1000);
  },
  //开始录音的时候
  start: function () {
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  //停止录音
  stop: function (callback) {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('停止录音', res.tempFilePath);
      callback(res);
    });
  },
  //播放声音
  play: function (url) {
    wx.playBackgroundAudio({
      dataUrl: url
    })
  },
  //地那就定位图标
  onLocIcon:function(url){
    wx.navigateTo({
      url: '../../pages/map/index',
    })
  },

  //网络请求
  //发送消息
  _requestSendMsg: function (audienceId, content, msgType, is_group, imgSource, latitude, longitude, address, callback){
    var params = new Object();
    var url = "/taxtao/api/im/send_msg";
    params.accessToken = app.data.userInfo.accessToken;
    params.audienceId  = audienceId;
    params.content     = content;
    params.msgType     = msgType;
    params.isGroupChat = is_group;
    params.imgSource   = imgSource;
    params.latitude    = latitude;
    params.longitude   = longitude;
    params.address     = address;
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
    })
  },
  //上传录音
  _uploadRecord:function(fileUrl){
    var url = netUtil.baseUrl + "/taxtao/api/im/upload_audio?accessToken=" + app.data.userInfo.accessToken;
    //自定义录音文件名字
    var fileName = dataUtil.getCurTime();
    const uploadTask = wx.uploadFile({
      url: url, 
      filePath: fileUrl,
      name: 'file',
      formData: {
        'name': 'files',
        'filename': fileName
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: function (res) {
        var data = res.data
        //do something
        console.log("上传语音成功，准备发送语音消息");
        console.log(res);
        if(res.statusCode == 200 && res.data != undefined){
          var voiceUrl = JSON.parse(res.data).data.url;
          that._requestSendVoiceMsg(voiceUrl);
        }
      }
    });
    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度', res.progress)
      console.log('已经上传的数据长度', res.totalBytesSent)
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    });


  },
  //发送文本消息
  _requestSendTextMsg:function(text){
    that = this;
    var audienceId = this.data.toUid;
    var content = text;
    var msgType = 0;
    var is_group = this.data.isGroupChat;
    var imgSource = '';
    var latitude = '';
    var longitude = '';
    var address = '';
    this._requestSendMsg(audienceId, content, msgType, is_group, imgSource, latitude, longitude, address, {
      success: function (ret) {
        console.log("发送文本消息成功");
        var msg = ret.data;
        if (msg != null || msg != undefined) {
          var preItem = that.data.list[that.data.list.length - 1];
          msg.imContent = that.imContent(msg, preItem, true);
          that.data.list.push(msg);
          that.setData({
            list: that.data.list
          });
        }
      },
      fail: function () {
        console.log("发送文本消息失败");
      },
      complete: function () {
        that.setData({
          text: ''
        });
      }
    });
  },

  //发送录音信息
  _requestSendVoiceMsg:function(voiceUrl){
    that = this;
    var audienceId = this.data.toUid;
    var content   = 'voice[' + voiceUrl + ']';
    var msgType   = 2;
    var is_group  = this.data.isGroupChat;
    var imgSource = '';
    var latitude  = '';
    var longitude = '';
    var address   = '';
    this._requestSendMsg(audienceId, content, msgType, is_group, imgSource, latitude, longitude, address, {
      success: function (ret) {
        console.log("发送语音成功");
        var msg = ret.data;
        if (msg != null || msg != undefined) {
          var preItem = that.data.list[that.data.list.length - 1];
          msg.imContent = that.imContent(msg, preItem, true);
          that.data.list.push(msg);
          that.setData({
            list: that.data.list
          });
        }
      },
      fail: function () {
        console.log("发送语音失败");
      },
      complete: function () {
        that.setData({
          text: ''
        });
      }
    });
  },

})
