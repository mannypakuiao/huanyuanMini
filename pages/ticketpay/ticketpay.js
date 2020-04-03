import { config } from '../../config.js'
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contactIdNumber: '',
    orderdesc: ['入园地址', '使用方法', '使用日期', '购买数量', '退改规则', '联系人', '联系电话','身份证号'],
    orderInfo:{},
    merchantInfo:{},
    productInfo:{},
    createDate: '',
    useDate:'',
    ordernumber: '',
    ticketType:'',
    name:'',
    productName:'',
    chongfusubmit: false,
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      type: options.type,
      ticketType: wx.getStorageSync('ticketType')
    })
    if (options){
      wx.setStorageSync('ordernumber', options.ordernumber)
      that.setData({
        code: options.ordernumber
      })
    } else {
      let code = wepy.getStorageSync('ordernumber')
      that.setData({
        code: options.ordernumber
      })
    }
    
    that.setData({
      ordernumber: options.ordernumber
    })
    let url = http.getOrder + '/' + options.ordernumber 
    http.requstGetData(url, function (res) {
      console.log(res)
      if (res.retCode == 0){
        that.setData({
          merchantInfo: res.retMsg.merchantInfo,
          orderInfo: res.retMsg.orderInfo,
          productInfo: res.retMsg.productInfo,
          //contactIdNumber:util.sub(res.retMsg.orderInfo.contactIdNumber,4,4),
          createDate: util.format(new Date(res.retMsg.orderInfo.createdTime), 'yyyy-MM-dd'),//下单时间
          useDate: util.format(new Date(res.retMsg.orderInfo.useDate), 'yyyy-MM-dd')//下单时间
        })
        wx.setStorageSync('ordername', res.retMsg.orderInfo.orderName)
        wx.setStorageSync('createdtime', that.data.createDate)
        wx.setStorageSync('realprice', res.retMsg.orderInfo.realPrice)
        wx.setStorageSync('orderno', res.retMsg.orderInfo.orderNo)
      }
    })
    //车票
    if (wx.getStorageSync('ticketType') == 2) {
      //let orderdesc = that.data.orderdesc.splice(2,5)
      let orderdesc = that.data.orderdesc
      that.setData({
        orderdesc:orderdesc
      })
    }
  },
  formSubmit:function(e){
    let that = this;
    that.setData({
      chongfusubmit: true
    })
    let openId = wx.getStorageSync('openId')
    let url = http.miniPay
    let data = {
      appId: config.appId,
      redirect: config.payUrl,
     // openId: openId,
      openId: wx.getStorageSync('openId'),
      orderNo: this.data.ordernumber,
      attach: "order"
    }
    http.requstPostData(url, data, function (res) {
      console.log(res)
      if (res.retCode == 0){
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
                url: '../sucess/sucess?type=' + that.data.type
              })
            }, 300)
          },
          fail(res) {

          }
        })
        setTimeout(function () {
          that.setData({
            chongfusubmit: false
          })
        }, 2000)
      } else {
        wx.showToast({
          title: '订单超时，请重新下订单',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  onUnload: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  
})