// pages/menupages/car_manage/car_manage.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //车场列表
    parkList:app.globalData.parkList,
    parkIndex:app.globalData.parkIndex,
    //策略列表以及其车辆
    carGroupList:[
      {
        carGroupId:12,
        carGroupTitle:"商务车辆",
        carGroup:[
          "闽D99999",
          "京C88888",
        ]
      },
      {
        carGroupId:13,
        carGroupTitle:"内部车辆",
        carGroup:[
          "闽D99999",
          "京C88888",
          "京C88888",
          "京C88888",
        ]
      },
      {
        carGroupId:14,
        carGroupTitle:"快递车辆",
        carGroup:[
          "闽D99999",
          "京C88888",
        ]
      },
      {
        carGroupId:15,
        carGroupTitle:"员工车辆",
        carGroup:[
          "闽D99999",
          "京C88888",
          "闽D99999",
          "京C88888",
          "闽D99999",
          "京C88888",
        ]
      },
    ],
    carGroupIndex:0,
  },

  //车场切换事件
  parkChange(e) {
    console.log("feeAdjust[parkChange:"+e.detail.value+"]");
    app.globalData.parkIndex = e.detail.value;
    this.setData({
      parkIndex: app.globalData.parkIndex
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