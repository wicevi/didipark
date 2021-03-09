// pages/barpages/home/home.js
Component({
  /**
   * 页面的初始数据
   */
  properties: {
    showReport:{
      type:Object,
      value:null
    },
    parkName:{
      type:String,
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
      {
        title: '收费策略',
        name: 'fee strategy',
        color: 'green',
        icon: 'moneybag',
        path:'/pages/menupages/fee_strategy/fee_strategy'
      },
      {
        title: '车辆分组',
        name: 'car group',
        color: 'purple',
        icon: 'taxi',
        path:'/pages/menupages/car_group/car_group'
      },
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

  },
})