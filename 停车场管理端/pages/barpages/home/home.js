// pages/barpages/home/home.js
Component({
  /**
   * 页面的初始数据
   */
  properties: {
    showReport:{
      type:Object,
      value:null
    }
  },
  data: {
    menus: [
      {
        title: '订单管理',
        name: 'order manage',
        color: 'cyan',
        icon: 'form',
        path:'/pages/menupages/order_manage/order_manage'
      },
      {
        title: '月卡管理',
        name: 'vip manage',
        color: 'Primary',
        icon: 'vip',
        path:'/pages/menupages/vip_manage/vip_manage'
      },
      // {
      //   title: '车辆管理',
      //   name: 'car manage',
      //   color: 'orange',
      //   icon: 'taxi',
      //   path:'/pages/menupages/car_manage/car_manage'
      // },
      {
        title: '历史报表',
        name: 'history report',
        color: 'brown',
        icon: 'time',
        path:'/pages/menupages/history_report/history_report'
      },
      {
        title: '黑名单管理',
        name: 'blacklist manage',
        color: 'black',
        icon: 'peoplelist',
        path:'/pages/menupages/blacklist_manage/blacklist_manage'
      },
    ],
  },
  methods:{
    refresh:function(e){
      this.triggerEvent("Fresh",null);
    }
  },
})