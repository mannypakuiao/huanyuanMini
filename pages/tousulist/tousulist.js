import { config } from '../../config.js'
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tousu: [],
    flag: false,
    windowHeight: '',
    pageNumber: 1,
    pageSize: 10,
    nodata: '',
    show: false,
    content: '',
    times: '',
    huifutimes: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })
    let url = http.queryComps;
    let data = {
      createBy: wx.getStorageSync('userId'),
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize,
    }

    that.requestFenye(url, data)

  },

  requestFenye(url, data, xiala) {
    let that = this;
    http.requstPostData(url, data, function (res) {
      console.log(res)
      var list = res.data.list

      if (res.code == 0) {
        if (list.length > 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            var times = util.js_date_time(res.data.list[i].createTime)
            res.data.list[i]['createTime'] = times;
          }

          list = that.data.tousu.concat(list)
          that.setData({
            tousu: list,
            pageNumber: that.data.pageNumber + 1,
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

  loadMore: function (e) {
    if (this.data.flag) {
      let url = http.queryComps;
      let data = {
        type: '1',
        pageNumber: this.data.pageNumber,
        pageSize: this.data.pageSize,
      }
      let xiala = 0
      this.requestFenye(url, data, xiala)
    }
  },

  huifu: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index
    for (var i = 0; i < that.data.tousu.length; i++) {
      if (index == i) {
        that.setData({
          huifutimes: util.js_date_time(that.data.tousu[i].replyTime).substring(0, 10),
          content: that.data.tousu[i].replycontent
        })
      }
    }
    that.setData({
      show: true
    })
  },
  //关闭遮罩
  onclose: function () {
    this.setData({
      show: false
    })
  }
})