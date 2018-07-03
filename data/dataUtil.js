var taxs = {};
taxs['jcks'] = '关税';
taxs['qs'] = '契税';
taxs['gdzys'] = '耕地占用税';
taxs['yys2'] = '烟叶税';
taxs['clgzs'] = '车辆购置税';
taxs['ccs'] = '车船税';
taxs['tdzzs'] = '土地增值税';
taxs['cztdsys'] = '城镇土地使用税';
taxs['yhs'] = '印花税';
taxs['fcs'] = '房产税';
taxs['cswhjss'] = '城市维护建设税';
taxs['zys'] = '资源税';
taxs['grsds'] = '个人所得税';
taxs['qysds'] = '企业所得税';
taxs['yys'] = '营业税';
taxs['sfs'] = '消费税';
taxs['zzs'] = '增值税';
taxs['ygz'] = '营改增';
taxs['nspd'] = '纳税辅导';
taxs['swgl'] = '税务管理';
taxs['zmsz'] = '帐目实操';
taxs['whsyjsf'] = '文化事业建设费';
taxs['cpds'] = '船舶吨税';
taxs['jzy'] = '建筑业';
taxs['fdcy'] = '房地产业';
taxs['jry'] = '金融业';
taxs['shfwy'] = '生活服务业';
taxs['qthy'] = '其它行业';
taxs['bslc'] = '办税流程';
taxs['pjgl'] = '票据管理';
taxs['nssb'] = '纳税申报';
taxs['zengzs'] = '增值税';
taxs['sszc'] = '税收政策';
taxs['gjss'] = '国际税收';
taxs['nsch'] = '纳税筹划';
taxs['swjc'] = '税务稽查';
taxs['nsyh'] = '纳税优惠';
taxs['nsfx'] = '纳税风险';
taxs['hsqj'] = '汇算清缴';
taxs['xwqy'] = '小微企业';
taxs['zhyw'] = '综合业务';
taxs['csfx'] = '财税分析';
taxs['zzzd'] = '准则制度';
taxs['qtsz'] = '其他税种';
taxs['csgj'] = '财税工具';
taxs['qiyesuodesui'] = '企业所得税';
taxs['shenjiyewu'] = '审计业务';
taxs['gerensuodesui'] = '个人所得税';

//获取税种标签
function getTax(code) {
  return taxs[code];
}

function getCurTime(){
  var date = new Date();
  var year = date.getFullYear(); //获取当前年份   
  var mon = date.getMonth() + 1; //获取当前月份   
  var day = date.getDate(); //获取当前日   
  var h = date.getHours(); //获取小时   
  var m = date.getMinutes(); //获取分钟   
  var s = date.getSeconds(); //获取秒   

  year += "";
  //月，日，时，分，秒 小于10时，补0
  if (mon < 10) {
    mon = "0" + mon;
  }
  if (day < 10) {
    day = "0" + day;
  }
  if (h < 10) {
    h = "0" + h;
  }
  if (m < 10) {
    m = "0" + m;
  }
  if (s < 10) {
    s = "0" + s;
  }

  var curTime = year + mon + day + h + m + s;
  return curTime;
}



/**
 * 友好的时间返回函数
 * @param time_stamp
 * @returns {String}
 */
function friendly_time(datetime) {

  var time_stamp = strtotime(datetime);
  // 把日期时间解析为 Unix 时间戳
  var now_d = new Date();
  var now_time = now_d.getTime() / 1000;
  //获取当前时间的秒数
  var f_d = new Date();
  f_d.setTime(time_stamp * 1000);
  var f_time = f_d.toLocaleDateString();

  var ct = now_time - time_stamp;
  var day = 0;
  if (ct < 0) {
    f_time = "刚刚";
  } else if (ct < 60) {
    f_time = Math.floor(ct) + '秒前';
  } else if (ct < 3600) {
    f_time = Math.floor(ct / 60) + '分钟前';
  } else if (ct < 86400) {//一天
    f_time = Math.floor(ct / 3600) + '小时前';
  } else if (ct < 604800) {//7天
    day = Math.floor(ct / 86400);
    if (day < 2)
      f_time = '昨天';
    else
      f_time = dateFormat(datetime, 'MM-dd');
  } else {
    f_time = dateFormat(datetime, 'yyyy-MM-dd');
  }
  return f_time;
}

/**
 * 将任何英文文本的日期时间描述解析为 Unix 时间戳
 * @param text
 * @param now
 * @returns
 */
