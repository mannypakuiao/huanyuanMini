import { config } from '../config.js'

class HTTP{
//接口
  //首页
  home = "/Home/selByImg"
  //景区
  selJq = "/Home/selJq"
  //登录
  userLogin = "/mini/userLogin/"
  //门票列表
  getMerchants = "/prd/getMerchants"
  //门票分类
  getBriefTickets = "/mini/getBriefTickets"
  getMct = "/mini/getMct/"  
  //获取订票页面
  getTicket = "/mini/getTicket/"
  //提交订单填写信息页面
  getActivePrice = "/mini/getActivePrice/"
  //点击创建提交订单
  createOrder =  "/mini/createOrder/"
  //支付
  miniPay =  "/mini/miniPay/"
  getOrder = "/mini/getOrder/"
  //注册
  wxRegister = "/mini/wxRegister/" 
  //我的订单
  showOrders = "/mini/showOrders"
  //订单详情
  getOrderDetails = "/mini/getOrderDetails"
  //取消订单
  cancleOrder = "/mini/cancleOrder"
  //检查订单是否使用。能否退款
  refundOrderCheck = "/mini/refundOrderCheck"
  //退款
  refundOrder = "/mini/refundOrder"
  addComp = "/comp/addComp"
  //我的投诉
  queryComps = "/comp/queryComps"
  
// POST 请求
  requstPostData(url, param, callback) {
    console.log(param)
    wx.showLoading({
      title: '加载中...',
    })

    wx.request({
      url: config.url + url,
      data: param,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        callback(res.data)
      },
      fail: function (res) {
        wx.showToast({
          title: res.retMsg,
          duration: 2000
        })
      }
    })
  }

//GET请求
  requstGetData(url, callback){
    wx.showLoading({
      title: '加载中...',
    })

    wx.request({
      url: config.url + url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        callback(res.data)
      },
      fail: function (res) {
        wx.showToast({
          title: res.retMsg,
          duration: 2000
        })
      }
    })
  }

  //同步GET请求
  
}

export { HTTP }