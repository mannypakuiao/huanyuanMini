import { config } from '../../config.js'
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
let util = require('../../utils/util.js');
var WxParse = require('../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tick: [],
    bianma: [],
    type: '',
    checkStatus: [],
    show2: false,
    show1: false,
    realprice: '',
    orderno: '',
    createdtime: '',
    paystatus: '',
    menpiao: [],
    adress: '',
    usefangfa: '',
    phone: '',
    qupiaoren: '',
    shuama: [],
    name: '',
    captchaImage: '',
    ordername: '',
    cur: '',
    listHeight: '',
    itco: '',
    obj: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          listHeight: res.windowHeight - 60
        })
      },
    })

    // 顶部订单信息
    that.setData({
      type: options.type,
      ordername: options.ordername,
      createdtime: options.createdtime,
      realprice: options.realprice,
      orderno: options.orderno,
      paystatus: options.paystatus
    })
    let data = {

    }
    var url = http.getOrderDetails + '/' + options.orderno;
    http.requstPostData(url, data, function (res) {
      console.log(res)
      if (res.code == 0) {
        that.setData({
          checkStatus: res.data.product[0].checkStatus,
          itco: res.data.info[0].isTicketOut,
          menpiao: res.data.product,//门票信息（数组）
          nodes: res.data.info[0].address,//使用地址
          nodes: res.data.info[0].PROFILE,//使用方法
          qupiaoren: res.data.info[0].contactName,//取票人名字
          phone: res.data.info[0].contactPhone, //取票人电话，
          productcode: res.data.info[0].productCode //门票code
        })
        WxParse.wxParse('fangfa', 'html', res.data.info[0].PROFILE, that, 0); //使用方法
        WxParse.wxParse('adress', 'html', res.data.info[0].address, that, 0); //使用地址
        for (var i = 0; i < that.data.menpiao.length; i++) {
          that.setData({
            shuama: that.data.menpiao[i].productUrl,
          })
        }
        // for (var i = 0; i < that.data.shuama.length; i++) {
        //   var pro = that.data.shuama[i].split('m/');
        //   pro = pro[1].split('.')
        //   that.data.bianma.push(pro[0])
        // } 
      }
      if (res.code == 0 && that.data.itco != -1) {
        that.setData({
          name: res.data.product[0].name,//标题
        })
      }
    })
  },
  //再次预定
  // zaicipay:function(e){
  //   wx.navigateTo({
  //     url: '../ticket/tickettijiao/tickettijiao?productcode=' + this.data.productcode + '&name=' + this.data.ordername,
  //   })
  // },

  //申请退款
  tuikuanpay: function (e) {
    this.setData({
      show2: true
    })
  },
  //检查订单是否已使用，可以退款？
  tuikuanConfirm: function (e) {
    let that = this;
    var url = http.refundOrderCheck + '/' + that.data.orderno;
    var data = {
      openId: wx.getStorageSync("openId"),
      userId: wx.getStorageSync("userId"),
      appId: config.appId
    }
    http.requstPostData(url, data, function (res) {
      console.log(res)
      if (res.isOk) {
        that.tuikuanmoney(data)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  tuikuanmoney: function (data) {
    let that = this;
    var url = http.refundOrder + '/' + that.data.orderno;
    http.requstPostData(url, data, function (res) {
      console.log(res)
      if (res.retCode == 0) {
        wx.showToast({
          title: '退款成功',
        })
        setTimeout(function () {
          var pages = getCurrentPages();
          var beforPage = pages[pages.length - 2];
          beforPage.setData({
            type: that.data.type
          })
          beforPage.loadData()

          wx.redirectTo({
            url: '../myorder/myorder?type=' + that.data.type
          })
        }, 300)
      } else {
        wx.showToast({
          title: res.retMsg,
          icon: 'none',
          duration: 2000
        })
        that.setData({
          show2: false
        })
      }
    })
  },
  // onUnload: function () {
  //   let that = this;
  //   var pages = getCurrentPages();
  //   var beforPage = pages[pages.length - 2];
  //   console.log(beforPage)
  //   beforPage.setData({
  //     type: that.data.type
  //   })
  //   beforPage.loadData()

  //   wx.navigateTo({
  //     url: '../myorder/myorder?type=' + that.data.type,
  //   })
  // },

  //二维码点击放大
  erweima: function (e) {
    this.setData({
      cur: 0
    })
    let that = this;
    let ticketcode = e.currentTarget.dataset.ticketcode
    for (var i = 0; i < that.data.menpiao.length; i++) {
      if (ticketcode == that.data.menpiao[i].ticketCode) {
        that.setData({
          shuama: that.data.menpiao[i].productUrl,
        })
      }
    }
    that.setData({
      show1: true
    })
  },

  //拨打电话
  lianxi: function (e) {
    wx.makePhoneCall({
      phoneNumber: '400000000' //仅为示例，并非真实的电话号码
    })
  },

  //关闭遮罩
  onclose: function () {
    this.setData({
      show1: false,
      show2: false
    })
  },
  shuaxin: function () {
    var options = {
      'itco': this.data.itco,
      'type': this.data.type,
      'ordername': this.data.ordername,
      'createdtime': this.data.createdtime,
      'realprice': this.data.realprice,
      'orderno': this.data.orderno,
      'paystatus': this.data.paystatus,
    }
    this.onLoad(options)
  }
})