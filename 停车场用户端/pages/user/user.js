// pages/user/user.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
  },
  //缴费记录
  payHistory(e){

  },
  //月卡管理
  vipManage(e){
    wx.navigateTo({
      url: '/pages/vip_manage/vip_manage',
    })
  },
  //优惠卷管理
  couponManage(e){
    wx.showToast({
      title: '暂无优惠卷',
      image:'/images/tip.png'
    })
  },
  //授权回调函数
  getUserInfo:function(){
    var this_=this;
    wx.getSetting({// 获取用户信息
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this_.setData({
                userInfo:res.userInfo,
              });
            }
          })
        }
      }
    })
  },
  //回到缴费离场页面
  goPrePay(e){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //前往办理月卡
  goBuyVip(e){
    wx.switchTab({
      url: '/pages/rent/rent',
    })
  },
  //初次加载函数
  onLoad:function(options){
    this.getUserInfo();
  }
})