// pages/menupages/vip_manage/vip_manage.js
//获取应用实例
const app = getApp();
var util = require("../../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //月卡车辆列表
    vipCars: null,
    vipCar_Index:0,
    //VIP类型
    vipType:[
      "自定义模式",
      "包月模式",
      "包季模式",
      "包半年模式",
      "包整年模式"
    ],
    vipSelect:0,
    startDate:util.getDate(),//生效日期
    expireDate:null,//到期日期
    vipPlate:"",
    owner:"",
    phone:"",
    //当前日期时间截
    nowDate:util.getDate(),
    //搜索输入的车牌
    searchPlate:"",
    //弹窗变量
    confirmDeleteModal:false,
    addModal:false,
    editModal:false,
    //加载进度
    isLoading:false,
  },
  //关闭确认窗口
  hideConfirmDeleteModal(e){
    this.setData({confirmDeleteModal:false});
  },
  //关闭添加或编辑窗口
  hideModal(e){
    this.setData({
      addModal:false,
      editModal:false
    });
  },
  //添加VIP车牌输入
  inputVipPlate(e){
    this.setData({vipPlate:e.detail.value});
  },
  //车主输入
  inputOwner(e){
    this.setData({owner:e.detail.value});
  },
  //联系电话输入
  inputPhone(e){
    this.setData({phone:e.detail.value});
  },
  //车牌输入事件
  inputPlate(e){
    this.setData({searchPlate:e.detail.value});
  },
  //清空车牌
  clearPlate(e){
    this.setData({searchPlate:""});
  },
  //模式选择事件
  vipChange(e){
    var this_=this;
    var expireDate_=e.detail.value==0?this_.data.expireDate:util.addDate(this_.data.startDate,e.detail.value==1?1:e.detail.value==2?3:e.detail.value==3?6:12);
    this.setData({
      vipSelect:e.detail.value,
      expireDate:expireDate_
    });
  },
  //生效日期选择
  startDateChange(e){
    var this_=this;
    var expireDate_=this_.data.vipSelect==0?this_.data.expireDate:util.addDate(e.detail.value,this_.data.vipSelect==1?1:this_.data.vipSelect==2?3:this_.data.vipSelect==3?6:12);
    this.setData({
      startDate:e.detail.value,
      expireDate:expireDate_,
    });
  },
  //失效日期选择
  expireDateChange(e){
    this.setData({
      vipSelect:0,
      expireDate:e.detail.value,
    });
  },
  //添加按钮
  addVip(e){
    this.setData({
      vipSelect:1,
      startDate:util.getDate(),
      expireDate:util.addDate(util.getDate(),1),
      vipPlate:"",
      owner:"",
      phone:"",
      addModal:true
    });
  },
  //编辑按钮
  editVip(e){
    var car_index=e.currentTarget.dataset.index;
    var this_=this;
    this.setData({
      vipCar_Index:car_index,
      vipSelect:this_.data.vipCars[car_index].VipType,
      startDate:this_.data.vipCars[car_index].StartTime,
      expireDate:this_.data.vipCars[car_index].ExpireTime,
      vipPlate:this_.data.vipCars[car_index].Plate,
      owner:this_.data.vipCars[car_index].Owner,
      phone:this_.data.vipCars[car_index].Phone,
      editModal:true
    });
  },
  //删除按钮
  deleteVip(e){
    this.setData({
      vipCar_Index:e.currentTarget.dataset.index,
      confirmDeleteModal:true
    });
  },
  //搜索车牌月卡
  searchVipCar(e){
    if(this.data.searchPlate.length<7){
      wx.showToast({
        title: '输入完整车牌',
        image:'/images/tip.png'
      })
    }else if(this.data.searchPlate.length>8){
      wx.showToast({
        title: '输入车牌过长',
        image:'/images/tip.png'
      })
    }else{
      this.updateVipCars();
    }
  },
  //添加月卡信息
  addVipCar(e){
    var this_=this;
    var data_={
      ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,
      Plate:this_.data.vipPlate,
      StartTime:this_.data.startDate,
      Owner:this_.data.owner,
      Phone:this_.data.phone,
    };
    if(this_.data.vipSelect==0)data_.ExpireTime=this_.data.expireDate;
    else data_.VipType=this_.data.vipSelect;
    console.log(data_);
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      wx.request({
        url: app.HOST+app.URLS.add_vipcar,
        header:app.requestHeader,
        data:data_,
        method:"POST",
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            data_.VipType=this_.data.vipSelect;
            data_.ExpireTime=this_.data.expireDate;
            if(this_.data.addModal){
              this_.data.vipCars.push(data_);
            }else{
              this_.data.vipCars[this_.data.vipCar_Index]=data_;
            }
            wx.showToast({
              title: this_.data.addModal?'添加':'修改'+'成功',
              image:'/images/success.png'
            })
          }else{
            wx.showModal({
              title: this_.data.addModal?'添加':'修改'+'月卡信息异常',
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
          this_.setData({
            isLoading:false,
            vipCars:this_.data.vipCars,
            addModal:false,
            editModal:false,
          });
        },
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
    }
  },
  //删除月卡信息
  deleteVipCar(e){
    var this_=this;
    var data_={
      ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,
      Plate:this_.data.vipCars[this_.data.vipCar_Index].Plate
    };
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({
        isLoading:true,
      });
      wx.request({
        url: app.HOST+app.URLS.delete_vipcar,
        header:app.requestHeader,
        data:data_,
        method:"POST",
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.data.vipCars.splice(this_.data.vipCar_Index,1);
            wx.showToast({
              title: '删除成功',
              image:'/images/success.png'
            })
          }else{
            wx.showModal({
              title: '删除月卡信息异常',
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
          this_.setData({
            isLoading:false,
            vipCars:this_.data.vipCars,
            confirmDeleteModal:false,
          });
        },
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
    }
  },
  //查询月卡车辆
  updateVipCars(e){
    var this_=this;
    var data_={
      ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,
      SortKey:"ExpireTime",
      SortType:"Asc"
    };
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      if(this.data.searchPlate.length==7||this.data.searchPlate.length==8){
        data_.Plate=this.data.searchPlate;
      }
      wx.request({
        url: app.HOST+app.URLS.query_vipcars,
        header:app.requestHeader,
        data:data_,
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.setData({vipCars:res.data.Result});
            wx.showToast({
              title: '加载成功',
              image:'/images/success.png'
            })
          }else{
            wx.showModal({
              title: '加载月卡信息异常',
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
          this_.setData({isLoading:false});
          wx.stopPullDownRefresh();//停止下拉刷新
        },
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.vipCars==null){
      this.updateVipCars();
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.clearPlate();
    this.updateVipCars();
  },
})