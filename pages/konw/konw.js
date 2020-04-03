import { config } from '../../config.js'
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
var WxParse = require('../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    name:'',
    productInfo:{},
    payNotice:'',
    descript1:'',
    isChecked:false,
    productcode:'',
    basTagDtos:{},
    productName:'',
    listHeight:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      type: options.type
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          listHeight: res.windowHeight - 50
        })
      },
    })


   
    var data = {
      productCode: options.productcode
    }
    var url = http.getTicket + '?productCode=' + data.productCode
    http.requstGetData(url, function (res) {
      console.log(res)
      if (res.retCode == 0) {
        that.setData({
          name:options.name,
          basTagDtos: res.data.basTagDtos,
          productName: res.data.productInfo.productName,
          productcode: options.productcode,
          productInfo: res.data.productInfo, //整个对象
          imgUrl: res.data.productInfo.imagePath, 
        })
        if (res.data.productInfo.profile != null && res.data.productInfo.payNotice != null) {
          that.setData({
            nodes: res.data.productInfo.profile, //使用说明
            nodes: res.data.productInfo.payNotice //预定须知
          })
          WxParse.wxParse('article', 'html', res.data.productInfo.payNotice, that, 0); //预定须知
          WxParse.wxParse('shiyong', 'html', res.data.productInfo.profile, that, 0); //使用说明
        }
      }
    })
  },
  
  //点击订票按钮
  ordertijiao: function (e) {
    let productName = this.data.productName;
    let productcode = this.data.productcode;
    if (this.data.isChecked) {
      wx.navigateTo({
        url: '../tickettijiao/tickettijiao?productName=' + productName + '&productcode=' + productcode + '&basTagDtos=' + JSON.stringify(this.data.basTagDtos) + '&name=' + this.data.name + '&type=' + this.data.type,
      })
    } else {
      wx.showToast({
        title: '请勾选已阅读订票须知',
        icon: 'none'
      })
    }

  },

  checkboxChange: function (e) {
    this.setData({
      isChecked: !this.data.isChecked
    })
  },
})