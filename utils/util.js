const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const format = (d, format = 'yyyy-MM-dd') => {
  const o = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    'S': d.getMilliseconds()
  };

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4
      - RegExp.$1.length));
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? o[k]
        : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return format;
}

const switchs = (date, num) => {
  let thisTime = new Date(date).getTime();
  let lastTime = new Date(thisTime + (num * 86400000));
  let lastYear = lastTime.getFullYear();
  let lastMonth = lastTime.getMonth() + 1;
  lastMonth = lastMonth < 10 ? `0${lastMonth}` : lastMonth;
  let lastDay = lastTime.getDate();
  lastDay = lastDay < 10 ? `0${lastDay}` : lastDay;

  return `${lastYear}-${lastMonth}-${lastDay}`;
}
const dateFormat = (date) => {
  var time = date.substr(0, 10);
  time = time.replace(/\-/g, "/")
  return time
}
//时间戳转换日期格式
function js_date_time(unixtime) {
  var date = new Date(unixtime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//年月日时分秒
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
}

//用户授权
const openSetting = () => {
  wx.showModal({
    title: '用户未授权',
    content: '如需正常使用功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        wx.openSetting({
          success: function success(res) {
            console.log(res.authSetting)
            let authSetting = res.authSetting;
            if (authSetting['scope.userInfo']) {
              wx.switchTab({
                url: '../pages/person/person'
              });
            }
            else {
              openSetting()
            }
          }
        });
      }
    }
  })
}

//获取手机窗口信息
const window = () => {
  var windowHeight = ''
  wx.getSystemInfo({
    success: function (res) {
      windowHeight = res.windowWidth * 0.618
    },
  })
  return windowHeight
}
/**
 * 处理字符串为*格式，中间显示自定义*号
 * str 需要处理的字符串
 * startLength 前面显示的字符串长度
 * endLength 后面显示的字符串长度
 */
const sub  = (str, startLength, endLength) => {
  if (str.length == 0 || str == undefined) {
    return "";
  }
  var length = str.length;
  if (length >= startLength + endLength) {
    //判断当字符串长度为二时,隐藏末尾
    if (length === 2) {
      return str.substring(0, 1) + '*';
    } 
    else if (3 <= length && length <= 10){
      return str.substring(0, 1) + '**';
    }
    //判断字符串长度大于首尾字符串长度之和时,隐藏中间部分
    else if (length >= 11) {
      return str.substring(0, startLength) + "****" + str.substring(length - endLength, length);
    } else {
      return str
    }
  }
}

module.exports = {
  dateFormat: dateFormat,
  window: window,
  openSetting: openSetting,
  switchs: switchs,
  format: format,
  formatTime: formatTime,
  js_date_time: js_date_time,
  sub: sub
}
