// pages/user/user.js
const app = getApp();
Component({
  /**
   * 页面的初始数据
   */
  properties: {
    userData:{
      type:Object,
      value:null
    },
  },
  data: {
    isOpenModal_changepark:false,
    select_park_index:app.globalData.parkIndex,
    isOpenModal_logout:false,
    isOpenModal_changepw:false,
    old_pw:"",
    new_pw:"",
    err_info:null,
  },
  methods:{
    tapEvent(e){
      var type_=e.currentTarget.dataset.type;
      var value_=e.currentTarget.dataset.value;
      switch(type_){
        case 'changepw':
          this.setData({isOpenModal_changepw:true});
        break;
        case 'changepark':
          this.setData({
            isOpenModal_changepark:true, 
            select_park_index:app.globalData.parkIndex,
          });
        break;
        case 'logout':
          this.setData({isOpenModal_logout:true});
        break;
        default:
          this.triggerEvent("userMenuEvent", {
            type:type_,
            value:value_
          });
        break;
      }
    },
    closeModal_changepark(e){
      this.setData({isOpenModal_changepark:false});
    },
    selectPark(e){
      this.setData({select_park_index:e.currentTarget.dataset.value});
    },
    changePark(e){
      var this_=this;
      console.log("changePark:"+this_.data.select_park_index);
      this_.setData({isOpenModal_changepark:false,});
      this_.triggerEvent("userMenuEvent", {
        type:'changeparkOk',
        value:this_.data.select_park_index
      });
    },
    closeModal_logout(e){
      this.setData({isOpenModal_logout:false});
    },
    confirmLogout(e){
      this.setData({isOpenModal_logout:false,});
      this.triggerEvent("userMenuEvent", {
        type:'confirmLogout',
        value:null
      });
    },
    closeModal_changepw(e){
      this.setData({isOpenModal_changepw:false});
    },
    old_pw_change(e){
      this.setData({
        old_pw:e.detail.value
      })
    },
    clear_old_pw(e){
      this.setData({
        old_pw:null
      })
    },
    new_pw_change(e){
      this.setData({
        new_pw:e.detail.value
      })
    },
    clear_new_pw(e){
      this.setData({
        new_pw:null
      })
    },
    changePassword(e){
      var this_=this;
      console.log("changePassword[old_pw:"+this_.data.old_pw+" new_pw:"+this_.data.new_pw+"]");
      if(!this_.data.old_pw||this_.data.old_pw.length==0){
        this_.setData({err_info:"请输入旧密码"});
      }else if(!this_.data.new_pw||this_.data.new_pw.length==0){
        this_.setData({err_info:"请输入新密码"});
      }else{
        //发起请求 更改密码
        wx.showLoading({
          title: '更改中...',
        })
        wx.request({
          url: app.HOST+app.URLS.change_password,
          header:app.requestHeader,
          method:"POST",
          data:{
            OldPassword:this_.data.old_pw,
            NewPassword:this_.data.new_pw,
          },
          success:function(res){
            console.log(res);
            if(res.data.Code=="success"){
              this_.setData({err_info:null});
            }else{
              this_.setData({err_info:res.data.Message});
            }
          },
          fail:function(res){
            this_.setData({err_info:"连接服务器异常"});
          },
          complete:function(res){
            wx.hideLoading({
              success: (res) => {},
            })
            //更改成功
            if(this_.data.err_info==null){
              this_.setData({
                isOpenModal_changepw:false,
                old_pw:"",
                new_pw:"",
              });
              this_.triggerEvent("userMenuEvent", {
                type:'changepwOk',
                value:null
              });
            }
          }
        })
      }
    }
  }
})