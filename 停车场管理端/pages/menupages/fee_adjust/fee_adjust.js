// pages/menupages/fee_adjust/fee_adjust.js
//获取应用实例
const app = getApp();
Page({
  data: {
    //车场列表
    parkList:app.globalData.parkList,
    parkIndex:app.globalData.parkIndex,
    //策略列表
    feeList:[
      {
        feeId:102,//收费策略ID
        feeName:"临时车辆收费策略",//收费策略名称
        freeTime:900,//免费时长（秒）
        startTime:7200,//起步价时长（秒）
        startPrice:1000,//起步价（分）
        stepTime:3600,//计费步长时长（秒）
        stepPrice:200,//每步长价格（分）
        dayMaxFee:3000,//当日最高收费（分）为0无效
        allNightStartTime:"22:00:00",//包夜开始时间
        allNightEndTime:"08:00:00",//包夜结束时间
        allNightPrice:2000,//包夜价格（分）为0无效
        monthPrice:30000,//包月价格（分） 为0该车场不支持
        quarterPrice:50000,//包季价格（分） 为0该车场不支持
        halfYearPrice:100000,//包半年价格（分） 为0该车场不支持
        yearPrice:180000,//包年价格（分） 为0该车场不支持
      },
      {
        feeId:103,//收费策略ID
        feeName:"内部车辆收费策略",//收费策略名称
        freeTime:900,//免费时长（秒）
        startTime:7200,//起步价时长（秒）
        startPrice:800,//起步价（分）
        stepTime:3600,//计费步长时长（秒）
        stepPrice:160,//每步长价格（分）
        dayMaxFee:0,//当日最高收费（分）为0无效
        allNightStartTime:"22:00:00",//包夜开始时间
        allNightEndTime:"08:00:00",//包夜结束时间
        allNightPrice:0,//包夜价格（分）为0无效
        monthPrice:30000,//包月价格（分） 为0该车场不支持
        quarterPrice:50000,//包季价格（分） 为0该车场不支持
        halfYearPrice:0,//包半年价格（分） 为0该车场不支持
        yearPrice:0,//包年价格（分） 为0该车场不支持
      },
    ],
    feeIndex:0
  },
  //车场切换事件
  parkChange(e) {
    console.log("feeAdjust[parkChange:"+e.detail.value+"]");
    app.globalData.parkIndex = e.detail.value;
    this.setData({
      parkIndex: app.globalData.parkIndex
    })
  },
  //默认策略切换事件
  feeChange(e) {
    console.log("feeAdjust[feeChange:"+e.detail.value+"]");
    this.data.feeIndex = e.detail.value;
    this.setData({
      feeIndex: this.data.feeIndex
    })
  },
  //点击具体策略
  editFee(e){
    wx.navigateTo({
      url: '../add_edit_fee/add_edit_fee?data='+JSON.stringify(this.data.feeList[e.currentTarget.dataset.index]),
    })
  },
  //添加新策略
  addFee(){
    wx.navigateTo({
      url: '../add_edit_fee/add_edit_fee',
    })
  },
  //切到前台
  onShow:function(){
    this.setData({
      parkList:app.globalData.parkList,
      parkIndex: app.globalData.parkIndex
    })
  }
})