function strtotime(text, now) {

  var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

  if (!text) {
    return fail;
  }

  // Unecessary spaces
  text = text.replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ').replace(/[\t\r\n]/g, '').toLowerCase();

  match = text.match(/^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

  if (match && match[2] === match[4]) {
    if (match[1] > 1901) {
      switch (match[2]) {
        case '-': {// YYYY-M-D
          if (match[3] > 12 || match[5] > 31) {
            return fail;
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
        case '.': {// YYYY.M.D is not parsed by strtotime()
          return fail;
        }
        case '/': {// YYYY/M/D
          if (match[3] > 12 || match[5] > 31) {
            return fail;
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      }
    } else if (match[5] > 1901) {
      switch (match[2]) {
        case '-': {// D-M-YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
        case '.': {// D.M.YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
        case '/': {// M/D/YYYY
          if (match[1] > 12 || match[3] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      }
    } else {
      switch (match[2]) {
        case '-': {// YY-M-D
          if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
            return fail;
          }

          year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
          return new Date(year, parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
        case '.': {// D.M.YY or H.MM.SS
          if (match[5] >= 70) {// D.M.YY
            if (match[3] > 12 || match[1] > 31) {
              return fail;
            }

            return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
          }
          if (match[5] < 60 && !match[6]) {// H.MM.SS
            if (match[1] > 23 || match[3] > 59) {
              return fail;
            }

            today = new Date();
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
          }

          return fail;
          // invalid format, cannot be parsed
        }
        case '/': {// M/D/YY
          if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
            return fail;
          }

          year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
          return new Date(year, parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
        case ':': {// HH:MM:SS
          if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
            return fail;
          }

          today = new Date();
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
        }
      }
    }
  }

  // other formats and "now" should be parsed by Date.parse()
  if (text === 'now') {
    return now === null || isNaN(now) ? new Date().getTime() / 1000 | 0 : now | 0;
  }
  if (!isNaN(parsed = Date.parse(text))) {
    return parsed / 1000 | 0;
  }

  date = now ? new Date(now * 1000) : new Date();
  days = {
    'sun': 0,
    'mon': 1,
    'tue': 2,
    'wed': 3,
    'thu': 4,
    'fri': 5,
    'sat': 6
  };
  ranges = {
    'yea': 'FullYear',
    'mon': 'Month',
    'day': 'Date',
    'hou': 'Hours',
    'min': 'Minutes',
    'sec': 'Seconds'
  };

  function lastNext(type, range, modifier) {
    var diff, day = days[range];

    if (typeof day !== 'undefined') {
      diff = day - date.getDay();

      if (diff === 0) {
        diff = 7 * modifier;
      } else if (diff > 0 && type === 'last') {
        diff -= 7;
      } else if (diff < 0 && type === 'next') {
        diff += 7;
      }

      date.setDate(date.getDate() + diff);
    }
  }

  function process(val) {
    var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
      type = splt[0], range = splt[1].substring(0, 3), typeIsNumber = /\d+/.test(type), ago = splt[2] === 'ago', num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

    if (typeIsNumber) {
      num *= parseInt(type, 10);
    }

    if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
      return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
    }

    if (range === 'wee') {
      return date.setDate(date.getDate() + (num * 7));
    }

    if (type === 'next' || type === 'last') {
      lastNext(type, range, num);
    } else if (!typeIsNumber) {
      return false;
    }

    return true;
  }

  times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' + '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' + '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
  regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

  match = text.match(new RegExp(regex, 'gi'));
  if (!match) {
    return fail;
  }

  for (i = 0, len = match.length; i < len; i++) {
    if (!process(match[i])) {
      return fail;
    }
  }

  // ECMAScript 5 only
  // if (!match.every(process))
  //    return false;

  return (date.getTime() / 1000);
}

/* 
 * formatMoney(s,type) 
 * 功能：金额按千位逗号分割 
 * 参数：s，需要格式化的金额数值. 
 * 参数：type,判断格式化后的金额是否需要小数位. 
 * 返回：返回格式化后的数值字符串. 
 */
function formatMoney(s, type) {
  if (/[^0-9\.]/.test(s))
    return "";
  if (s == null || s == "")
    return "";
  s = s.toString().replace(/^(\d*)$/, "$1.");
  s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
  s = s.replace(".", ",");
  var re = /(\d)(\d{3},)/;
  while (re.test(s))
    s = s.replace(re, "$1,$2");
  s = s.replace(/,(\d\d)$/, ".$1");
  if (type == 0) {// 不带小数位(默认是有小数位)  
    var a = s.split(".");
    if (a[1] == "00") {
      s = a[0];
    }
  }
  if (type == 3) {
    s = parseFloat(s).toFixed(1);
  }
  return s;
}

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
function dateFormat(dateString, format) {
  if (!dateString) return "";
  var time = new Date(dateString.replace(/-/g, '/').replace(/T|Z/g, ' ').trim());
  var o = {
    "M+": time.getMonth() + 1, //月份
    "d+": time.getDate(), //日
    "h+": time.getHours(), //小时
    "m+": time.getMinutes(), //分
    "s+": time.getSeconds(), //秒
    "q+": Math.floor((time.getMonth() + 3) / 3), //季度
    "W": transformWeek(time.getDay()),//星期
    "S": time.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
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
function get_unix_time(dateStr) {
  var newstr = dateStr.replace(/-/g, '/');
  var date = new Date(newstr);
  var time_str = date.getTime().toString();
  return time_str.substr(0, 10);
}


/** 
 * 函数说明：获取字符串长度 
 * 备注：字符串实际长度，中文2，英文1 
 * @param:需要获得长度的字符串 
 */
function getStrLength(str) {
  var realLength = 0, len = str.length, charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1;
    } else {
      realLength += 2;
    }
  }
  return realLength;
};

/**  
 * js截取字符串，中英文都能用  
 * @param str：需要截取的字符串  
 * @param len: 需要截取的长度  
 */
function cutStr(str, len) {
  var str_length = 0;
  var str_len = 0;
  str_cut = new String();
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4    
      str_length++;
    }
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      str_cut = str_cut.concat("...");
      return str_cut;
    }
  }
  //如果给定字符串小于指定长度，则返回源字符串；    
  if (str_length < len) {
    return str;
  }
}


module.exports = {
  getTax:getTax,
  dateFormat: dateFormat,
  get_unix_time: get_unix_time,
  friendly_time: friendly_time,
  getCurTime: getCurTime
}

