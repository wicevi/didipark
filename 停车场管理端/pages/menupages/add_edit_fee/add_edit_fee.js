// pages/menupages/add_edit_fee/add_edit_fee.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime:"22:00",
    endTime:"08:00",
    isMaxFee:false,
    isAllNight:false,
    isMonth:false,
    isQuarter:false,
    isHalfYear:false,
    isYear:false,
    tempFee:null,
  },
  //开始时间选择
  startTimeChange(e){
    this.setData({
      startTime: e.detail.value
    })
  },
  //结束时间选择
  endTimeChange(e){
    this.setData({
      endTime: e.detail.value
    })
  },
  //收费限制切换
  switchMaxFee(e){
    this.setData({
      isMaxFee: e.detail.value
    })
  },
  //包夜功能切换
  switchAllNight(e){
    this.setData({
      isAllNight: e.detail.value
    })
  },
  //包月功能切换
  switchMonth(e){
    this.setData({
      isMonth: e.detail.value
    })
  },
  //包月功能切换
  switchQuarter(e){
    this.setData({
      isQuarter: e.detail.value
    })
  },
  //包月功能切换
  switchHalfYear(e){
    this.setData({
      isHalfYear: e.detail.value
    })
  },
  //包年功能切换
  switchYear(e){
    this.setData({
      isYear: e.detail.value
    })
  },
  //表单提交事件
  submitFee(e){
    console.log(e.detail.value);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var feeData=options.data==null?null:JSON.parse(options.data);
    if(feeData!=null){
      if(feeData.dayMaxFee>0)this.data.isMaxFee=true;
      if(feeData.allNightPrice>0){
        this.data.isAllNight=true;
        this.data.startTime=feeData.allNightStartTime;
        this.data.endTime=feeData.allNightEndTime;
      }
      if(feeData.monthPrice>0)this.data.isMonth=true;
      if(feeData.quarterPrice>0)this.data.isQuarter=true;
      if(feeData.halfYearPrice>0)this.data.isHalfYear=true;
      if(feeData.yearPrice>0)this.data.isYear=true;
      wx.setNavigationBarTitle({
        title: '编辑收费策略',
      });
      this.setData({
        tempFee:feeData,
        isMaxFee:this.data.isMaxFee,
        isAllNight:this.data.isAllNight,
        isMonth:this.data.isMonth,
        isQuarter:this.data.isQuarter,
        isHalfYear:this.data.isHalfYear,
        isYear:this.data.isYear,
        startTime:this.data.startTime,
        endTime:this.data.endTime,
      })
    }
  },
})