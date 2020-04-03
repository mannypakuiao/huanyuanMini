import { config } from '../../config.js'
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    zhuantai: false,
    flag:false,
    price1:'',
    day1:'',
    day2:'',
    //日历
    hasEmptyGrid: false,
    cur_year: '',
    cur_month: '',
    //---------------------------------------
    values: '1',
    money:'', 
    username:'',
    phone:'',
    date:'',
    show:false,
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' }
    ],
    dateliindex: '0',
    productcode: '',
    productName: '',
    basTagDtos:[],
    riqi:[],
    selectPrice:'',
    mens:'1',
    pricedays: [],
    todayIndex2: '',
    carid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      type: options.type,
      name: options.name, //公园名字
      riqi: that.dealDate(), //获取当天，明天，后天的日期
      productcode: options.productcode, //门票编码
      productName: options.productName, //(成人，儿童)
      //basTagDtos: JSON.parse(options.basTagDtos)
    })
    this.setNowDate();
//------------------------------------------------------------------------------------------------------------------
    var url = http.getActivePrice;
    let data = {
      begDate: that.data.riqi[0],
      endDate: that.data.riqi[that.data.riqi.length - 1],
      productCode: options.productcode
    }
    http.requstPostData(url, data, function (res) {
      console.log(res)
      if (res.retCode == 0){
        that.setData({
          riqi: res.data,
        })
      }
      //因为是异步，所以请求完给riqi数组渲染后，在执行。
      that.setData({
        date: that.data.riqi[0].sDate,    //使用日期默认第一个
      })
      that.dealSelect()
    })

  },
  
  //获取当天明天后天日期
  dealDate:function(e){
    let date = util.format(new Date())
    let dateArr = []
    for (let i = 0; i < 3; i++) {
      dateArr.push(util.switchs(date, i))
    }
    return dateArr
  },

  //获取一周的时间
  week:function(){
    let date = util.format(new Date())
    let weekarry = []
    for (let i = 0; i < 7; i++) {
      weekarry.push(util.switchs(date, i))
    }
    return weekarry
  },
  
  dealSelect: function(e) {
    for(var i = 0;i < this.data.riqi.length;i++){
      this.setData({
        selectPrice: this.data.riqi[0].price,
        money: this.data.riqi[0].price
      })
    }
  },

  //点击使用日期
  rilishow:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index
    that.setData({
      //values: 1,
      dateliindex:index
    })
    for (var i = 0; i < that.data.riqi.length;i++){
      if (index == i && that.data.riqi[i].sDate != '更多'){
        that.setData({
          date: that.data.riqi[i].sDate,
          selectPrice: that.data.riqi[i].price,
          money: that.data.riqi[i].price
        })
      }
    }    
    //点击更多
    if(index == 3){
      if(that.data.show){
        that.setData({
          show: false
        })
      } else {
        that.setData({
          show: true
        })
      }
    }
  },

  //购买数量的值发生改变时触发
  onChange:function(e){
    console.log(e.detail)
    if (e.detail < 41){
      if (e.detail != '' || e.detail != 0) {
        let selectPrice = this.data.money * e.detail;
        this.setData({
          selectPrice: selectPrice
        })
      }
      if (e.detail == 0) {
        this.setData({
          selectPrice: this.data.money
        })
      }
      this.setData({
        mens: e.detail
      })
    }
  },

  //点击遮罩关闭日历
  onClose: function () {
    this.setData({
      show: false
    })
  },

  //用户名
  onblur1: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  //手机号
  onblur2: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //身份证
  onblur3: function (e) {
    this.setData({
      carid: e.detail.value
    })
  },
  submit: function (e) {
    console.log(wx.getStorageSync('openId'))
    let that = this;
    let username = this.data.username;
    let phone = this.data.phone;
    let carid = this.data.carid;
    if(username == ''){
      wx.showToast({
        title: '请填写联系人姓名',
        icon: 'none'
      })
      return false;
    }
    if (phone == '' || !(/^1[345789]\d{9}$/.test(phone))){
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none'
      })
      return false;
    }
    if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(carid))){
      wx.showToast({
        title: '身份证号码有误',
        icon: 'none'
      })
      return false;
    }
    that.setData({
      zhuantai: true
    })
    let url = http.createOrder
    let data = {
      contactIdNumber: that.data.carid,
      productCode: that.data.productcode, //门票code
      merchantCode: '000', //景区code
      useDateStr: that.data.date, //使用日期
      ticketsCnt: that.data.mens,//购买的数量
      appId: 'wx29206033c7371ee1', //appid
      openId: wx.getStorageSync('openId'),//openid 
      contactName: that.data.username,//用户名
      contactPhone: that.data.phone,//手机号
      distributorId: wx.getStorageSync('scene')
    }
   // return false
    http.requstPostData(url, data, function (res) {
      console.log(res)
      if(res.retCode == 0){
        wx.setStorageSync('ordernumber', res.data)
        wx.navigateTo({
          url: '../ticketpay/ticketpay?ordernumber=' + res.data + '&type=' + that.data.type,
        })
      } else {
        wx.showToast({
          title: res.retMsg,
          icon:'none',
          duration: 2000
        })
        that.setData({
          zhuantai: false
        })
      }
    })
    
  },

  //日历------------------------------------------------
  dateSelectAction: function (e) {
    var cur_day = e.currentTarget.dataset.idx;
    for (var i = 0; i < this.data.pricedays.length;i++){
      if (this.data.pricedays[i].day == cur_day + 1){
        this.setData({
          flag:true,
          todayIndex: cur_day,
          date: this.data.cur_year + '-' + this.data.cur_month + '-' + (cur_day + 1),
          show: false,
        })
      } 
    }
    if(this.data.flag == false){
      wx.showToast({
        title: '只能选择一周内的',
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({
      flag:false
    })
    console.log(`点击的日期:${this.data.cur_year}年${this.data.cur_month}月${cur_day + 1}日`);
  },

  dateSelectAction2:function(e){
    var price = e.currentTarget.dataset.price;
    var index = e.currentTarget.dataset.index;
    var day2 = e.currentTarget.dataset.day2;
    for (var i = 0; i < this.data.pricedays.length; i++) {
      if (this.data.pricedays[i].day == day2) {
        this.setData({
          todayIndex2: index,
          selectPrice: price
        })
      }
    }
    
  },

  setNowDate: function () {
    const date = new Date();
    const cur_year = date.getFullYear();  //当前年份
    const cur_month = date.getMonth() + 1; //当前月份
    const todayIndex = date.getDate() - 1; //当前日期前一天
    console.log(`日期：${todayIndex}`)
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    this.setData({
      cur_year: cur_year,
      cur_month: cur_month,
      weeks_ch,
      todayIndex,
    })
//=======================================================================================
    let weekarry= this.week();
    var url = http.getActivePrice;
    let data = {
      begDate: weekarry[0], 
      endDate: weekarry[6],
      productCode: this.data.productcode
    }
    let that = this;
    http.requstPostData(url, data, function (res) {
      console.log(res)
      if (res.retCode == 0){
        that.setData({
          pricedays:res.data
        })
      }
    })
//======================================================================================
  },

  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  }
})