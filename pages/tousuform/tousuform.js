import { config } from '../../config.js'
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accounts: ['景区', '购物', '酒店', '饮食'],
    accountIndex: 0,
    imglist: [],
    username: '',
    phone: '',
    content: '',
    src: [],
    flag: true,
    lengths: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  formSubmit: function (e) {
    wx.navigateTo({
      url: '../toususucess/toususucess',
    })
  },

  //投诉主题
  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      accountIndex: e.detail.value
    })
  },

  //打开本地相册
  chooseImage: function () {
    let user = this.userIdflag()
    if (user == false) {
      return false
    }
    var that = this;
    that.setData({
      flag: false
    })

    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success(res) {
        var tempFilePaths = res.tempFilePaths
        tempFilePaths = that.data.imglist.concat(tempFilePaths)

        that.uploadFile(tempFilePaths)
      },
    })
  },
  //上传图片
  uploadFile: function (tempFilePaths) {
    let that = this;
    if (tempFilePaths.length < 4) {
      for (var i = 0; i < tempFilePaths.length; i++) {
        wx.uploadFile({
          url: config.url + '/comp/uploadPicture',
          filePath: tempFilePaths[i],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          success(res) {
            console.log('上传成功')
            that.setData({
              imglist: tempFilePaths
            })
            that.data.src.push(JSON.parse(res.data).data)
            //数组去重
            var newArr = [];
            for (var i in that.data.src) {
              if (newArr.indexOf(that.data.src[i]) == -1) {
                newArr.push(that.data.src[i])
              }
            }
            //---------------------------------------------------------
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              src: newArr,
              flag: true
            })
            console.log(that.data.flag)
          },
          fail(res) {
            console.log('上传失败')
            wx.showToast({
              title: '上传失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    } else {
      that.setData({
        flag: true
      })
      wx.showToast({
        title: '只允许上传三张',
        icon: 'none'
      })
    }

  },
  close: function (e) {
    let index = e.currentTarget.dataset.index;
    let imglist = this.data.imglist;
    let src = this.data.src;
    imglist.splice(index, 1);
    src.splice(index, 1)
    this.setData({
      imglist: imglist,
      src: src
    })
  },
  //联系人
  username: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  //电话
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //投诉原因
  bindTextAreaChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },

  //表单提交
  formSubmit: function (e) {
    let user = this.userIdflag()
    if (user == false) {
      return false
    }
    if (this.data.username == '') {
      wx.showToast({
        title: '请填写联系人姓名',
        icon: 'none'
      })
      return false;
    }
    if (this.data.phone == '' || !(/^1[345789]\d{9}$/.test(this.data.phone))) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
      return false;
    }
    if (this.data.flag) {
      let accountIndex = parseInt(this.data.accountIndex)
      var data = {
        theme: accountIndex + 1,
        content: this.data.content,
        imgsrc1: this.data.src[0],
        imgsrc2: this.data.src[1],
        imgsrc3: this.data.src[2],
        contacts: this.data.username,
        telephone: this.data.phone,
        createBy: wx.getStorageSync('userId')
      }
      var url = http.addComp
      http.requstPostData(url, data, function (res) {
        console.log(res)
        if (res.isOk) {
          wx.navigateTo({
            url: '../toususucess/toususucess',
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500
          })
        }
      })
    } else {
      wx.showToast({
        title: '等图片上传后才能提交哦！',
        icon: 'none',
        duration: 2000
      })
    }

  },
  //判断uerid
  userIdflag: function () {
    if (wx.getStorageSync('userId') == null || wx.getStorageSync('userId') == '') {
      wx.showModal({
        title: '温馨提示',
        content: '抱歉还未登陆,请先登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../person/person',
            })

          } else if (res.cancel) {

          }
        }
      })
      var user = false
      return user
    }
  }

})