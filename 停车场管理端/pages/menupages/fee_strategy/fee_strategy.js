// pages/menupages/fee_strategy/fee_strategy.js
//获取应用实例
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    feeList:null,
    //是否正在加载
    isLoading:false,
    //弹窗变量
    delIndex:-1,
    isOpenModal:false,
    feeInfo:{},
    defaultFeeInfo:{
      "Name": "",
      "FreeTime": 0,
      "StartTime": 0,
      "StartPrice": 0,
      "StepTime": 0,
      "StepPrice": 0,
      "DayHighPrice": 0,
      "NightStartTime": "22:00:00",
      "NightEndTime": "06:00:00",
      "NightPrice": 0,
      "NightStepPrice": 0,
      "MonthPrice": 0,
      "QuarterPrice": 0,
      "HalfYearPrice": 0,
      "YearPrice": 0,
    },
  },
  valueChange(e){
    var type=e.currentTarget.dataset.type;
    var value=e.detail.value;
    var this_=this;
    if(type.indexOf('is')==0){
      console.log('switch:'+value);
      this.data.feeInfo[type]=!this.data.feeInfo[type];
      this.setData({feeInfo:this_.data.feeInfo});
    }else if(type.indexOf('Price')>0){
      console.log('Price:'+value);
      if(value*100!=this.data.feeInfo[type]){
        this.data.feeInfo[type]=value*100;
        if((this.data.feeInfo[type]+'').indexOf('.')>=0){
          this.data.feeInfo[type]=parseInt((this.data.feeInfo[type]+'').split('.')[0]);
        }
        this.setData({feeInfo:this_.data.feeInfo});
      }
    }else if(type.indexOf('Time')>0&&type.indexOf('Night')<0){
      console.log('Time:'+value);
      if(value*60!=this.data.feeInfo[type]){
        if((value+'').indexOf('.')>=0){
          this.data.feeInfo[type]=parseInt((value+'').split('.')[0])*60;
        }else{
          this.data.feeInfo[type]=value*60;
        }
        this.setData({feeInfo:this_.data.feeInfo});
      }
    }else if(type.indexOf('Time')>0&&type.indexOf('Night')==0){
      console.log('NightTime:'+value);
      if(value+':00'!=this.data.feeInfo[type]){
        this.data.feeInfo[type]=value+':00';
        this.setData({feeInfo:this_.data.feeInfo});
      }
    }else{
      console.log('other:'+value);
      if(value!=this.data.feeInfo[type]){
        this.data.feeInfo[type]=value;
        this.setData({feeInfo:this_.data.feeInfo});
      }
    }
  },
  addFeeConfirm(e){
    var this_=this;
    console.log(this_.data.feeInfo);
    this_.setData({isLoading:true});
    wx.request({
      url: app.HOST+app.URLS.add_fee_strategy,
      header:app.requestHeader,
      method:"POST",
      data:this_.data.feeInfo,
      success:function(res){
        console.log(res);
        if(res.data.Code=="success"){
          this_.closeModal();
          wx.showToast({
            title: '添加成功',
            image:'/images/success.png'
          });
          this_.getFeeList();
        }else{
          wx.showModal({
            title: '添加收费策略异常',
            content: res.data.Message,
            showCancel:false
          })
        }
      },
      fail:function(e){
        wx.showToast({
          title: '连接服务器异常',
          image:'/images/error.png'
        });
      },
      complete:function(res){
        this_.setData({isLoading:false});
      },
    })
  },
  editFeeConfirm(e){
    var this_=this;
    this_.data.feeInfo.PriceID=this_.data.feeInfo.ID;
    console.log(this_.data.feeInfo);
    this_.setData({isLoading:true});
    wx.request({
      url: app.HOST+app.URLS.mod_fee_strategy,
      header:app.requestHeader,
      method:"POST",
      data:this_.data.feeInfo,
      success:function(res){
        console.log(res);
        if(res.data.Code=="success"){
          this_.closeModal();
          wx.showToast({
            title: '修改成功',
            image:'/images/success.png'
          });
          this_.getFeeList();
        }else{
          wx.showModal({
            title: '修改收费策略异常',
            content: res.data.Message,
            showCancel:false
          })
        }
      },
      fail:function(e){
        wx.showToast({
          title: '连接服务器异常',
          image:'/images/error.png'
        });
      },
      complete:function(res){
        this_.setData({isLoading:false});
      },
    })
  },
  delFeeConfirm(E){
    var this_=this;
    this_.setData({isLoading:true});
    wx.request({
      url: app.HOST+app.URLS.del_fee_strategy,
      header:app.requestHeader,
      method:"POST",
      data:{PriceID:this_.data.feeList[this_.data.delIndex].ID},
      success:function(res){
        console.log(res);
        if(res.data.Code=="success"){
          this_.data.feeList.splice(this_.data.delIndex, 1);
          this_.setData({feeList:this_.data.feeList});
          this_.hideConfirmDelModal();
          wx.showToast({
            title: '删除成功',
            image:'/images/success.png'
          })
        }else{
          wx.showModal({
            title: '删除收费策略异常',
            content: res.data.Message,
            showCancel:false
          })
        }
      },
      fail:function(e){
        wx.showToast({
          title: '连接服务器异常',
          image:'/images/error.png'
        });
      },
      complete:function(res){
        this_.setData({isLoading:false});
      },
    })
  },
  add_btn_click(e){
    var this_=this;
    this.setData({
      feeInfo:this_.data.defaultFeeInfo,
      isOpenModal:true
    });
  },
  editFee(e){
    var index=e.currentTarget.dataset.index;
    var this_=this;
    var feeTemp=this_.data.feeList[index];
    if(feeTemp.DayHighPrice>0)feeTemp.isDayMax=true;
    if(feeTemp.NightPrice>0)feeTemp.isNightMax=true;
    if(feeTemp.NightStepPrice>0)feeTemp.isNightStep=true;
    if(feeTemp.MonthPrice>0)feeTemp.isMonth=true;
    if(feeTemp.QuarterPrice>0)feeTemp.isQuarter=true;
    if(feeTemp.HalfYearPrice>0)feeTemp.isHalfYear=true;
    if(feeTemp.YearPrice>0)feeTemp.isYear=true;
    this.setData({
      feeInfo:feeTemp,
      isOpenModal:true
    });
  },
  deleteFee(e){
    var index=e.currentTarget.dataset.index;
    this.setData({delIndex:index});
  },
  hideConfirmDelModal(e){
    this.setData({delIndex:-1});
  },
  closeModal(e){
    this.setData({isOpenModal:false});
  },
  getFeeList(e){
    var this_=this;
    this_.setData({isLoading:true});
    wx.request({
      url: app.HOST+app.URLS.fee_strategy,
      header:app.requestHeader,
      method:"GET",
      success:function(res){
        console.log(res);
        if(res.data.Code=="success"){
          this_.data.feeList=res.data.Result;
          this_.setData({feeList:this_.data.feeList});
        }else{
          wx.showModal({
            title: '获取收费策略异常',
            content: res.data.Message,
            showCancel:false
          })
        }
      },
      fail:function(e){
        wx.showToast({
          title: '连接服务器异常',
          image:'/images/error.png'
        });
      },
      complete:function(res){
        this_.setData({isLoading:false});
        wx.stopPullDownRefresh();//停止下拉刷新
      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.feeList==null){
      this.getFeeList();
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getFeeList();
  },
})