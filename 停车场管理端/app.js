//app.js
App({
  isLogin:false,//全局登录状态
  HOST:"https://shuzhi.xyz",
  requestHeader:{'content-type': 'application/x-www-form-urlencoded'},//请求头
  URLS:{
    login:"/app/login",
    query_parks:"/app/config/parks/query",
    query_report:"/app/park/income/query",
    query_point:"/app/config/point/query",
    query_parksets:"/app/config/park/query",
    change_parkset:"/app/config/park/mod",
    change_password:"/app/config/user/pw/mod",
    opengate:"/app/config/point/opengate",
    closegate:"/app/config/point/closegate",
    snapimage:"/app/config/point/snapimage",
    query_inorders:"/app/park/present/query",
    query_outorders:"/app/park/leave/query",
    query_vipcars:"/app/config/vip/query",
    delete_vipcar:"/app/config/vip/del",
    add_vipcar:"/app/config/vip/add",
    query_black:"/app/config/black/query",
    add_black:"/app/config/black/add",
    del_black:"/app/config/black/del",
    del_order:"/app/park/present/del",
  },
  onLaunch: function () {
    //获取导航栏相关
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    });
  },
  globalData: {
    parkList:[],
    parkIndex:999,
    userInfo:{
      userName:'null',
      userGroup:'null'
    }
  }
})