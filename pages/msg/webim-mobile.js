
	/**
	 * 健康检查
	 */
  YHIM.fn.heartCheck = {
    timeout: 30 * 1000, //30s
    timeoutObj: null,
    reset: function () {
      clearTimeout(this.timeoutObj);
      this.start();
    },
    start: function () {
      this.timeoutObj = setTimeout(function () {
        WS.send("HeartBeat", "beat");
        console.log("websocket heartbeat");
      }, this.timeout)
    }
  }

	/**
	 * 表情库 
	 */
function faces() {
    var alt = ["[微笑]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[白眼]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[哈欠]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡]", "[钱]", "[失望]", "[酷]", "[色]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[ok]", "[耶]", "[good]", "[NO]", "[赞]", "[来]", "[弱]", "[草泥马]", "[神马]", "[囧]", "[浮云]", "[给力]", "[围观]", "[威武]", "[奥特曼]", "[礼物]", "[钟]", "[话筒]", "[蜡烛]", "[蛋糕]", "[二哈]"], arr = {};
    for (var i = 0; i < alt.length; i++) {
      arr[alt[i]] = CTX + 'static/webim/images/face/' + i + '.gif';
    }
    return arr;
  };

	/**
	 * 转换内容 
	 * @param {Object} content
	 */
  function imContent(content, type) {

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
        return '<img alt="' + alt + '" title="' + alt + '" src="' + yhim.faces[alt] + '">';
      }).replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, function (str) { //转义链接
        var href = (str.match(/a\(([\s\S]+?)\)\[/) || [])[1];
        var text = (str.match(/\)\[([\s\S]*?)\]/) || [])[1];
        if (!href)
          return str;
        return '<a href="' + href + '" target="_blank">' + (text || href) + '</a>';
      }).replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
      .replace(/\n/g, '<br>') //转义换行 
    return content;
  };

	/**
	 * 聊天内容模版 
	 */
  var elemChatMain = ['<li class="layim-chat-li{{ d.direction == 0 ? " layim-chat-mine" : "" }}" id="msgItem{{d.id}}" data-id="{{d.id}}" data-msgtype="{{d.msgType}}" data-content="{{d.msgContent||""}}" data-userId="{{d.speakerId}}">'
    , '<div class="layim-chat-user" ><img src="{{ d.speakerHead ? d.speakerHead : CTX + "static/webim/images/default_avatar@2x.png" }}"><cite>'
    , '{{# if(d.speakerDept){ }}'
    , '{{ d.speakerDept}}-{{d.speakerName||"匿名用户"}}'
    , '{{# }else{ }}'
    , '{{ d.speakerName||"匿名用户" }}'
    , '{{# } }}'
    , '</cite></div>'
    , '{{# if(d.status == -1){ }}'
    , '<div class="layim-chat-text"><div class="status-embody-failed" data-id="{{d.id||0}}"><i class="webim-iconfont">&#xe620;</i></div>{{ yhim.imContent(d.msgContent||"&nbsp;",d.msgType) }}</div>'
    , '{{# }else{ }}'
    , '<div class="layim-chat-text"><div class="status-embody-normal" data-id="{{d.id||0}}"></div>{{ yhim.imContent(d.msgContent||"&nbsp;",d.msgType) }}</div>'
    , '{{# } }}'
    , '</li>'].join('');

	/**
	 * 签到聊天内容模版
	 */
  var elemChatCheckin = ['<li class="layim-chat-li{{ d.direction == 0 ? " layim-chat-mine" : "" }} layim-chat-checkin" id="msgItem{{d.id}}" data-id="{{d.id}}" data-msgtype="{{d.msgType}}" data-content="{{d.msgContent||""}}" data-userId="{{d.speakerId}}">'
    , '<div class="layim-chat-user"><img src="{{ d.speakerHead ? d.speakerHead : CTX + "static/webim/images/default_avatar@2x.png" }}"><cite>'
    , '{{# if(d.speakerDept){ }}'
    , '{{ d.speakerDept}}-{{d.speakerName||"匿名用户"}}'
    , '{{# }else{ }}'
    , '{{ d.speakerName||"匿名用户" }}'
    , '{{# } }}'
    , '</cite></div>'
    , '{{ yhim.imContent(d.msgContent||"&nbsp;") }}'
    , '</li>'].join('');

	/**
	 * 补齐数位 
	 * @param {Object} num
	 */
  function digit(num) {
    return num < 10 ? '0' + (num || 0) : num;
  };

	/**
	 * 转换时间 
	 * @param {Object} timestamp
	 */
  function chatDate(timestamp) {
    var d = new Date(timestamp || new Date());
    if (new Date().getFullYear() > d.getFullYear()) {
      return yhim.dateFormat(d, 'yyyy-MM-dd W hh:mm');
    } else {
      return yhim.dateFormat(d, 'MM-dd W hh:mm');
    }
  };

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
 function dateFormat(time, format) {
    if (!time)
      return "";
    var o = {
      "M+": time.getMonth() + 1, //月份
      "d+": time.getDate(), //日
      "h+": time.getHours(), //小时
      "m+": time.getMinutes(), //分
      "s+": time.getSeconds(), //秒
      "q+": Math.floor((time.getMonth() + 3) / 3), //季度
      "W": yhim.transformWeek(time.getDay()),//星期
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
  }

	/**
	 * js星期转换为中文
	 * @param {Object} week
	 */
 function transformWeek(week) {
    var result = "";
    switch (week) {
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
  }

	/**
	 * 获取指定时间的时间戳
	 * @param dateStr
	 * @returns
	 */
  function getUnixTime(dateStr) {
    var newstr = dateStr.replace(/-/g, '/');
    var date = new Date(newstr);
    return date.getTime();
  }


	/**
	 * 组件事件冒泡
	 * @param {Object} e
	 */
  function stope(e) {
    e = e || window.event;
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
  };


	/**
	 * 显示或隐藏发送按钮 
	 */
  function showSendBtn() {
    //处理是否显示发送消息按钮
    if ($("#msg_text").val().replace(/[ ]/g, "").replace(/[\r\n]/g, "")) {
      $("#sendMessage").removeClass("mui-hidden");
      $(".footer-right i.webim-icon-add-more").addClass("mui-hidden");

      var text_H = document.getElementById("msg_text").scrollHeight;
      if (text_H > 32) {
        text_H = text_H < 150 ? text_H : 150;
        $("footer").height(text_H + 5 + "px");
        $(".footer-center").height(text_H + "px");
        $("#msg_text").height(text_H + "px");
      }
    } else {
      $("#sendMessage").addClass("mui-hidden");
      $(".footer-right i.webim-icon-add-more").removeClass("mui-hidden");
      $("footer").height("auto");
      $(".footer-center").height("auto");
      $("#msg_text").height("32px");
    }
  };

	/**
	 * 在焦点处插入内容
	 * @param {Object} obj
	 * @param {Object} str
	 * @param {Object} nofocus
	 */
  function focusInsert(obj, str, nofocus) {
    var result, val = obj.value;
    nofocus || obj.focus();
    if (document.selection) { //ie
      result = document.selection.createRange();
      document.selection.empty();
      result.text = str;
    } else {
      result = [val.substring(0, obj.selectionStart), str, val.substr(obj.selectionEnd)];
      nofocus || obj.focus();
      obj.value = result.join('');
    }
  };

	/**
	 * 在焦点处插入内容 
	 * @param {Object} dom
	 * @param {Object} html
	 */
  function insertAtCursor(dom, html) {
    if (dom != document.activeElement) { // 如果dom没有获取到焦点，追加
      dom.innerHTML = dom.innerHTML + html;
      return;
    }
    var sel, range;
    if (window.getSelection) {
      // IE9 或 非IE浏览器
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();
        var el = document.createElement("div");
        el.innerHTML = html;
        var frag = document.createDocumentFragment(),
          node, lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        // Preserve the selection  
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
  }

	/**
	 * 滚动到底部
	 */
  function rollTheBottom() {
    var chatMain = $('.layim-chat-main');
    //滚动到底部
    chatMain.scrollTop(chatMain[0].scrollHeight + 1000);

    //所有图片加载完成后,重新设置滚动条到底部
    chatMain.find('ul li').last().find('img').bind('load', function () {
      chatMain.scrollTop(chatMain[0].scrollHeight);
    });
  }

	/**
	 * 发送消息 
	 * @param {Object} msgType
	 * @param {Object} conetnt
	 */
  function sendMessage(msgType, content, imgSource, latitude, longitude, address) {
    var data = {
      id: new Date().getTime().toString()
      , speakerName: from_user_name
      , speakerDept: from_user_dept_name
      , speakerHead: from_user_avatar
      , direction: 0
      , isGroupChat: is_group
      , msgType: msgType || 0
      , speakerId: from_user_id
      , imgSource: imgSource || 0
      , latitude: latitude || 0
      , longitude: longitude || 0
      , address: address || ''
    };
    var ul = $('.layim-chat-main ul');
    var time = new Date().getTime();

    if (data.msgType != 0) {
      data.content = content;
    } else {
      data.content = $("#msg_text").val();
    }

    data.msgContent = data.content;

    if (data.content === '')
      return;

    if (data.msgType == 0 && data.content.length > 2048) {
      return toast('内容最长不能超过2048个字符');
    }

    if (time - (yhim.sendMessage.time || 0) > 60 * 1000) {
      ul.append('<li class="layim-chat-system"><span>' + yhim.chatDate() + '</span></li>');
      yhim.sendMessage.time = time;
    }

    //追加内容
    ul.append(laytpl(yhim.elemChatMain).render(data));

    //处理图片数据
    yhim.handlePhotoData(data, ul);


    //清空消息输入框
    $("#msg_text").val('');

    //隐藏发送按钮
    yhim.showSendBtn();

    //滚动到底部
    yhim.rollTheBottom();
    //发送到服务器保存并转发
    yhim.sendMsgServer(data.id, data.content, data.msgType, data.imgSource, data.latitude, data.longitude, data.address);
  }

	/**
	 * 撤回消息处理
	 * @param {Object} msgId
	 */
  function retractMessage(msgId) {
    if (msgId.length < 32) {
      mui.toast("消息还未发送成功，请稍候再试");
    }
    mui.ajax(CTX + 'api/im/retract_msg/' + msgId, {
      data: {
        accessToken: TOKEN
      },
      dataType: 'json',
      type: 'put',
      timeout: 10000,
      success: function (data) {
        if (data && data.code == "999") {
          //改变消息样式及内容
          $("#msgItem" + msgId).next().remove();
          $("#msgItem" + msgId).removeClass().addClass("layim-chat-system layim-chat-retract").html('<span>你撤回了一条消息</span>');

          //通知app删除本地聊天记录
          if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
            recallMessage(to_user_id, msgId);
          } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
            window.chatRecord.recallMessage(to_user_id, msgId);
          }
        } else {
          mui.alert(data.msg, " ");
        }
      },
      error: function (error) {
        mui.toast("撤回消息出错了，请稍候重试");
      }
    });
  }

	/**
	 * 发送消息到服务器
	 * @param {Object} msgId
	 * @param {Object} conetnt
	 * @param {Object} msgType
	 */
  function sendMsgServer(msgId, conetnt, msgType, imgSource, latitude, longitude, address) {
    var statusEl = $("#msgItem" + msgId);

    mui.ajax(CTX + 'api/im/send_msg', {
      data: {
        accessToken: TOKEN,
        audienceId: to_user_id,
        content: conetnt,
        msgType: msgType,
        isGroupChat: is_group,
        imgSource: imgSource,
        latitude: latitude,
        longitude: longitude,
        address: address
      },
      dataType: 'json',
      type: 'post',
      timeout: 10000,
      success: function (data) {
        if (data && data.id) {
          statusEl.find(".status-embody-failed").removeClass().addClass("status-embody-normal").html("");
          statusEl.attr("id", "msgItem" + data.id);
          statusEl.attr("data-id", data.id);

          //发送成功后移除消息
          yhim.removeLocalStorage("msgItem_" + msgId);
        } else {
          //发送失败存入本地
          yhim.saveMsgLocal(msgId, conetnt, msgType);

          //发送失败状态
          statusEl.find(".status-embody-normal").removeClass().addClass("status-embody-failed").html('<i class="webim-iconfont">&#xe620;</i>');
        }
      },
      error: function (error) {
        //发送失败存入本地
        yhim.saveMsgLocal(msgId, conetnt, msgType);

        //发送失败状态
        statusEl.find(".status-embody-normal").removeClass().addClass("status-embody-failed").html('<i class="webim-iconfont">&#xe620;</i>');
      }
    });
  }

	/**
	 * 存入消息到本地
	 * @param {Object} msgId
	 * @param {Object} conetnt
	 * @param {Object} msgType
	 */
  function saveMsgLocal(msgId, conetnt, msgType) {
    var localMsg = yhim.getLocalStorage("msgItem_" + msgId);
    //本地已经存在就不存了
    if (localMsg != null && localMsg != "") {
      //发送失败存入本地
      var msgData = {
        id: msgId
        , speakerName: from_user_name
        , speakerHead: from_user_avatar
        , direction: 0
        , conetnt: conetnt
        , msgContent: conetnt
        , isGroupChat: is_group
        , msgType: msgType
        , status: -1
      };
      yhim.setLocalStorage("msgItem_" + msgId, JSON.stringify(msgData));
    }
  }

	/**
	 * 获取历史聊天记录
	 * @param {Object} isGroup
	 * @param {Object} to_user
	 */
  function getChatmessage(to_user) {
    mui.ajax(CTX + 'api/im/chat_messages', {
      data: {
        accessToken: TOKEN,
        audienceId: to_user,
        isGroupChat: is_group,
        limit: 30
      },
      dataType: 'json',
      type: 'post',
      timeout: 10000,
      success: function (data) {
        if (data) {
          var ul = $('.layim-chat-main ul');
          //	            	if(data.length == 30){
          //	            		$('.layim-chat-main').before('<div class="layim-chat-system"><span yhim-event="chatLog">查看更多记录</span></div>');
          //	            	}
          for (var i = 0; i < data.length; i++) {
            var item = data[i];

            //时间抽
            if (new Date().getTime() > yhim.getUnixTime(item.createTime) && yhim.getUnixTime(item.createTime) - (yhim.sendMessage.time || 0) > 60 * 1000) {
              ul.append('<li class="layim-chat-system"><span>' + yhim.chatDate(yhim.getUnixTime(item.createTime)) + '</span></li>');
              yhim.sendMessage.time = yhim.getUnixTime(item.createTime);
            }

            //消息撤回处理
            if (item.status == 1) {
              var speakerName = (item.speakerId == from_user_id) ? "你" : '“' + item.speakerName + '”';
              ul.append('<li class="layim-chat-system layim-chat-retract"><span>' + speakerName + '撤回了一条消息</span></li>');
              continue;
            }

            if (item.msgType == 4) {//签到
              //追加内容
              ul.append(laytpl(yhim.elemChatCheckin).render(item));
            } else {
              //追加内容
              ul.append(laytpl(yhim.elemChatMain).render(item));

            }

            //处理图片信息
            yhim.handlePhotoData(item, ul);



          }

          //获取本地发送失败消息
          yhim.getLocalChatMsg();

          //滚动到底部
          yhim.rollTheBottom();
        }
      },
      error: function (error) {
        console.error("获取聊天记录发生异常，请稍候再试");
      }
    });
  }

  /**
 * 处理图片数据
   * @param item
   * @private
   */
  function handlePhotoData(item, ul) {
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
  }



	/**
	 * 获取本地发送失败的消息并渲染
	 */
  function getLocalChatMsg() {
    if (window.localStorage) {
      var storage = window.localStorage;
      var data
        , ul = $('.layim-chat-main ul')
        , count = 0;
      for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        if (key && key.indexOf("msgItem_") > -1) {
          if (count == 0) {
            ul.append('<li class="layim-chat-system"><span>未发送成功消息</span></li>')
          }
          data = JSON.parse(yhim.getLocalStorage(key));

          if (data.content === '')
            return;

          //追加内容
          ul.append(laytpl(yhim.elemChatMain).render(data));

          count++;
        }
      }

      //滚动到底部
      yhim.rollTheBottom();
    }
  }

	/**
	 * 更新未读消息数
	 * @param {Object} userId
	 */
  function updateIsRead(userId) {
    mui.ajax(CTX + 'api/im/not_read_zero/' + userId, {
      data: {
        accessToken: TOKEN
      },
      dataType: 'json',
      type: 'post',
      timeout: 10000,
      success: function (data) {
        if (data) {
          console.log(data.msg);
        }
      },
      error: function (error) {
        console.error("更新未读消息数发生异常");
      }
    });
  }

	/**
	 * 长按消息弹出层操作
	 * @param {Object} type
	 * @param {Object} msgType
	 * @param {Object} content
	 * @param {Object} msgId
	 */
  YHIM.fn.msgOperating = function (type, msgType, content, msgId) {
    switch (type) {
      case 'copy':
        if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
          //调用ios
          chatCopyContent(content);
        } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
          //调用安卓方法
          window.chatRecord.chatCopyContent(content);
        }
        break;
      case 'forward':
        if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
          //调用ios
          transmitChatMsg(msgType, content);
        } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
          //调用安卓方法
          window.chatRecord.transmitChatMsg(msgType, content);
        }
        break;
      case 'email':
        //构建保存对象
        var data = {
          mailType: msgType == 0 ? 0 : 1
          , subject: msgType == 0 ? '转发文本' : '转发附件'
        };

        if (data.mailType == 1) {

          if (msgType == 1) {
            data.content = content.replace(/(^img\[)|(\]$)/g, '');
            data.fileUrl = content.replace(/(^img\[)|(\]$)/g, '');
            data.subject = '转发图片';
          } else if (msgType == 2) {
            data.content = content.replace(/(^voice\[)|(\]$)/g, '');
            data.fileUrl = content.replace(/(^voice\[)|(\]$)/g, '');
            data.subject = '转发语音';
          } else if (msgType == 3) {
            var href = (content.match(/file\(([\s\S]+?)\)\[/) || [])[1];
            var text = (content.match(/\)\[([\s\S]*?)\]/) || [])[1];

            data.content = href;
            data.fileUrl = href;
            data.subject = text;
          }

        } else {
          data.content = content;
        }

        //撤回消息
        yhim.sendMail(data);
        break;
      case 'collect':
        //构建保存对象
        var data = {
          content: content
          , source: is_group
          , sourceId: msgId
          , type: msgType
        };
        //保存收藏
        yhim.collect(data);
        break;
      case 'retract':
        //撤回消息
        yhim.retractMessage(msgId);
        break;
      default:
    }
  }

	/**
	 * 收藏
	 * @param {Object} data
	 */
  function collect(data) {
    mui.ajax(CTX + 'api/collect/?accessToken=' + TOKEN, {
      data: data,
      dataType: 'json',
      type: 'POST',
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
      success: function (response) {
        if (response.code == "999") {
          mui.toast("收藏成功");
        } else {
          mui.toast(response.msg);
        }
      },
      error: function (error) {
        mui.toast("收藏内容出错了，请稍候重试");
      }
    });
  }

	/**
	 * 发送邮件处理
	 * @param {Object} data
	 */
  function sendMail(data) {
    mui.prompt('请输入收件人的邮箱', '请输入收件人的邮箱', '提示', ['取消', '确定'], function (e) {
      if (e.index == 1) {
        var email = e.value;

        if (!(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email))) {
          mui.alert("邮箱地址填写错误，请重新填写");
          return false;
        }

        data.toEmail = email;
        from_user_email = email;

        mui.ajax(CTX + 'api/email/send/?accessToken=' + TOKEN, {
          data: data,
          dataType: 'json',
          type: 'post',
          timeout: 10000,
          headers: { "Content-Type": "application/json" },
          success: function (data) {
            if (data && data.code == "999") {
              mui.toast("发送成功");
            } else {
              mui.toast(data.msg);
            }
          },
          error: function (error) {
            mui.toast("发送邮件出错了，请稍候重试");
          }
        });

        yhim.stope(e);
      }
    });

    document.querySelector('.mui-popup-input input').value = from_user_email;
    document.querySelector('.mui-popup-input input').style.height = "40px";
    document.querySelector('.mui-popup-button.mui-popup-button-bold').style.fontWeight = "100";
  }


  win.yhim = new YHIM();

};


