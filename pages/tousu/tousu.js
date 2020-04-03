import { config } from '../../config.js'
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticelist:[],
    pageNumber: 1,
    pageSize: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let that = this;
    let url = http.queryComps;
    let data = {
      createBy: wx.getStorageSync('userId'),
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize,
    }

    http.requstPostData(url, data, function (res) {
      console.log(res)
      var list = res.data.list

      if (res.code == 0) {
        if (list.length > 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            var times = util.js_date_time(res.data.list[i].createTime)
            res.data.list[i]['createTime'] = times;
          }

          that.setData({
            noticelist: list
          })
        } else {
          
        }
      }

    })
  },

  lianxi: function (e) {
    wx.makePhoneCall({
      phoneNumber: '400000000' //仅为示例，并非真实的电话号码
    })
  },

  zaixian:function(e){
    wx.navigateTo({
      url: '../tousuform/tousuform',
    })
  }
})