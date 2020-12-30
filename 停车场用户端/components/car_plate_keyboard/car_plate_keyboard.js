// components/car_plate_keyboard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    number_line:['京津渝沪冀晋辽吉黑苏','1234567890'],
    first_line:['浙皖闽赣鲁豫鄂湘粤琼','QWERTYUIOP'],
    second_line:['川贵云陕甘青蒙桂宁','ASDFGHJKL'],
    third_line:['@新藏     <','@ZXCVBNM<'],
    last_line:['#使领警学港澳$','#使领警学港澳$'],
    showType:0,
    isShowKeyboard:false,
    isEnableNumber:true,
    inputPlate:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /*
    *外部调用 
    this.plate_keyboard = this.selectComponent("#plate-keyboard"); //组件的id 
    this.plate_keyboard.closeKeyboard();
    this.plate_keyboard.openKeyboard(input_plate)
    */
    closeKeyboard(e){
      this.setData({isShowKeyboard:false});
      this.triggerEvent('close',{inputPlate:this.data.inputPlate});
    },
    openKeyboard(input_plate){
      this.setData({isShowKeyboard:true,inputPlate:input_plate});
      if(input_plate==null||input_plate.length==0)this.setData({showType:0});
      else this.setData({showType:1});
      if(input_plate&&input_plate.length==1)this.setData({isEnableNumber:false});
      else this.setData({isEnableNumber:true});
    },
    inputEvent(e){
      this.triggerEvent('input',{inputPlate:this.data.inputPlate});
      this.openKeyboard(this.data.inputPlate);
    },
    finishEvent(e){
      this.triggerEvent('finish',{inputPlate:this.data.inputPlate});
    },
    keyTap(e){
      var keyValue=e.currentTarget.dataset.value;
      // console.log("keyTap:"+keyValue);
      switch(keyValue){
        case ' '://无效按键
        break;
        case '@'://切换键盘
          var newType=1-this.data.showType;
          this.setData({showType:newType});
          break;
        case '<'://删除
          if(this.data.inputPlate&&this.data.inputPlate.length>0){
            this.data.inputPlate=this.data.inputPlate.substring(0,this.data.inputPlate.length-1);
            this.inputEvent();
          }
        break;
        case '$'://完成输入
          this.closeKeyboard();
          this.finishEvent();
        break;
        case '#'://清空输入
          this.setData({inputPlate:''});
          this.inputEvent();
        break;
        default:
          if(this.data.inputPlate==null)this.data.inputPlate='';
          this.data.inputPlate+=keyValue;
          this.inputEvent();
          break;
      }
    }
  }
})
