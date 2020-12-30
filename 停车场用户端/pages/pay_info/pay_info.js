// pages/pay_info/pay_info.js
const { $Message } = require('../../dist/base/index');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    plate:null,
    parkName:null,
    parkId:0,
    startTime:null,
    endTime:null,
    stayTime:null,
    price:0,
    isLoading:false,
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
    this.queryPayInfo(this.data.plate,this.data.parkId,this.data.parkName);
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
          this.setData({
            plate:plate,
            parkName:parkName,
            startTime:res.data.Result.StartTime,
            endTime:res.data.Result.EndTime,
            stayTime:res.data.Result.StayTime,
            price:res.data.Result.Price,
            parkId:parkId,
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
    if(this.data.price==0){
      $Message({
        content: '无需缴费，请直接通行',
        type: 'success',
        duration:3
      });
      return;
    }
    if(!this_.data.plate||!this_.data.parkId){
      $Message({
        content: '数据异常,请返回上一页面',
        type: 'error',
      });
      return;
    }
    this.setData({isLoading:true});
    wx.request({
      url: app.HOST+app.URLS.prepay,
      header:app.requestHeader,
      data:{"Plate":this_.data.plate,"ParkID":this_.data.parkId,"Price":this_.data.price},
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
              this_.data.eventChannel.emit("paySuccess",null);
              wx.navigateBack({
                delta: 0,
              })
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
    if(options.plate&&options.parkId&&options.parkName){
      this.setData({
        plate:options.plate,
        parkId:options.parkId,
        parkName:options.parkName,
      });
    }
  },
  //显示
  onShow:function(){
    this.updateData();
  }
})