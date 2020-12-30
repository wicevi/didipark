// pages/rent/rent.js
const app = getApp();
const { $Message } = require('../../dist/base/index');
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    plate:"",
    owner:"",
    phone:"",
    parkList:null,
    parkIndex:0,
    typeList:null,
    typeIndex:0,
    nowTime:util.getDate(),
    startTime:util.getDate(),
    endTime:"",
    price:0,
    isInputing:false,
    isLoading:false,
  },
  //车牌键盘操作
  input(e){
    // console.log("inputPlate:"+e.detail.inputPlate);
    this.setData({plate:e.detail.inputPlate});
    if(this.data.plate.length>6){
      this.queryVipInfo();
    }
  },
  finish(e){
    // console.log("finishInputPlate:"+e.detail.inputPlate);
    this.setData({plate:e.detail.inputPlate})
    this.queryVipInfo();
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
  closeBoard(e){
    var keyBoard=this.selectComponent('#my-keyboard');
    keyBoard.closeKeyboard(this.data.plate);
  },
  //车场改变
  changePark(e){
    this.selectPark(e.detail.value);
  },
  //切换车场
  selectPark(parkIndex){
    var typeList=[];
    if(this.data.parkList[parkIndex].MonthPrice){
      typeList.push({
        type:1,
        name:"包月模式",
        month:1,
        price:this.data.parkList[parkIndex].MonthPrice
      });
    }
    if(this.data.parkList[parkIndex].QuarterPrice){
      typeList.push({
        type:2,
        name:"包季模式",
        month:3,
        price:this.data.parkList[parkIndex].QuarterPrice
      });
    }
    if(this.data.parkList[parkIndex].HalfYearPrice){
      typeList.push({
        type:3,
        name:"包半年模式",
        month:6,
        price:this.data.parkList[parkIndex].HalfYearPrice
      });
    }
    if(this.data.parkList[parkIndex].YearPrice){
      typeList.push({
        type:4,
        name:"包整年模式",
        month:12,
        price:this.data.parkList[parkIndex].YearPrice
      });
    }
    this.setData({
      parkIndex:parkIndex,
      typeList:typeList,
    });
    this.selectType(0);
  },
  //判断到期时间是否已过
  isExpiration: function(nowDate,expireDate) { 
    if(nowDate==null||expireDate==null)return true;
    var nowDateStrs=nowDate.split("-"); 
    var expireDateStrs=expireDate.split("-"); 
    if(expireDateStrs[0]>nowDateStrs[0])return false;
    if(expireDateStrs[0]==nowDateStrs[0]&&expireDateStrs[1]>nowDateStrs[1])return false;
    if(expireDateStrs[0]==nowDateStrs[0]&&expireDateStrs[1]==nowDateStrs[1]&&expireDateStrs[2]>nowDateStrs[2])return false;
    return true;
  },
  //购买类型改变
  changeType(e){
    this.selectType(e.detail.value);
  },
  //切换购买类型
  selectType(typeIndex){
    var this_=this;
    if(this.data.parkList.length>0){
      var startTime = (this.data.parkList[this.data.parkIndex].VipTime)?this.data.parkList[this.data.parkIndex].VipTime.ExpireTime:this.data.startTime;
      this.setData({
        typeIndex:typeIndex,
        endTime:util.addDate(startTime,this_.data.typeList[typeIndex].month),
        price:this_.data.typeList[typeIndex].price
      });
    }else{
      this.setData({
        typeIndex:0,
        price:0
      });
    }
  },
  //开始时间改变
  changeStartTime(e){
    var this_=this;
    this.setData({
      startTime:e.detail.value,
      endTime:util.addDate(e.detail.value,this_.data.typeList[this_.data.typeIndex].month),
    });
  },
  //车主信息输入
  ownerInput(e){
    this.setData({
      owner:e.detail.value
    })
  },
  phoneInput(e){
    this.setData({
      phone:e.detail.value
    })
  },
  //处理获取到的信息
  dealVipInfo(parkList){
    if(parkList.length==0){
      $Message({
        content: '该车牌暂无法办理月卡,请联系我们',
        type: 'warning'
      });
      this.setData({price:0})
    }else{
      this.selectPark(0);
    }
  },
  //获取车牌VIP信息
  queryVipInfo(e){
    var this_=this;
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
            this_.data.parkList=res.data.Result;
            this_.dealVipInfo(res.data.Result);
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
  //创建VIP
  buidVip(e){
    var this_=this;
    var data_={
      Plate:this_.data.plate,
      ParkID:this_.data.parkList[this_.data.parkIndex].ParkID,
      VipType:this_.data.typeList[this_.data.typeIndex].type,
      StartTime:this_.isExpiration(this_.data.nowTime,this_.data.parkList[this_.data.parkIndex].VipTime?this_.data.parkList[this_.data.parkIndex].VipTime.ExpireTime:null)?this_.data.startTime:this_.data.parkList[this_.data.parkIndex].VipTime.ExpireTime,
      Owner:this_.data.owner,
      Phone:this_.data.phone
    };
    console.log(data_);
    this_.setData({isLoading:true});
    wx.request({
      url: app.HOST+app.URLS.build_vip,
      header:app.requestHeader,
      data:data_,
      method:"POST",
      success(res){
        console.log(res);
        if(res.data.Code=="success"){
          wx.requestPayment({//调起支付函数
            timeStamp: res.data.Result.TimeStamp,
            nonceStr: res.data.Result.NonceStr,
            package: res.data.Result.Package,
            signType:  res.data.Result.SignType,
            paySign: res.data.Result.PaySign,
            success (res) {//支付成功
              console.log('支付成功:'+JSON.stringify(res));
              wx.showToast({
                title: '支付成功',
                image: '/images/payok.png'
              })
              this_.queryVipInfo();
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
        this_.setData({isLoading:false});
      }
    })
  },
  buyVip:function(e){
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
      if(this.data.parkList&&this.data.parkList.length>0){
        if(this.data.typeList&&this.data.typeList.length>0){
          //开始调用办理
          this.buidVip();
        }else{
            $Message({
              content: '该车场暂不支持办理月卡',
              type: 'warning'
            });
        }
      }else{
        $Message({
          content: '该车牌暂无法办理月卡,请联系我们',
          type: 'warning'
        });
      }
    }
  },
  //回到缴费离场页面
  goPrePay(e){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //前往个人中心
  goUser(e){
    wx.switchTab({
      url: '/pages/user/user',
    })
  },
  // onLoad:function(options){
  //   if(options.plate){
  //     this.setData({plate:options.plate});
  //     this.queryVipInfo();
  //   }
  // }
  onShow:function(){
    if(app.globalData.isBreakPlate){
      app.globalData.isBreakPlate=false;
      this.setData({plate:app.globalData.plate});
      this.queryVipInfo();
    }
  }
})