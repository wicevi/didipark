//app.js
App({
  isLogin:false,//全局登录状态
  HOST:"https://shuzhi.xyz",
  requestHeader:{'content-type': 'application/x-www-form-urlencoded'},//请求头
  URLS:{
    login:"/app/login",
    query_park:"/app/plate/history_park/query",
    query_vip:"/app/vip/query",
    build_vip:"/app/vip/order/build",
    prepay:"/app/io/order/prepay",
  },
  login:function(){
    var this_=this;
    wx.showLoading({
      title: '登录中...',
    })
    wx.login({
      success: res => {
        this.globalData.appCode=res.code;
        wx.request({
          url: this_.HOST+this_.URLS.login,
          data:{"AppCode":res.code},
          method:"GET",
          success:res=>{
            if(res.data.Code=="success"){
              this_.requestHeader.Appsession=res.header.Appsession;
              this_.isLogin=true;
              wx.showToast({
                title: '登录成功',
                image:'/images/success.png'
              })
            }else{
              console.log("login error:"+res.data.Message);
              wx.showToast({
                title: res.data.Message,
                image:'/images/error.png'
              })
            }
          },
          fail:err=>{
            console.log(err);
            wx.showToast({
              title: '连接服务器失败',
              image:'/images/error.png'
            })
          },
        })
      },
      fail: err => {
        console.log(err);
        wx.showToast({
          title: '微信登录失败',
          image:'/images/error.png'
        })
      }
    })
  },
  onLaunch: function () {
    //尝试登录
    this.login();
  },
  globalData: {
    appCode:null,
    plate:"",
    isBreakPlate:false,
  }
})