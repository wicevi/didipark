//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    //自定义顶部导航栏相关
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    //底部导航栏相关
    PageCur: 'home',
    //home页报表数据
    reportData:{
      data:null,
      isLoad:false,
      isOperator:false,
      err_info:""
    },
    //control页数据
    controlData:{
      cameraList:[],
      cameraPic:null,
      parkSet:null,
      outMode_Str:['免费放行','最低收费','人工确认'],
      outMode_Value:['free','minprice','manual'],
      NoPlate_OutMode_index:0,
      Plate_NoIn_OutMode_index:0,
      Round_Price_Str:['不取整','向上0.5元取整','向下0.5元取整','向上一元取整','向下一元取整','四舍五入取整'],
      Round_Price:0,
      isOperator:false,
      isControling:false
    },
    //user页数据
    userData:{
      userInfo:app.globalData.userInfo,
      parkList: app.globalData.parkList,
      parkIndex: app.globalData.parkIndex,
    },
    //是否登录成功返回
    loginSuccess:false,
  },
  //车场切换事件
  parkChange(parkIndex) {
    var this_=this;
    app.globalData.parkIndex = parkIndex;
    this_.setData({
      userData: app.globalData
    });
    //开始加载新数据
    this_.updateReportData();
    this_.queryControlData();
    //存储最新选择的车场索引
    wx.setStorage({
      data: parkIndex,
      key: 'ParkIndex',
    });
    //停止下拉刷新
    wx.stopPullDownRefresh();
  },
  //底部标签点击事件
  navChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  //更新本日报表事件
  updateReportData(e) {
    var this_=this;
    if(app.globalData.userInfo.userGroup=='operator'){
      this_.data.reportData.isOperator=true;
      this_.data.reportData.data=null;
      this.setData({reportData:this_.data.reportData});
      wx.stopPullDownRefresh();
      return;
    }else{
      this_.data.reportData.isOperator=false;
    }
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.data.reportData.isLoad=true;
      this_.data.reportData.data=null;
      this_.setData({
        reportData:this_.data.reportData
      })
      wx.request({
        url: app.HOST+app.URLS.query_report,
        header:app.requestHeader,
        data:{
          ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,
          StartTime:util.getDate(),
          Unit:"day"
        },
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.data.reportData.data=res.data.Result[0];
          }else{
            this_.data.reportData.err_info=res.data.Message;
          }
        },
        fail:function(e){
          this_.data.reportData.err_info='连接服务器异常';
          wx.showToast({
            title: '连接服务器异常',
            image:'/images/error.png'
          })
        },
        complete:function(res){
          this_.data.reportData.isLoad=false;
          this_.setData({
            reportData:this_.data.reportData
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
  //获取控制界面数据
  queryControlData(e){
    var this_=this;
    var data_={ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,};
    if(app.globalData.parkList&&app.globalData.parkIndex<app. globalData.parkList.length){
      this_.data.controlData.isControling=true;
      this_.setData({controlData:this_.data.controlData});
      //获取摄像头列表
      wx.request({
        url: app.HOST+app.URLS.query_point,
        header:app.requestHeader,
        data:data_,
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.data.controlData.cameraList=res.data.Result;
            if(app.globalData.userInfo.userGroup=='operator'){
              this_.data.controlData.isOperator=true;
              this_.data.controlData.isControling=false;
              this_.data.controlData.parkSet=null;
              this_.setData({controlData:this_.data.controlData});
              wx.stopPullDownRefresh();
              return;
            }else{
              this_.data.controlData.isOperator=false;
              //获取车场配置
              wx.request({
                url: app.HOST+app.URLS.query_parksets,
                header:app.requestHeader,
                data:data_,
                success:function(res){
                  console.log(res);
                  if(res.data.Code=="success"){
                    this_.data.controlData.parkSet=res.data.Result;
                    if(this_.data.controlData.parkSet.NoPlate_OutMode=="minprice")this_.data.controlData.NoPlate_OutMode_index=1;
                    else if(this_.data.controlData.parkSet.NoPlate_OutMode=="manual")this_.data.controlData.NoPlate_OutMode_index=2;
                    else this_.data.controlData.NoPlate_OutMode_index=0;
                    if(this_.data.controlData.parkSet.Plate_NoIn_OutMode=="minprice")this_.data.controlData.Plate_NoIn_OutMode_index=1;
                    else if(this_.data.controlData.parkSet.Plate_NoIn_OutMode=="manual")this_.data.controlData.Plate_NoIn_OutMode_index=2;
                    else this_.data.controlData.Plate_NoIn_OutMode_index=0;
                    wx.showToast({
                      title: '获取数据成功',
                      image:'/images/success.png'
                    })
                  }else{
                    wx.showModal({
                      title: '获取数据失败',
                      content: res.data.Message,
                      showCancel:false
                    })
                  }
                },
                fail:function(e){
                  wx.showToast({
                    title: '连接服务器异常',
                    image:'/images/error.png'
                  })
                },
                complete:function(res){
                  this_.data.controlData.isControling=false;
                  this_.setData({controlData:this_.data.controlData});
                  //停止下拉刷新
                  wx.stopPullDownRefresh();
                }
              })
            }
          }else{
            wx.showModal({
              title: '获取数据失败',
              content: res.data.Message,
              showCancel:false
            })
            this_.data.controlData.isControling=false;
            this_.setData({controlData:this_.data.controlData});
            //停止下拉刷新
            wx.stopPullDownRefresh();
          }
        },
        fail:function(e){
          wx.showToast({
            title: '连接服务器异常',
            image:'/images/error.png'
          })
          this_.data.controlData.isControling=false;
          this_.setData({controlData:this_.data.controlData});
          //停止下拉刷新
          wx.stopPullDownRefresh();
        },
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
    }
  },
  //控制道闸
  controlDaozha(isopen,pointID){
    var this_=this;
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.data.controlData.isControling=true;
      this_.setData({controlData:this_.data.controlData});
      wx.request({
        url: app.HOST+(isopen?app.URLS.opengate:app.URLS.closegate),
        method:"POST",
        header:app.requestHeader,
        data:{
          ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,
          PointID:pointID
        },
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            wx.showToast({
              title: '控制道闸成功',
              image:'/images/success.png'
            })
          }else{
            wx.showModal({
              title: '控制道闸失败',
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
          this_.data.controlData.isControling=false;
          this_.setData({
            controlData:this_.data.controlData
          })
        }
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
    }
  },
  //车场配置改变
  changeParkSet(paramName,paramValue){
    var this_=this;
    var data_={
      ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,
    }
    data_[paramName]=paramValue;
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.data.controlData.isControling=true;
      this_.data.controlData.parkSet[paramName]=paramValue;
      this_.setData({controlData:this_.data.controlData});
      wx.request({
        url: app.HOST+app.URLS.change_parkset,
        header:app.requestHeader,
        method:"POST",
        data:data_,
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.data.controlData.parkSet[paramName]=paramValue;
            if(this_.data.controlData.parkSet.NoPlate_OutMode=="minprice")this_.data.controlData.NoPlate_OutMode_index=1;
            else if(this_.data.controlData.parkSet.NoPlate_OutMode=="manual")this_.data.controlData.NoPlate_OutMode_index=2;
            else this_.data.controlData.NoPlate_OutMode_index=0;
            if(this_.data.controlData.parkSet.Plate_NoIn_OutMode=="minprice")this_.data.controlData.Plate_NoIn_OutMode_index=1;
            else if(this_.data.controlData.parkSet.Plate_NoIn_OutMode=="manual")this_.data.controlData.Plate_NoIn_OutMode_index=2;
            else this_.data.controlData.Plate_NoIn_OutMode_index=0;
            wx.showToast({
              title: '更改设置成功',
              image:'/images/success.png'
            })
          }else{
            wx.showModal({
              title: '更改设置失败',
              content: res.data.Message,
              showCancel:false
            })
          }
        },
        fail:function(e){
          wx.showToast({
            title: '连接服务器异常',
            image:'/images/error.png'
          })
        },
        complete:function(res){
          this_.data.controlData.isControling=false;
          this_.setData({
            controlData:this_.data.controlData
          })
        }
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
    }
  },
  //摄像头抓拍
  capturePic(pointID){
    var this_=this;
    var data_={
      ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,
      PointID:pointID,
    }
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.data.controlData.isControling=true;
      this_.setData({controlData:this_.data.controlData});
      wx.request({
        url: app.HOST+app.URLS.snapimage,
        header:app.requestHeader,
        method:"POST",
        data:data_,
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.data.controlData.cameraPic=res.data.Result.Image;
            wx.showToast({
              title: '抓拍成功',
              image:'/images/success.png'
            })
          }else{
            wx.showModal({
              title: '抓拍失败',
              content: res.data.Message,
              showCancel:false
            })
          }
        },
        fail:function(e){
          wx.showToast({
            title: '连接服务器异常',
            image:'/images/error.png'
          })
        },
        complete:function(res){
          this_.data.controlData.isControling=false;
          this_.setData({
            controlData:this_.data.controlData
          })
        }
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
    }
  },
  //无牌车出场方式选择事件
  NoPlateOutModeChange(e){
    if(this.data.controlData.NoPlate_OutMode_index==e.detail.NoPlate_OutMode_index)return;
    this.data.controlData.NoPlate_OutMode_index=e.detail.NoPlate_OutMode_index;
    this.setData({
      controlData: this.data.controlData
    });
    this.changeParkSet('NoPlate_OutMode',this.data.controlData.outMode_Value[this.data.controlData.NoPlate_OutMode_index]);
  },
  //无入场记录车牌出场
  PlateNoInOutModeChange(e){
    if(this.data.controlData.Plate_NoIn_OutMode_index==e.detail.Plate_NoIn_OutMode_index)return;
    this.data.controlData.Plate_NoIn_OutMode_index=e.detail.Plate_NoIn_OutMode_index;
    this.setData({
      controlData: this.data.controlData
    });
    this.changeParkSet('Plate_NoIn_OutMode',this.data.controlData.outMode_Value[this.data.controlData.Plate_NoIn_OutMode_index]);
  },
  //收费取整方式
  RoundPriceChange(e){
    if(this.data.controlData.parkSet.Round_Price==e.detail.Round_Price)return;
    this.data.controlData.parkSet.Round_Price=e.detail.Round_Price;
    this.setData({
      controlData: this.data.controlData
    });
    this.changeParkSet('Round_Price',this.data.controlData.parkSet.Round_Price);
  },
  //控制事件
  controlEvent(e){
    var type_=e.detail.type;
    var value_=e.detail.value;
    var this_=this;
    console.log("controlEvent[type:"+type_+" value:"+value_+"]");
    switch(type_){
      case 'open':
        this_.controlDaozha(true,value_);
      break;
      case 'close':
        this_.controlDaozha(false,value_);
      break;
      case 'camera':
        this_.capturePic(value_);
      break;
      default:
        this_.changeParkSet(type_,value_);
      break;
    }
  },
  //跳转到登录界面
  goLogin(param){
    var this_=this;
    wx.navigateTo({
      url: '/pages/login/login?'+param,
      events:{
        loginSuccess:function(e){
          this_.setData({
            loginSuccess:true
          })
        }
      }
    })
  },
  //更改密码成功
  changepwSuccess(e){
    var this_=this;
    wx.removeStorage({
      key: 'Appsession',
      complete:function(e){
        wx.removeStorage({
          key: 'ParkIndex',
        })
        app.requestHeader.Appsession=null;
        app.isLogin=false;
      }
    })
    this_.goLogin('tip=更改密码成功');
  },
  //用户界面菜单点击事件
  userMenuEvent(e){
    var type_=e.detail.type;
    var value_=e.detail.value;
    console.log("userMenuEvent[type:"+type_+" value:"+value_+"]");
    switch(type_){
      case 'confirmLogout':
        wx.removeStorage({key: 'Appsession'});
        wx.removeStorage({key: 'ParkIndex'});
        app.requestHeader.Appsession=null;
        app.isLogin=false;
        this.goLogin('tip=退出成功');
      break;
      case 'changepwOk':
        this.changepwSuccess();
      break;
      case 'changeparkOk':
        this.parkChange(value_);
      break;
    }
  },
  //下拉刷新事件
  onPullDownRefresh: function () {
    //调用刷新时将执行的方法
    if(this.data.PageCur=='control')this.queryControlData();
    else if(this.data.PageCur=='home')this.updateReportData();
    else this.parkChange(app.globalData.parkIndex);
  },
  //切到前台显示事件
  onShow:function(){
    var this_=this;
    if(this.data.loginSuccess&&app.isLogin){//若登录成功开始加载数据
      wx.showToast({
        title: '登录成功',
        image: '/images/success.png'
      })
      this_.setData({loginSuccess:false})
      wx.getStorage({
        key: 'ParkIndex',
        success:function(res){
          if(res.data<app.globalData.parkList.length)app.globalData.parkIndex=res.data;
          else app.globalData.parkIndex=0;
        },
        fail:function(res){
          app.globalData.parkIndex=0;
        },
        complete:function(res){
          this_.parkChange(app.globalData.parkIndex);
        }
      })
    }
    if(!app.isLogin){
      //获取登录状态
      wx.getStorage({
        key: 'Appsession',
        success:function(e){
          console.log('StorageAppsession='+e.data);
          //如果有 尝试验证
          app.requestHeader.Appsession=e.data;
          this_.goLogin('isAppSession=ture');
        },
        fail:function(e){
          //没有
          this_.goLogin('tip=请先登录');
        }
      });
    }
    this.setData({
      reportData:this.data.reportData,
      controlData:this.data.controlData,
      userData:this.data.userData,
    });
  },
  onShareAppMessage(){

  },
})
