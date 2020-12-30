//index.js
//获取应用实例
const app = getApp()
const { $Message } = require('../../dist/base/index');
Page({
  data: {
    plate:"",
    isInputing:false,
    isShowLoginModal:false,
    isLoading:false,
    paySuccess:false,
    historyPlates:[
    ]
  },
  //车牌键盘操作
  input(e){
    // console.log("inputPlate:"+e.detail.inputPlate);
    this.setData({plate:e.detail.inputPlate})
  },
  finish(e){
    // console.log("finishInputPlate:"+e.detail.inputPlate);
    this.setData({plate:e.detail.inputPlate})
    this.queryFee();
  },
  close(e){
    // console.log("closeInputPlate:"+e.detail.inputPlate);
    this.setData({isInputing:false});
  },
  openBoard(e){
    var keyBoard=this.selectComponent('#my-keyboard');
    keyBoard.openKeyboard(this.data.plate);
    this.setData({isInputing:true});
  },
  //历史记录快速输入
  fastInput(e){
    this.setData({
      plate:e.currentTarget.dataset.value
    })
  },
  //清除历史记录
  clearHistory(e){
    this.setData({
      historyPlates:null
    });
    wx.setStorage({
      key:'historyPlates',
      data:[]
    });
  },
  //添加历史车牌
  addHistoryPlate:function(plate){
    var newPlates=[];
    newPlates.push(plate);
    for(var i=0;i<this.data.historyPlates.length;i++){
      if(newPlates.length<5&&this.data.historyPlates[i]!=plate)newPlates.push(this.data.historyPlates[i]);
    }
    wx.setStorage({
      key:'historyPlates',
      data:newPlates
    });
    this.setData({
      historyPlates:newPlates,
    });
  },
  //读取历史车牌
  getHistoryPlate:function(e){
    var this_=this;
    wx.getStorage({
      key: 'historyPlates',
      success:function(res){
        this_.setData({
          historyPlates:res.data,
        });
      }
    })
  },
  //登录弹窗关闭
  hideShowLoginModal(e){
    this.setData({isShowLoginModal:false});
  },
  //进行登录
  loginUser(e){
    app.login();
    this.setData({isShowLoginModal:false});
  },
  //查询车费按钮
  queryFee(e){
    if(app.isLogin){
      if(this.data.plate.length<7){
        $Message({
          content: '输入完整车牌',
          type: 'warning'
        });
        this.openBoard();
      }else if(this.data.plate.length>8){
        $Message({
          content: '输入车牌过长',
          type: 'warning'
        });
        this.openBoard();
      }else{
        //开始查询费用
        this.queryPark();
        this.addHistoryPlate(this.data.plate);
      }
    }else{
      this.setData({isShowLoginModal:true});
    }
  },
  //查询车牌费用
  queryPayInfo(plate,parkId,parkName){
    var this_=this;
    this_.setData({isLoading:true});
    wx.request({
      url: app.HOST+app.URLS.prepay,
      header:app.requestHeader,
      data:{'Plate':plate,"ParkID":parkId},
      method:"GET",
      success:res=>{
        console.log(res);
        if(res.data.Code=="success"){
          if(res.data.Result.Price==0){
            $Message({
              content: '无需缴费，请直接通行',
              type: 'success',
              duration:3
            });
          }else{
            wx.navigateTo({
              url: '../pay_info/pay_info?plate='+ plate+'&parkName='+parkName+'&parkId='+parkId,
              events:{
                paySuccess:function(e){
                  this_.setData({
                    paySuccess:true
                  })
                }
              }
            });
          }
        }else{
          $Message({
            content: res.data.Message,
            type: 'warning'
          });
        }
      },
      fail:err=>{
        $Message({
          content: '连接服务器异常',
          type: 'error'
        });
      },
      complete:e=>{
        this_.setData({isLoading:false});
      }
    })
  },
  //查询车牌历史车场记录
  queryPark(e){
    var this_=this;
    this_.setData({isLoading:true});
    wx.request({
      url: app.HOST+app.URLS.query_park,
      header: app.requestHeader,
      data:{Plate:this_.data.plate},
      success:function(res){
        console.log(res);
        if(res.data.Code=="success"){
          if(res.data.Result.IOs.length>0&&res.data.Result.IOs[0].Direction=='进'){
            this_.queryPayInfo(this_.data.plate,res.data.Result.IOs[0].ParkID,res.data.Result.IOs[0].ParkName);
          }else{
            $Message({
              content: '未查询到 '+this_.data.plate+' 的入场信息',
              type: 'warning'
            });
          }
        }else{
          $Message({
            content: res.data.Message,
            type: 'warning'
          });
        }
      },
      fail:function(err){
        console.log(err);
        $Message({
          content: '连接服务器异常',
          type: 'error'
        });
      },
      complete:function(e){
        this_.setData({isLoading:false});
      }
    })
  },
  //前往办理月卡
  goBuyVip(e){
    if(app.isLogin){
      wx.switchTab({
        url: '/pages/rent/rent',
      })
    }else{
      this.setData({isShowLoginModal:true});
    }
  },
  //前往个人中心
  goUser(e){
    if(app.isLogin){
      wx.switchTab({
        url: '/pages/user/user',
      })
    }else{
      this.setData({isShowLoginModal:true});
    }
  },
  //监听页面监听页面加载
  onLoad:function(options){
    this.openBoard();
    this.getHistoryPlate();
  },
  //页面显示
  onShow:function(){
    if(this.data.paySuccess){
      $Message({
        content: '支付成功，请尽快离场',
        type: 'success',
        duration:3
      });
      this.setData({paySuccess:false})
    }
  }
})
