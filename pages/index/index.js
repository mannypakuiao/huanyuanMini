import { config } from '../../config.js'
import { HTTP } from '../../utils/http.js'
let http = new HTTP()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tickets: [],
    imgUrl: '',
    name: '',
    productInfo: {},
    descript1: '',
    payNotice: '',
    isChecked: false,
    productName: '',
    productcode: '',
    basTagDtos: [],
    introduction: '',
    ticketType: '',
    code:'',
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var scene = options.scene
    console.log(scene)
    wx.setStorageSync('scene', scene)
    // var scene = decodeURIComponent(options.scene)//参数二维码传递过来的参数
    // wx.setStorageSync('scene', scene)
    let that = this;    
    wx.login({
      success(res) {
        if (res.code) {
          that.setData({
            code: res.code
          })
          console.log('获取用户登录凭证：' + res.code);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    that.setData({
      type: '1',
    })
    // 景区分类
    var data = {
      merchantCode: '001'
    }
    var url = http.getBriefTickets + '?merchantCode=' + data.merchantCode
    http.requstGetData(url, function (res) {
      console.log(res)
      if (res.retCode == 0) {
        that.setData({
          imgUrl: res.data[0].imagePath,
          tickets: res.data
        })
      }
    })

    url = http.getMct + '?merchantCode=' + data.merchantCode
    http.requstGetData(url, function (res) {
      console.log(res)
      if (res.retCode == 0) {
        that.setData({
          introduction: res.data.merchantInfo.introduction,
          name: res.data.merchantInfo.name,
        })
        console.log(that.data.introduction)
      }
    })

  },
  xuzhi: function (e) {
    let userId = wx.getStorageSync('userId');
    let productcode = e.currentTarget.dataset.productcode;
    wx.setStorageSync('productcode', productcode)
    if (userId == null || userId == "") {
      wx.showModal({
        title: '温馨提示',
        content: '抱歉,还未登录！',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../person/person',
            })
          } else if (res.cancel) {

          }
        }
      })
      return false
    }
    wx.navigateTo({
      url: '../konw/konw?productcode=' + productcode + '&name=' + this.data.name
    })
  },
  //获取用户信息
  getUserinfo: function (e) {
    let productcode = e.currentTarget.dataset.productcode;
    wx.setStorageSync('productcode', productcode)
    let userId = wx.getStorageSync('userId');
    if (userId == null || userId == "") {

    } else {
      console.log(this.data.type)
      wx.navigateTo({
        url: '../konw/konw?productcode=' + wx.getStorageSync('productcode') + '&name=' + this.data.name + '&type=' + this.data.type
      })
      return false
    }
    let that = this;

    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        wx.setStorageSync('userInfo', res.userInfo);
        that.getOpenId()
      },
      fail: function (e) {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
  },
  //授权登录获取openId
  getOpenId: function () {
    let that = this;
    let url = http.userLogin
    let data = {
      code: that.data.code,
      appId: config.appId
    }

    http.requstPostData(url, data, function (res) {
      console.log(res)
      if (res.retCode == 0) {
        wx.setStorageSync('openId', res.data.openId)
        if (res.data.hasUser) {
          wx.setStorageSync('userId', res.data.userId);
          that.panduan()
        } else {
          that.regster(res.data.openId)
        }
      } else {
        wx.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //判断uerId
  panduan: function (e) {
    console.log(this.data.type)
    let that = this;
    let userId = wx.getStorageSync('userId');
    if (userId == null || userId == "") {
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../konw/konw?productcode=' + wx.getStorageSync('productcode') + '&name=' + this.data.name + '&type=' + this.data.type
      })
    }
  },
  //注册
  regster: function (openId) {
    console.log('------------')
    let that = this;
    let url = http.wxRegister
    let data = {
      appId: config.appId,
      openId: openId,
      nickname: ''
    }
    http.requstPostData(url, data, function (res) {
      console.log(res)
      if (res.retCode == 0) {
        wx.setStorageSync('userId', res.data.userId)
        that.panduan()
      }
    })
  },
})