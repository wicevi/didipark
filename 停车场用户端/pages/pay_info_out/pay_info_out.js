// pages/pay_info/pay_info.js
const { $Message } = require('../../dist/base/index');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    plate:'',
    parkName:'',
    parkId:0,
    startTime:'----/--/--',
    endTime:'----/--/--',
    stayTime:'未知',
    price:0,
    order:null,
    options:null,
    isPaySuccess:false,
    isLoading:false,
    isShowLoginModal:false,
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
  //查看进场图片
  watchPic(e){
    $Message({
      content: '暂未开放',
      type: 'warning'
    });
  },
  //更新数据
  updateData(e){
    if(app.isLogin){
      this.queryPayInfo(this.data.options);
    }else{
      this.setData({isShowLoginModal:true});
    }
  },
  //查询车牌费用
  queryPayInfo(options){
    var this_=this;
    this_.setData({isLoading:true});
    wx.request({
      url: app.HOST+app.URLS.pointpay,
      header:app.requestHeader,
      data:options,
      method:"GET",
      success:res=>{
        console.log(res);
        if(res.data.Code=="success"){
          this.setData({
            plate:res.data.Result.Plate,
            parkName:res.data.Result.ParkName,
            parkId:res.data.Result.ParkID,
            startTime:res.data.Result.StartTime,
            endTime:res.data.Result.EndTime,
            stayTime:res.data.Result.StayTime,
            price:res.data.Result.Price,
            order:res.data.Result.Order,
          });
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
  //获取支付相关参数 并调取支付
  getPayData:function(){
    var this_=this;
    if(!app.isLogin){
      this.setData({isShowLoginModal:true});
    }
    this.setData({isLoading:true});
    wx.request({
      url: app.HOST+app.URLS.pointpay,
      header:app.requestHeader,
      data:{"OrderID":this_.data.order,"ParkID":this_.data.parkId},
      method:"POST",
      success:res=>{
        if(res.data.Code=="success"){
          console.log(res.data.Result);
          wx.requestPayment({//调起支付函数
            timeStamp: res.data.Result.TimeStamp,
            nonceStr: res.data.Result.NonceStr,
            package: res.data.Result.Package,
            signType:  res.data.Result.SignType,
            paySign: res.data.Result.PaySign,
            success (res) {//支付成功
              console.log('支付成功:'+JSON.stringify(res));
              this_.setData({isPaySuccess:true});
            },
            fail (res) {
              console.log('支付失败:'+JSON.stringify(res));
              $Message({
                content: '支付失败:'+JSON.stringify(res),
                type: 'error'
              });
            }
          })
        }else{
          $Message({
            content: res.data.Message,
            type: 'error',
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
        this.setData({isLoading:false});
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var this_=this;
    console.log(options);
    this.setData({options:options});
    var interval = setInterval(function () {  
      if(app.isLogin){
        this_.updateData();
        clearInterval(interval);
      }
      //需不断调用的操作
    }, 100)     //单位ms，会不断调用
  },
})