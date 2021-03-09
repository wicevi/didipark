// components/car_plate_input/car_plate_input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    limit:{
      type:Number,
      value:1,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    plate:"",
    isInputing:false,
    isShow:false,
    isPaste:false,
    // historyPlates:[
    // ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //显示粘贴
    openPaste(e){
      this.setData({isPaste:true});
    },
    //关闭粘贴
    closePaste(e){
      this.setData({isPaste:false});
    },
    //粘贴车牌
    pastePlate(e){
      var this_=this;
      wx.getClipboardData({
        success: (option) => {
          this_.showInput(option.data);
        },
      });
      this.closePaste();
    },
    //显示组件
    showInput(plate){
      this.setData({
        plate:plate,
        isShow:true,
      });
      // this.getHistoryPlate();
      this.openBoard();
    },
    //隐藏组件
    hideInput(e){
      this.setData({
        plate:"",
        isShow:false,
      });
    },
    //确认按键
    confirmPlate(e){
      if(this.data.plate.length<7&&this.data.limit==1){
        wx.showToast({
          title: '输入完整车牌',
          image: '/images/tip.png'
        })
      }else if(this.data.plate.length>8&&this.data.limit==1){
        wx.showToast({
          title: '输入车牌过长',
          image: '/images/tip.png'
        })
      }else{
        this.triggerEvent('confirm',{inputPlate:this.data.plate});
        this.hideInput();
      }
    },
    //车牌键盘操作
    input(e){
      // console.log("inputPlate:"+e.detail.inputPlate);
      this.setData({plate:e.detail.inputPlate});
    },
    finish(e){
      // console.log("finishInputPlate:"+e.detail.inputPlate);
      this.setData({plate:e.detail.inputPlate})
      this.confirmPlate();
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
    //历史记录快速输入
    fastInput(e){
      this.setData({
        plate:e.currentTarget.dataset.value
      })
    },
    //读取历史车牌
    // getHistoryPlate:function(e){
    //   var this_=this;
    //   wx.getStorage({
    //     key: 'historyPlates',
    //     success:function(res){
    //       this_.setData({
    //         historyPlates:res.data,
    //       });
    //     }
    //   })
    // },
  }
})
