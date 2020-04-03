import { config } from '../../config.js'
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
let util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productcode: '',
    name: '',
    productName: '',
    pageIndex: 0,
    pageSize: 10,
    list: [],
    windowHeight: '',
    flag: false,
    type: '',
    nodata: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options.type)
    that.setData({
      type: options.type
    })
    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '我的门票'
      })
    }
    if (options.type == 0) {
      wx.setNavigationBarTitle({
        title: '我的车票'
      })
    }

    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight - 65
        })
      },
    })
    console.log(wx.getStorageSync('userId'))
    var url = http.showOrders + '/' + wx.getStorageSync('userId');
    let data = {
      type: options.type,
      pageIndex: that.data.pageIndex,
      pageSize: that.data.pageSize,
      liebiao: 1
    }

    that.requestFenye(url, data)
  },

  //分页方法
  requestFenye: function (url, data, xiala) {
    let that = this;
    http.requstPostData(url, data, function (res) {
      console.log(res)
      var list = res.data.content

      if (res.retCode == 0) {
        if (list.length > 0) {
          if (xiala == 7) {
            that.setData({
              list: []
            })
          }
          for (var i = 0; i < res.data.content.length; i++) {
            var times = util.js_date_time(res.data.content[i].createdTime)
            times = util.dateFormat(times)
            var usetimes = util.js_date_time(res.data.content[i].useDate).substring(0, 10)
            usetimes = util.dateFormat(usetimes)

            res.data.content[i]['createdTime'] = times;
            res.data.content[i]['useDate'] = usetimes;
          }

          list = that.data.list.concat(list)
          that.setData({
            list: list,
            pageIndex: that.data.pageIndex + 1,
            flag: true,
          })
        } else {
          that.setData({
            nodata: 1,
            flag: false,
          })
          //如果数据为空，xiala=0，不让nodata显示
          if (xiala == 0) {
            that.setData({
              nodata: 0,
            })
          }
        }
      }
    })
  },
  //下拉触发的方法
  loadMore: function (e) {
    if (this.data.flag) {
      let url = http.showOrders + '/' + wx.getStorageSync('userId');
      let data = {
        type: this.data.type,
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
      }
      let xiala = 0
      this.requestFenye(url, data, xiala)
    }
  },
  dianwo: function () {
    let url = http.showOrders + '/' + wx.getStorageSync('userId');
    let data = {
      type: this.data.type,
      pageIndex: 0,
      pageSize: this.data.pageSize,
    }
    let xiala = 7
    this.requestFenye(url, data, xiala)
  },
  //支付订单
  zhifu: function (e) {
    let openId = wx.getStorageSync('openId')
    let ordernumber = wx.getStorageSync('ordernumber')
    let url = http.miniPay
    let data = {
      appId: config.appId,
      redirect: config.payUrl,
      openId: openId,
      orderNo: ordernumber,
      attach: "order"
    }
    http.requstPostData(url, data, function (res) {
      console.log(res)
      if (res.retCode == 0) {
        wx.requestPayment({
          appId: config.appId,
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: "HMAC-SHA256",
          paySign: res.data.paySign,
          success(res) {
            console.log(res)
            setTimeout(function () {
              wx.navigateTo({
                url: '../ticket/sucess/sucess'
              })
            }, 1000)
          },
          fail(res) {

          }
        })
      } else {
        wx.showToast({
          title: '订单超时，请重新下订单',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //取消订单
  deleteorder: function (e) {
    let that = this;
    let orderno = e.currentTarget.dataset.orderno //订单状态
    wx.showModal({
      title: '温馨提示',
      content: '取消订单后，将重新下单，确定取消吗？',
      success(res) {
        if (res.confirm) {
          for (var i = 0; i < that.data.list.length; i++) {
            if (orderno == that.data.list[i].orderNo) {
              that.setData({
                productcode: that.data.list[i].orderNo,
              })
            }
          }
          var url = http.cancleOrder + '/' + that.data.productcode; //取消订单
          var data = {

          }
          http.requstPostData(url, data, function (res) {
            console.log(res)
            if (res.isOk == true) { //取消订单成功
              that.setData({
                list: []
              })
              url = http.showOrders + '/' + wx.getStorageSync('userId');
              data = {
                type: that.data.type,
                pageIndex: 0,
                pageSize: 10,
              }
              that.requestFenye(url, data)
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },


  orderdetail: function (e) {
    let paystatus = e.currentTarget.dataset.paystatus //订单状态
    let orderno = e.currentTarget.dataset.orderno //订单号
    let realprice = e.currentTarget.dataset.realprice //金额
    let createdtime = e.currentTarget.dataset.createdtime //订单创建日期
    let ordername = e.currentTarget.dataset.ordername //门票标题
    let itco = e.currentTarget.dataset.itco //支付成功的出票状态
    if (paystatus == 1 || paystatus == 2) {
      wx.navigateTo({
        url: '../ticket/ticketpay/ticketpay?ordernumber=' + orderno,
      })
      return false
    }
    wx.navigateTo({
      url: '../orderdetail/orderdetail?paystatus=' + paystatus + '&orderno=' + orderno + '&realprice=' + realprice + '&createdtime=' + createdtime + '&ordername=' + ordername + '&type=' + this.data.type + '&itco=' + itco,
    })
  },

  loadData: function () {
    var options = {
      'type': this.data.type
    }
    this.setData({
      pageIndex: 0
    })
    this.onLoad(options)
  },
  // onUnload: function () {
  //   wx.switchTab({
  //     url: '../person/person',
  //   })
  // },


})