//页面加载完成后绑定相关元素的事件
$(function () {
  //输入框事件绑定
  $("#msg_text").on({
    "keydown": function (e) {
      if (e.ctrlKey && e.keyCode == 13) {
        yhim.sendMessage();
      }
    },
    "input propertychange": function (e) {
      yhim.showSendBtn();
    },
    "focus": function () {
      if ($(".more-content").css("display") != "none") {
        $(".more-content").hide();
        $("footer").css("bottom", "0");
        $("#msg_content").css("padding-bottom", "45px");
        //滚动到底部
        yhim.rollTheBottom();
      }
    }
  });

  //语音按钮事件
  $(".footer-left i.webim-icon-voice").on("tap", function (e) {
    var than = $(this);
    $(".face-content").hide();
    $(".more-content").hide();
    $("footer").css("bottom", "0");
    $(".layim-chat-main").css("bottom", "45px");
    $(".footer-right i").first().attr("class", "mui-iconfont webim-iconfont webim-icon-face");
    if (than.hasClass("webim-icon-keyboard")) {
      $("#msg_text").show();
      $(".footer-center .voice-btn").hide();
      than.attr("class", "mui-iconfont webim-iconfont webim-icon-voice");
      setTimeout(function () {
        $("#msg_text").focus();
      }, 10);
    } else {
      $("#msg_text").hide();
      $(".footer-center .voice-btn").show();
      than.attr("class", "mui-iconfont webim-iconfont webim-icon-keyboard");
    }

    //滚动到底部
    yhim.rollTheBottom();
  });

  //表情按钮事件
  $(".footer-right i.webim-icon-face").on("tap", function (e) {
    var than = $(this);

    //隐藏语音输入
    if ($(".footer-left i").first().hasClass("webim-icon-keyboard")) {
      $(".footer-center .voice-btn").hide();
      $(".footer-left i").first().attr("class", "mui-iconfont webim-iconfont webim-icon-voice");
      $("#msg_text").show();
      $(".footer-right i").first().show();
    }

    if (than.hasClass("webim-icon-keyboard")) {
      $(".face-content").hide();
      than.attr("class", "mui-iconfont webim-iconfont webim-icon-face");
      $("footer").css("bottom", "0");
      $(".layim-chat-main").css("bottom", "45px");
      setTimeout(function () {
        $("#msg_text").focus();
      }, 10);
    } else {
      $(".more-content").hide();
      $(".face-content").show();
      than.attr("class", "mui-iconfont webim-iconfont webim-icon-keyboard");
      $("footer").css("bottom", $(".face-content").height());
      $(".layim-chat-main").css("bottom", $(".face-content").height() + 50);
    }

    //滚动到底部
    yhim.rollTheBottom();

  });

  //绑定表情点击事件
  $(".face-content").on('tap', ".face-list>li", function (event) {
    var str = 'face' + this.title + ' '
      , boxMsgText = document.getElementById("msg_text");
    var html = yhim.imContent(str, -1);
    //insertAtCursor(boxMsgText, html);
    yhim.focusInsert(boxMsgText, str, true);
    yhim.showSendBtn();

    yhim.stope(event);
  });

  //更多按钮事件
  $(".footer-right i.webim-icon-add-more").on("tap", function (e) {

    //隐藏语音输入
    if ($(".footer-left i").first().hasClass("webim-icon-keyboard")) {
      $(".footer-center .voice-btn").hide();
      $(".footer-left i").first().attr("class", "mui-iconfont webim-iconfont webim-icon-voice");
      $("#msg_text").show();
      $(".footer-right i").first().show();
    }

    //为了美观把更多的高度设置成表情一样
    //$(".more-content").height($(".face-content").height() < 50 ? "175px" : $(".face-content").height());

    //表情是展开的则隐藏
    if ($(".footer-right i").first().hasClass("webim-icon-keyboard")) {
      $(".footer-right i").first().attr("class", "mui-iconfont webim-iconfont webim-icon-face");
    }

    if ($(".more-content").css('display') != 'none') {
      $(".more-content").hide();
      $("footer").css("bottom", "0");
      $(".layim-chat-main").css("bottom", "45px");
    } else {
      $(".face-content").hide();
      $(".more-content").show();
      $("footer").css("bottom", $(".more-content").height());
      $(".layim-chat-main").css("bottom", $(".more-content").height() + 50);
    }

    //滚动到底部
    yhim.rollTheBottom();
  });

  //录音按钮事件绑定
  $(".footer-center .voice-btn").on({
    "touchstart": function () {
      $(this).addClass("checked").text("松开 结束");
      if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
        //调用ios
        chatStartRedord();
      } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
        //调用安卓方法
        window.chatRecord.chatStartRedord();
      }
    },
    "touchmove": function (e) {
      e.preventDefault();
    },
    "touchend": function () {
      $(this).removeClass("checked").text("按住 说话");
      if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
        //调用ios
        chatStopRedord();
      } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
        //调用安卓方法
        window.chatRecord.chatStopRedord();
      }
    }
  });

  //更多列表事件绑定
  $(".more-content").on("tap", "li", function (e) {
    var type = $(this).data("type");
    switch (type) {
      case 'images':
        if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
          //调用ios
          postMessage();
        } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
          //调用安卓方法
          window.webchat.onCallWebChat();
        }
        break;
      case 'files':
        if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
          //调用ios
          uploadFile();
        } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
          //调用安卓方法
          window.webchat.uploadFile();
        }
        break;
      case 'collects':
        if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
          //调用ios
          collectMsgContent();
        } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
          //调用安卓方法
          window.chatRecord.collectMsgContent();
        }
        break;
      case 'checkin':
        if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
          //调用ios
          groupCheckin(to_user_id);
        } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
          //调用安卓方法
          window.webchat.groupCheckin(to_user_id);
        }
        break;
      default:
    }
  });

  //点击消息列表，关闭键盘
  $("#msg_list").on('tap', function (event) {
    if (!focus) {
      $("#msg_text").blur();
    }
    //表情是展开的则隐藏
    if ($(".footer-right i").first().hasClass("webim-icon-keyboard")) {
      $(".footer-right i").first().attr("class", "mui-iconfont webim-iconfont webim-icon-face");
    }
    $(".face-content").hide();
    $(".more-content").hide();
    $("footer").css("bottom", "0");
    $(".layim-chat-main").css("bottom", "45px");

    yhim.stope(event);
  });

  //发送按钮事件
  $("#sendMessage").on("tap", function () {
    yhim.sendMessage();
  });


  //发送失败，重发按钮事件
  $("#msg_list").on("tap", "div.status-embody-failed", function () {
    var msgId = $(this).data("id")
      , conetent = $("#msgItem" + msgId).data("content")
      , msgType = $("#msgItem" + msgId).data("msgtype");

    //发送到服务器保存并转发
    yhim.sendMsgServer(msgId, conetent, msgType, '');
  });

  //消息点击事件
  $("#msg_list").on("tap", ".layim-chat-text", function (event) {
    var type = $(this).parent().data("msgtype")
      , content = $(this).parent().data("content");

    if (type == 1 && content) {
      var url = content.replace(/(^img\[)|(\]$)/g, '');
      if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
        //调用ios
        showImage(url);
      } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
        //调用安卓方法
        window.chatRecord.showImage(url);
      }
    } else if (type == 2 && content) {
      var url = content.replace(/(^voice\[)|(\]$)/g, '');
      if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
        //调用ios
        chatStartPlaying(url);
      } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
        //调用安卓方法
        window.chatRecord.chatStartPlaying(url);
      }
    } else if (type == 3 && content) {
      var url = (content.match(/file\(([\s\S]+?)\)\[/) || [])[1];
      var text = (content.match(/\)\[([\s\S]*?)\]/) || [])[1];
      if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
        //调用ios
        downLoadFile(url, text);
      } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
        //调用安卓方法
        window.webchat.downLoadFile(url, text);
      }
    } else if (type == 4 && content) {
      if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
        //调用ios
        gorupCheckinList(to_user_id);
      } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
        //调用安卓方法
        window.webchat.gorupCheckinList(to_user_id);
      }
    }/*else if(type == 0 && content){
	    	var url = $(this).find("a").data('web');
	    	if(url != null){
		    	if(yhim.browser.versions.ios && yhim.browser.versions.shuidao){
		             //调用ios
		    		openWebPage(url);
		        }else if(yhim.browser.versions.android && yhim.browser.versions.shuidao){
		            //调用安卓方法
		            window.webchat.openWebPage(url);
		        }
	    	}
	    }*/
    //阻止事件冒泡
    yhim.stope(event);
  });

  $("#msg_list").on("tap", "a", function (event) {
    var li = $(this).parents('li');
    var type = li.data('msgtype');
    var content = li.data('content');
    var url = $(this).data('web');
    if (type == 0 && content && url) {
      if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
        openWebPage(url);
      } else if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
        window.webchat.openWebPage(url);
      }
    }
  });

  //头像长按事件
  $("#msg_list").on("longtap", ".layim-chat-user", function (event) {
    var username = $(this).find("cite").text()
      , inputText = $("#msg_text");

    if (is_group === 1) {
      var msgText = inputText.val();
      if (msgText) {
        inputText.val("@" + username + " " + msgText).focus();
      } else {
        inputText.val("@" + username + " ").focus();
      }
    }

    //阻止事件冒泡
    yhim.stope(event);
  });


  //消息列表长按事件
  $("#msg_list").on("longtap", ".layim-chat-text", function (event) {
    var msgId = $(this).parent().data("id")
      , msgType = $(this).parent().data("msgtype")
      , content = $(this).parent().data("content");


    if (msgType === 4) {
      return false;
    }

    //只能撤回自己发的消息
    if ($(this).parent().hasClass("layim-chat-mine")) {
      $("#message_option li").last().show();	//撤回
    } else {
      $("#message_option li").last().hide();
      if (msgType === 2) {
        return;
      }
    }

    //显示弹出层
    mui('#message_option').popover('show');

    //图片或语音 隐藏复制按钮
    if (msgType === 1 || msgType === 3) {
      $("#message_option li").eq(0).hide();
      $("#message_option li").eq(1).show();
    } else if (msgType === 2) {
      $("#message_option li").eq(0).hide();
      $("#message_option li").eq(1).hide();
    } else {
      $("#message_option li").eq(0).show();
      $("#message_option li").eq(1).show();
    }

    $("#message_option").on("tap", ".mui-table-view-cell", function (event) {
      var type = $(this).data("type");
      yhim.msgOperating(type, msgType, content, msgId);
      mui('#message_option').popover('hide');

      $("#message_option").off("tap", ".mui-table-view-cell");
      return false;
    });

    //阻止事件冒泡
    yhim.stope(event);
  });

  $("#msg_list").on("tap", ".layim-chat-user", function (event) {

    var userId = $(this).parent().data("userid");

    if (yhim.browser.versions.android && yhim.browser.versions.shuidao) {
      window.webchat.onCallGetUserInfo(userId);
    } else if (yhim.browser.versions.ios && yhim.browser.versions.shuidao) {
      onCallGetUserInfo(userId);
    } else {
      alert("查看个人信息" + userId);
    }
  });



});