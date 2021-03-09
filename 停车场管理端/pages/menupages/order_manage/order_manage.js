// pages/menupages/order_manage/order_manage.js
//获取应用实例
const app = getApp();
Page({
  data: {
    //订单数组
    orderList:null,
    orderIndex:0,
    //是否正在加载
    isLoading:false,
    //弹窗变量
    isOpenModal_info:false,
    confirmDelModal:false,
    confirmManualModal:false,
    //当前是在场订单界面还是离场订单
    PageCur: 'inOrder',
    //搜索输入的车牌
    searchPlate:"",
  },
  openInputView(e){
    var inputView=this.selectComponent('#my-plate-input');
    inputView.showInput(this.data.searchPlate);
  },
  confirm(e){
    this.setData({
      searchPlate:e.detail.inputPlate,
    });
    this.searchOrder();
  },
  search_btn_click(e){
    this.openInputView();
  },
  close_search_btn_click(e){
    this.clearPlate();
    this.loadOrder();
  },
  add_btn_click(e){
    wx.showToast({
      title: '暂未开放',
      image:'/images/tip.png'
    })
  },
  copyPlate(event){
    var plate=event.currentTarget.dataset.plate;
    wx.setClipboardData({
      data: plate,
    })
  },
  //弹窗相关
  showConfirmDelModal(e){
    this.setData({confirmDelModal:true,isOpenModal_info:false});
  },
  showConfirmManualModal(e){
    this.setData({confirmManualModal:true,isOpenModal_info:false});
  },
  hideConfirmDelModal(e){
    this.setData({confirmDelModal:false,isOpenModal_info:true});
  },
  hideConfirmManualModal(e){
    this.setData({confirmManualModal:false,isOpenModal_info:true});
  },
  //导航栏切换事件
  navChange(e) {
    var tap_cur=e.currentTarget.dataset.cur;
    if(this.data.PageCur!=tap_cur){
      this.setData({
        PageCur: e.currentTarget.dataset.cur
      })
      this.loadOrder();
      wx.setNavigationBarTitle({
        title: this.data.PageCur=='inOrder'?'在场订单':'离场订单',
      })
    }
  },
  //查看出入场图片
  viewImage(e){
    wx.previewImage({
      urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  },
  //点击订单事件
  tapOrder(e){
    console.log("orderManage[tapOrder:"+e.currentTarget.dataset.index+"]");
    this.setData({
      orderIndex: e.currentTarget.dataset.index
    });
    if(this.data.PageCur=="inOrder"){
      this.refreshPrice({isopen:true});
    }else{
      this.openModal_info();
    }
  },
  //开启订单详情弹窗
  openModal_info(e){
    this.setData({ isOpenModal_info: true });
  },
  //关闭订单详情弹窗
  closeModal_info(e){
    this.setData({ isOpenModal_info: false });
  },
   //下拉刷新事件
   onPullDownRefresh: function () {
    //调用刷新时将执行的方法
    this.loadOrder();
  },
  //搜索车牌订单
  searchOrder(e){
    // if(this.data.searchPlate.length<7){
    //   wx.showToast({
    //     title: '输入完整车牌',
    //     image:'/images/tip.png'
    //   })
    // }else if(this.data.searchPlate.length>8){
    //   wx.showToast({
    //     title: '输入车牌过长',
    //     image:'/images/tip.png'
    //   })
    // }else{
      this.loadOrder();
    // }
  },
  //清空车牌
  clearPlate(e){
    this.setData({searchPlate:""});
  },
  manualFinish:function(e){
    var this_=this;
    var index=this.data.orderIndex;
    this_.manualOrder(index);
  },
  finish:function(e){
    var this_=this;
    var index=this.data.orderIndex;
    this_.delOrder(index);
  },
  //获取订单金额
  refreshPrice:function(e){
    var this_=this;
    var ismanual=e.currentTarget?e.currentTarget.dataset.ismanual:null;
    var isopen=e.isopen;
    var data_={ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,InID:this_.data.orderList[this_.data.orderIndex].InID};
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      wx.request({
        url: app.HOST+app.URLS.manual,
        header:app.requestHeader,
        data:data_,
        method:"GET",
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.data.orderList[this_.data.orderIndex].Price=res.data.Result.Price;
            this_.setData({orderList:this_.data.orderList});
            if(isopen){
              this_.openModal_info();
            }else if(ismanual){
              this_.showConfirmManualModal();
            }
          }else{
            wx.showModal({
              title: '获取金额异常',
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
          this_.setData({isLoading:false});
        },
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
    }
  },
  //人工收费
  manualOrder:function(index){
    var this_=this;
    var data_={ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,InID:this_.data.orderList[index].InID};
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      wx.request({
        url: app.HOST+app.URLS.manual,
        header:app.requestHeader,
        data:data_,
        method:"POST",
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.data.orderList.splice(index, 1);
            this_.setData({orderList:this_.data.orderList,isOpenModal_info:false,confirmManualModal:false});
            wx.showToast({
              title: '确认成功',
              image:'/images/success.png'
            })
          }else{
            wx.showModal({
              title: '人工确认失败',
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
        },
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
    }
  },
  //结算订单
  delOrder:function(index){
    var this_=this;
    var data_={ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,InID:this_.data.orderList[index].InID};
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      wx.request({
        url: app.HOST+app.URLS.del_order,
        header:app.requestHeader,
        data:data_,
        method:"POST",
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.data.orderList.splice(index, 1);
            this_.setData({orderList:this_.data.orderList,isOpenModal_info:false,confirmDelModal:false});
            wx.showToast({
              title: '结算成功',
              image:'/images/success.png'
            })
          }else{
            wx.showModal({
              title: '结算订单失败',
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
        },
      })
    }else{
      wx.showToast({
        title: '车场异常',
        image:'/images/error.png'
      })
    }
  },
  //加载订单
  loadOrder:function(e){
    var this_=this;
    var url_;
    var data_={ParkID:app.globalData.parkList[app.globalData.parkIndex].ID,};
    if(app.globalData.parkList&&app.globalData.parkIndex<app.globalData.parkList.length){
      this_.setData({isLoading:true});
      if(this.data.PageCur=='outOrder')url_=app.URLS.query_outorders;
      else url_=app.URLS.query_inorders;
      // if(this.data.searchPlate.length==7||this.data.searchPlate.length==8){
        data_.Plate=this.data.searchPlate;
      // }
      wx.request({
        url: app.HOST+url_,
        header:app.requestHeader,
        data:data_,
        success:function(res){
          console.log(res);
          if(res.data.Code=="success"){
            this_.setData({orderList:res.data.Result.Plates});
            // wx.showToast({
            //   title: '加载成功',
            //   image:'/images/success.png'
            // })
          }else{
            wx.showModal({
              title: '加载订单异常',
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
  //切到前台
  onShow:function(){
    if(!this.data.orderList||this.data.orderList.length==0){
      this.loadOrder();
      wx.setNavigationBarTitle({
        title: this.data.PageCur=='inOrder'?'在场订单':'离场订单',
      })
    }else{
      this.setData({orderList:this.data.orderList});
    }
  }
})