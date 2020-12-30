// pages/vip_manage/vip_manage.js
const app = getApp();
const { $Message } = require('../../dist/base/index');
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    plate:"",
    isLoading:false,
    parkList:null,
    nowDate:util.getDate()
  },
  openInputView(e){
    var keyBoard=this.selectComponent('#plate-input');
    keyBoard.showInput(this.data.plate);
  },
  confirm(e){
    this.setData({
      plate:e.detail.inputPlate,
    });
    this.queryVipInfo();
  },
  //续费VIP
  buyVip(e){
    app.globalData.plate=this.data.plate;
    app.globalData.isBreakPlate=true;
    wx.switchTab({
      url: '/pages/rent/rent',
    })
  },
  //获取车牌VIP信息
  queryVipInfo(e){
    var this_=this;
    if(this.data.plate.length<7){
      $Message({
        content: '输入完整车牌',
        type: 'warning'
      });
    }else if(this.data.plate.length>8){
      $Message({
        content: '输入车牌过长',
        type: 'warning'
      });
    }else{
      //开始查询VIP信息
      this_.setData({isLoading:true});
      this_.data.parkList=[];
      wx.request({
        url: app.HOST+app.URLS.query_vip,
        header:app.requestHeader,
        data:{
          Plate:this_.data.plate,
        },
        success(res){
          console.log(res);
          if(res.data.Code=="success"){
            for(var i=0;i<res.data.Result.length;i++){
              if(res.data.Result[i].VipTime){
                this_.data.parkList.push(res.data.Result[i]);
              }
            }
          }else{
            $Message({
              content: res.data.Message,
              type: 'warning'
            });
          }
        },
        fail(err){
          $Message({
            content: '连接服务器异常',
            type: 'error'
          });
        },
        complete(res){
          this_.setData({
            isLoading:false,
            parkList:this_.data.parkList,
          });
        }
      })
    }
  },
})