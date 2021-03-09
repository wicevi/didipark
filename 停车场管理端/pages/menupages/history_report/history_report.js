// pages/menupages/history_report/history_report.js
//获取应用实例
const app = getApp();
var util = require("../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nowDate:util.getDate(),
    startDate:util.getDate(),
    endDate:util.getDate(),
    queryType:[
      {
        type:"day",
        name:"按日查询"
      },
      {
        type:"month",
        name:"按月查询"
      },
      {
        type:"year",
        name:"按年查询"
      },
    ],
    queryIndex:0,
    //报表列表
    reportNum:0,
    reportPrice:0,
    reportList:null,
    //加载数据弹窗
    isLoading:false,
  },
  //日期转换
  formatDate(date,num){
    var dateStrs=date.split("-");
    if(num==1)return dateStrs[0];
    if(num==2&&dateStrs.length==1)return dateStrs[0]+'-01';
    if(num==2&&dateStrs.length==3)return dateStrs[0]+'-'+dateStrs[1];
    if(num==3&&dateStrs.length==1)return dateStrs[0]+'-01-01';
    if(num==3&&dateStrs.length==2)return dateStrs[0]+'-'+dateStrs[1]+'-01';
    return date;
  },
  //转换报表数据
  formatReportList(list){
    this.data.reportNum=0;
    this.data.reportPrice=0;
    for(var i=0;i<list.length;i++){
      this.data.reportNum+=list[i].VipCount+list[i].IOCount+list[i].AbnormalCount;
      this.data.reportPrice+=list[i].VipPrice+list[i].IOPrice;
      list[i].Date=this.formatDate(list[i].Date,3-this.data.queryIndex);
    }
  },
  //开始时间选择
  startDateChange(e){
    var value=e.detail.value;
    this.setData({startDate:value});
    this.updateReportData();
  },
  //结束时间选择
  endDateChange(e){
    var value=e.detail.value;
    this.setData({endDate:value});
    this.updateReportData();
  },
  //模式选择
  queryTypeChange(e){
    var value=e.detail.value;
    var newStartDate = this.formatDate(this.data.startDate,3-value);
    var newEndDate = this.formatDate(this.data.endDate,3-value);
    this.setData({
      queryIndex:value,
      startDate:newStartDate,
      endDate:newEndDate,
    });
    this.updateReportData();
  },
  //获取报表信息
  updateReportData(e) {
    var this_=this;
    if(app.globalData.userInfo.userGroup=='operator'){
      wx.showToast({
        title: '权限不足',
        image: '/images/tip.png'
      });
      wx.stopPullDownRefresh();
      return;
    };
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      wx.request({
        url: app.HOST+app.URLS.query_report,
        header:app.requestHeader,
        data:{
          ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,
          StartTime:this_.formatDate(this_.data.startDate,3),
          EndTime:this_.formatDate(this_.data.endDate,3),
          Unit:this_.data.queryType[this_.data.queryIndex].type
        },
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.data.reportList=res.data.Result;
            this_.formatReportList(this_.data.reportList);
            wx.showToast({
              title: '获取数据成功',
              image:'/images/success.png'
            })
          }else{
            wx.showModal({
              title: '获取报表数据失败',
              content: res.data.Message,
              showCancel:false
            })
          }
        },
        fail:function(e){
          console.log(e);
          wx.showToast({
            title: '连接服务器异常',
            image:'/images/error.png'
          })
        },
        complete:function(res){
          this_.setData({
            reportNum:this_.data.reportNum,
            reportPrice:this_.data.reportPrice,
            reportList:this_.data.reportList,
            isLoading:false
          });
          //停止下拉刷新
          wx.stopPullDownRefresh();
        }
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(!this.data.reportList){
      this.updateReportData();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.updateReportData();
  },
})