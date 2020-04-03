import { config } from '../../config.js'
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
let util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:'',
    nickname:'一键登录',
    phone:'',
    list: [
      { title: '我的门票', img: '../../images/icon/order.png'},
      // { title: '我的车票', img: '../../images/icon/order.png' },
      { title: '我的投诉', img: '../../images/icon/tousu.png' },
      // { title: '帮助中心', img: '../../images/icon/help.png'},
      { title: '联系我们', img: '../../images/icon/lianxi.png' },
      // { title: '关于我们', img: '../../images/icon/guanyuwomen.png'},
    ],
    img:'../../images/touxiang2.png',
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let that = this;

    let userId = wx.getStorageSync('userId');
    console.log(userId)
    if (userId == null || userId == ""){
      
    } else {
      that.setData({
        nickname: wx.getStorageSync('userInfo').nickName,
        img: wx.getStorageSync('userInfo').avatarUrl,
      })
    }

    wx.login({
      success(res) {
        if (res.code) {
          that.setData({
            code:res.code
          })
          console.log('获取用户登录凭证：' + res.code);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  //获取用户信息
  getUserinfo: function (e){
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
  getOpenId: function(){
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
    let that = this;
    let userId = wx.getStorageSync('userId');
    if (userId == null || userId == "") {
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none',
        duration: 2000
      })
    } else {
      that.setData({
        nickname: wx.getStorageSync('userInfo').nickName,
        img: wx.getStorageSync('userInfo').avatarUrl,
      })
    }
  },
  //注册
  regster: function (openId){
    let that = this;
    let url = http.wxRegister
    let data = {
      appId: config.appId,
      openId: openId,
      nickname: ''
    }
    http.requstPostData(url, data, function (res) {
      console.log(res)
      if (res.retCode == 0){
        wx.setStorageSync('userId', res.data.userId)
        that.panduan()
      }
    })
  },

  common:function(e){
    let userId = wx.getStorageSync('userId');
    if (userId == null || userId == "") {
      wx.showToast({
        title: '请先登录',
        icon:'none',
        duration:2000
      })
      return false
    }

    let index = e.currentTarget.dataset.index;
    let url = '';
    let type = '';
    //我的门票
    if (index == 0) {
      type = '1'
      url = '../myorder/myorder?type=' + type
    }
    //我的投诉
    if (index == 1) {
      url = '../tousulist/tousulist'
    }
    //联系我们
    if (index == 2) {
      wx.makePhoneCall({
        phoneNumber: '400000000' //仅为示例，并非真实的电话号码
      })
    }
    if (index == 4){
      wx.showToast({
        title: '页面待开发',
        icon:'none'
      })
    }
    wx.navigateTo({
      url: url,
    })
  }
})