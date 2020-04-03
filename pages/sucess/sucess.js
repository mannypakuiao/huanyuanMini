// pages/ticket/sucess/sucess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('payStatus', '3');
    console.log(options.type)
    this.setData({
      type: options.type
    })
  },

  shouye: function () {
    let type = this.data.type;
    let ordername = wx.getStorageSync('ordername');
    let createdtime = wx.getStorageSync('createdtime');
    let realprice = wx.getStorageSync('realprice');
    let orderno = wx.getStorageSync('orderno');
    let paystatus = wx.getStorageSync('payStatus');

    wx.navigateTo({
      url: '../myorder/myorder?type=' + type,
    })
  },
  onUnload: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  // backshouye: function () {
  //   wx.switchTab({
  //     url: '../../index/index',
  //   })
  // }
})