// pages/car_group/car_group.js
//获取应用实例
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //弹窗变量
    confirmDeleteModal:false,
    addModal:false,
    editModal:false,
    //加载进度
    isLoading:false,
    //是否编辑变量
    isEdit: false,
    carGroup: [],
    carGroupIndex: 0,
    carPlateIndex: 0,
    //车辆车牌
    carPlate: null,
    owner:"",
    phone:"",
  },
  carGroupChange(e){
    var value=e.detail.value;
    this.setData({
      carGroupIndex: value,
    });
  },
  add_btn_click(e){
    this.setData({
      carPlate: null,
      addModal: true,
    });
  },
  write_btn_click(e){
    this.setData({
      isEdit: true,
    });
  },
  close_write_btn_click(e){
    this.setData({
      isEdit: false,
    });
  },
  deleteCar(e){
    var index = e.currentTarget.dataset.index;
    console.log('deleteCar:'+index);
    this.setData({
      carPlateIndex: index,
      confirmDeleteModal: true,
    });
  },
  editCar(e){
    var index = e.currentTarget.dataset.index;
    console.log('editCar:'+index);
    var carPlate_ = this.data.carGroup[this.data.carGroupIndex].Plates[index].Plate;
    var owner_ = this.data.carGroup[this.data.carGroupIndex].Plates[index].Owner;
    var phone_ = this.data.carGroup[this.data.carGroupIndex].Plates[index].Phone;
    this.setData({
      carPlateIndex: index,
      carPlate: carPlate_,
      owner: owner_,
      phone: phone_,
      editModal: true,
    });
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
  //车主输入
  inputOwner(e){
    this.setData({owner:e.detail.value});
  },
  //联系电话输入
  inputPhone(e){
    this.setData({phone:e.detail.value});
  },
  openInputView_Car(e){
    var inputView=this.selectComponent('#my-plate-input-car');
    inputView.showInput(this.data.carPlate);
  },
  confirm_Car(e){
    this.setData({
      carPlate:e.detail.inputPlate,
    });
  },
  queryGroupCar(e){
    var this_=this;
    var data_={
      ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,
    };
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      wx.request({
        url: app.HOST+app.URLS.query_group,
        header:app.requestHeader,
        data:data_,
        method:"GET",
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.data.carGroup = res.data.Result;
          }else{
            wx.showModal({
              title: '查询车辆信息异常',
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
            carGroup:this_.data.carGroup,
          });
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
  addGroupCar(e){
    var this_=this;
    var data_={
      ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,
      Plate:this_.data.carPlate,
      Owner:this_.data.owner,
      Phone:this_.data.phone,
      PriceID:this_.data.carGroup[this_.data.carGroupIndex].PriceID,
    };
    console.log(data_);
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      wx.request({
        url: app.HOST+app.URLS.addplate_group,
        header:app.requestHeader,
        data:data_,
        method:"POST",
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            if(this_.data.addModal){
              this_.data.carGroup[this_.data.carGroupIndex].Plates.push(data_);
            }else{
              this_.data.carGroup[this_.data.carGroupIndex].Plates[this_.data.carPlateIndex]=data_;
            }
            wx.showToast({
              title: (this_.data.addModal?'添加':'修改')+'成功',
              image:'/images/success.png'
            });
            this_.setData({
              carGroup: this_.data.carGroup,
              addModal: false,
              editModal: false,
            });
          }else{
            wx.showModal({
              title: this_.data.addModal?'添加':'修改'+'车辆信息异常',
              content: res.data.Message,
              showCancel: false
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
  deleteGroupCar(e){
    var this_=this;
    var data_={
      ParkID: app.globalData.parkList[app.globalData.parkIndex].ID,
      Plate: this_.data.carGroup[this_.data.carGroupIndex].Plates[this_.data.carPlateIndex].Plate,
    };
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      wx.request({
        url: app.HOST+app.URLS.delplate_group,
        header: app.requestHeader,
        data: data_,
        method: "POST",
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.data.carGroup[this_.data.carGroupIndex].Plates.splice(this_.data.carGroupIndex,1);
            wx.showToast({
              title: '删除成功',
              image:'/images/success.png'
            }),
            this_.setData({
              confirmDeleteModal: false,
            })
          }else{
            wx.showModal({
              title: '删除车辆信息异常',
              content: res.data.Message,
              showCancel:false
            })
          }
        },
        fail:function(e){
          wx.showToast({
            title: '连接服务器异常',
            image:'/images/error.png'
          });
        },
        complete:function(res){
          this_.setData({
            isLoading:false,
            carGroup:this_.data.carGroup,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryGroupCar();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.queryGroupCar();
  },
})