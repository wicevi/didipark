// pages/menupages/blacklist_manage/blacklist_manage.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blacklist:[],
    is_edit:false,
    isLoading:false,
    plate:"",
  },
  openInputView(e){
    var inputView=this.selectComponent('#my-plate-input');
    inputView.showInput(this.data.plate);
  },
  confirm(e){
    this.setData({
      plate:e.detail.inputPlate,
    });
    this.addBlackList(this.data.plate);
  },
  del_btn_click:function(e){
    var index=e.currentTarget.dataset.index;
    var this_=this;
    // console.log(index);
    wx.showModal({
      title:"确认删除",
      content:"请确认将 "+this_.data.blacklist[index]+" 车辆从黑名单列表里删除？",
      success:function(res){
        if(res.confirm){
          this_.delBlackList(index);
        }
      }
    });
  },
  add_btn_click:function(e){
    this.openInputView();
  },
  edit_btn_click:function(e){
    var this_=this;
    this.setData({
      is_edit:!this_.data.is_edit
    })
  },
  //获取黑名单列表
  getBlackList:function(){
    var this_=this;
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      wx.request({
        url: app.HOST+app.URLS.query_black,
        header:app.requestHeader,
        method:"GET",
        data:{ParkID:app.globalData.parkList[app.globalData.parkIndex].ID},
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.data.blacklist=res.data.Result.Black;
          }else{
            wx.showModal({
              title: '加载失败',
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
            blacklist:this_.data.blacklist,
            isLoading:false,
          });
          wx.stopPullDownRefresh();
        }
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
      wx.stopPullDownRefresh();
    }
  },
  //添加黑名单
  addBlackList:function(plate){
    var this_=this;
    var data_={
      ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,
      Plates:JSON.stringify([plate]),
    };
    // console.log(data_);
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      wx.request({
        url: app.HOST+app.URLS.add_black,
        header:app.requestHeader,
        method:"POST",
        data:data_,
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            wx.showToast({
              title: '添加成功',
              image:'/images/success.png'
            });
            this_.data.blacklist.push(plate);
          }else{
            wx.showModal({
              title: '添加失败',
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
            blacklist:this_.data.blacklist,
            isLoading:false,
          });
        }
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
    }
  },
  //删除黑名单
  delBlackList:function(index){
    var this_=this;
    var data_={
      ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,
      Plates:JSON.stringify([this_.data.blacklist[index]]),
    };
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      wx.request({
        url: app.HOST+app.URLS.del_black,
        header:app.requestHeader,
        method:"POST",
        data:data_,
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            wx.showToast({
              title: '删除成功',
              image:'/images/success.png'
            });
            this_.data.blacklist.splice(index, 1);
          }else{
            wx.showModal({
              title: '删除失败',
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
            blacklist:this_.data.blacklist,
            isLoading:false,
          });
        }
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
    if(this.data.blacklist==null||this.data.blacklist.length==0){
      this.getBlackList();
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getBlackList();
  },

})