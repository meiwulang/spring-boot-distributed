import Vue from 'vue'
import Router from 'vue-router'
import List from '@/pages/transfer/list/List'
import Recycle from '@/pages/transfer/recycle/Recycle'
import Line from '@/pages/transfer/line/Line'
import Trip from '@/pages/transfer/trip/Trip'
import Supplement from '@/pages/transfer/supplement/Supplement'
import SupplementLine from '@/pages/transfer/supplement/SupplementLine'
import Ticketprice from '@/pages/transfer/ticketprice/Ticketprice'
import Addfare from '@/pages/transfer/ticketprice/Addfare'
import Batchfare from '@/pages/transfer/ticketprice/Batchfare'
import Ticketmanagement from '@/pages/transfer/ticketprice/Ticketmanagement'
import Schedule from '@/pages/transfer/schedule/Schedule'
import ScheduleOne from '@/pages/transfer/schedule/One'
import EditSchedule from '@/pages/transfer/schedule/editSchedule'
import ScheduleAll from '@/pages/transfer/schedule/All'
import advertising from '@/pages/transfer/advertising/advertising'
import advertisingInfo from '@/pages/transfer/advertising/advertisingInfo'
// 出团计划管理
import groupPlanManage from '@/pages/transfer/groupPlan/groupPlanManage'
import groupSheet from '@/pages/transfer/groupPlan/groupSheet'
import saleDetail from '@/pages/transfer/groupPlan/saleDetail'
//定制游
import selfTravelList from '@/pages/transfer/selfTravel/selfTravelList'
import selftrip from '@/pages/transfer/selftrip/selftrip'
import selfline from '@/pages/transfer/selfline/selfline'
import selfHistory from '@/pages/transfer/selfTravel/selfHistory'
// 团期管理
import groupManage from '@/pages/transfer/groupManage/groupManage'
import groupCancel from '@/pages/transfer/groupManage/groupCancel'
import groupNotice from '@/pages/transfer/groupManage/groupNotice'
import touristInfo from '@/pages/transfer/groupManage/touristInfo'
import touristConfirm from '@/pages/transfer/groupManage/touristConfirm'
import costKeeping from '@/pages/transfer/groupManage/costKeeping'
import costList from '@/pages/transfer/groupManage/costList'
// 添加成本
import addCostList from '@/pages/transfer/addCost/addCostList'
import addCostPage from '@/pages/transfer/addCost/addCostPage'
//集结产品
import assemblylist from '@/pages/transfer/assemblylist/assemblylist'
import assemblyAddCostPage from '@/pages/transfer/assemblylist/assemblyAddCostPage'
import assemblyLine from '@/pages/transfer/assemblyLine/assemblyLine'
import assemblyTicketprice from '@/pages/transfer/assemblyTicketprice/assemblyTicketprice'
import assemblyAddfare from '@/pages/transfer/assemblyTicketprice/assemblyAddfare'
import assemblySchedule from '@/pages/transfer/assemblySchedule/assemblySchedule'
import assemblyEditSchedule from '@/pages/transfer/assemblySchedule/assemblyEditSchedule'
//产品配置
import ProductDeployList from '@/pages/transfer/ProductDeploy/ProductDeployList' //产品票价班期配置
import ProductDeployLine from '@/pages/transfer/ProductDeploy/ProductDeployLine' //产品票价班期配置线路信息
import ProductDeployTrip from '@/pages/transfer/ProductDeploy/ProductDeployTrip' //产品票价班期配置行程信息
import ProductDeployCostList from '@/pages/transfer/ProductDeploy/ProductDeployCostList' //产品票价班期配置预算成本信息
import ProductDeployTicketprice from '@/pages/transfer/ProductDeploy/ProductDeployTicketprice' //产品票价班期配置票价信息
import ProductDeployAddfare from '@/pages/transfer/ProductDeploy/ProductDeployAddfare' //产品票价班期配置新增/编辑票价
import ProductDeploySchedule from '@/pages/transfer/ProductDeploy/ProductDeploySchedule' //产品票价班期配置班期信息
import ProductDeployeditSchedule from '@/pages/transfer/ProductDeploy/ProductDeployeditSchedule' //产品票价班期配置编辑班期信息
import ProductDeployInventory from '@/pages/transfer/ProductDeploy/ProductDeployInventory' //产品票价班期配置库存信息
import ProductDeployEditInventory from '@/pages/transfer/ProductDeploy/ProductDeployEditInventory' //产品票价班期配置编辑库存信息
import ProductDeployExfactoryPrice from '@/pages/transfer/ProductDeploy/ProductDeployExfactoryPrice' //产品票价班期配置编辑出厂价


// 产品申报配置
import declareConfig from '@/pages/transfer/declareConfig/declareConfig'
import declareConfigLine from '@/pages/transfer/declareConfig/line'
import declareConfigTrip from '@/pages/transfer/declareConfig/trip'
import declareConfigAddCostList from '@/pages/transfer/declareConfig/addCostList'
import declareConfigAddCostPage from '@/pages/transfer/declareConfig/addCostPage'
import declareConfigTicketPrice from '@/pages/transfer/declareConfig/ticketPrice'
import declareConfigAddfare from '@/pages/transfer/declareConfig/addfare'
import declareConfigSchedule from '@/pages/transfer/declareConfig/schedule'
import declareConfigEditSchedule from '@/pages/transfer/declareConfig/editSchedule'
import declareConfigAddSchedule from '@/pages/transfer/declareConfig/addSchedule'



Vue.use(Router)

export default new Router({
  routes: [{
      path: '/', //产品管理
      name: 'index',
      component: List,
      meta: {
        title: '计调中心'
      }
    },
    {
      path: '/list', //产品管理
      name: 'List',
      component: List,
      meta: {
        title: '产品管理'
      }
    }, {
      path: '/advertising', //广告管理
      name: 'advertising',
      component: advertising,
      meta: {
        title: '广告管理'
      }
    },
    {
      path: '/advertisingInfo',
      name: 'advertisingInfo',
      component: advertisingInfo,
      meta: {
        title: '编辑广告'
      }
    },
    {
      path: '/list/recycle', //产品管理回收站
      name: 'Recycle',
      component: Recycle,
      meta: {
        title: '产品管理回收站'
      }
    },
    {
      path: '/list/line', //线路信息
      name: 'Line',
      component: Line,
      meta: {
        title: '线路信息',
        query: ["id"]
      }
    },

    {
      path: '/list/trip', //行程信息
      name: 'Trip',
      component: Trip,
      meta: {
        title: '行程信息',
        query: ["id"]
      }
    },
    {
      path: '/list/supplement', //补充流程
      name: 'Supplement',
      component: Supplement,
      meta: {
        title: '补充行程',
        query: ["id"]
      }
    },
    {
      path: '/list/supplementLine', //补充流程
      name: 'SupplementLine',
      component: SupplementLine,
      meta: {
        title: '补充行程',
        query: ["id"]
      }
    },
    {
      path: '/list/ticketprice', //票价信息
      name: 'Ticketprice',
      component: Ticketprice,
      meta: {
        title: '票价信息',
        query: ["id"]
      }
    },
    {
      path: '/list/ticketprice/addfare', //票价信息  票价添加
      name: 'Addfare',
      component: Addfare,
      meta: {
        title: '编辑票价'
      }
    },
    {
      path: '/list/ticketprice/tickedmange', //票价信息 套票添加
      name: 'Ticketmanagement',
      component: Ticketmanagement,
      meta: {
        titles: [{
          conditions: [{
            param: "priceId",
            type: 'notNull'
          }],
          title: '编辑票价',
        }, {
          conditions: [{
            param: "priceId",
            type: 'null'
          }],
          title: '新增套票'
        }]
      }
    },
    {
      path: '/list/ticketprice/batchfare', //票价信息 批量添加
      name: 'Batchfare',
      component: Batchfare,
      meta: {
        title: '批量添加票价'
      }
    },
    {
      path: '/list/schedule', //班期信息
      name: 'Schedule',
      component: Schedule,
      meta: {
        title: '班期信息',
        query: ["id"]
      }
    },
    {
      path: '/list/schedule/one', //班期信息 班期添加
      name: 'ScheduleOne',
      component: ScheduleOne,
      meta: {
        titles: [{
          conditions: [{
            param: "type",
            type: 'equal',
            value: 1
          }],
          title: '新增班期',
        }, {
          conditions: [{
            param: "type",
            type: 'equal',
            value: 2
          }],
          title: '批量新增班期'
        }]
      }
    },
    {
      path: '/list/schedule/editSchedule', //班期信息 班期添加
      name: 'editSchedule',
      component: EditSchedule,
      meta: {
        title: '编辑班期'
      }
    },
    {
      path: '/list/addCostList', //成本列表
      name: 'addCostList',
      component: addCostList,
      meta: {
        title: '成本列表'
      }
    },
    {
      path: '/list/addCostList/addCostPage', //添加成本
      name: 'addCostPage',
      component: addCostPage,
      meta: {
        title: '添加成本'
      }
    },            
    {
      path: '/list/schedule/all', //班期信息  班期批量
      name: 'ScheduleAll',
      component: ScheduleAll,
      meta: {
        title: '无效'
      }
    },
    {
      path: '/groupPlanManage', //
      name: 'groupPlanManage',
      component: groupPlanManage,
      meta: {
        title: '出团计划管理'
      }
    },
    {
      path: '/groupPlanManage/groupSheet', //
      name: 'groupSheet',
      component: groupSheet,
      meta: {
        title: '出团计划表'
      }
    }, 
    {
      path: '/groupPlanManage/groupSheet/saleDetail', //
      name: 'saleDetail',
      component: saleDetail,
      meta: {
        title: '销售明细'
      }
    },
    {
      path: '/selfTravelList', //
      name: 'selfTravelList',
      component: selfTravelList,
      meta: {
        title: '定制游'
      }
    }, 
    {
      path: '/selftrip', //
      name: 'selftrip',
      component: selftrip,
      meta: {
        title: '定制游行程信息'
      }
    },   
    {
      path: '/selfline', //
      name: 'selfline',
      component: selfline,
      meta: {
        title: '编辑方案'
      }
    },   
    {
      path: '/selfTravelList/selfHistory', //
      name: 'selfHistory',
      component: selfHistory,
      meta: {
        title: '需求单及方案追溯'
      }
    },  
    {
      path: '/groupManage', //
      name: 'groupManage',
      component: groupManage,
      meta: {
        title: '团期管理'
      }
    }, 
    {
      path: '/groupManage/touristInfo', //
      name: 'touristInfo',
      component: touristInfo,
      meta: {
        title: '游客信息'
      }
    },  
    {
      path: '/groupManage/touristConfirm', //
      name: 'touristConfirm',
      component: touristConfirm,
      meta: {
        title: '确认出行游客名单'
      }
    },        
    {
      path: '/groupManage/groupCancel', //
      name: 'groupCancel',
      component: groupCancel,
      meta: {
        title: '取消游客'
      }
    },  
    {
      path: '/groupManage/groupNotice', //
      name: 'groupNotice',
      component: groupNotice,
      meta: {
        title: '出团通知书'
      }
    }, 
    {
      path: '/groupManage/costList', //
      name: 'costList',
      component: costList,
      meta: {
        title: '核算成本管理'
      }
    },
    {
      path: '/groupManage/costKeeping', //
      name: 'costKeeping',
      component: costKeeping,
      meta: {
        title: '成本核算'
      }
    },{
      path: '/assemblylist', //产品管理
      name: 'assemblylist',
      component: assemblylist,
      meta: {
        title: '集结产品管理'
      }
    },
    {
      path: '/assemblylist/addCostList', //集结-成本列表
      name: 'addCostList',
      component: addCostList,
      meta: {
        title: '成本列表'
      }
    },  
    {
      path: '/assemblylist/addCostList/assemblyAddCostPage', //集结-添加成本
      name: 'assemblyAddCostPage',
      component: assemblyAddCostPage,
      meta: {
        title: '添加成本'
      }
    },        
    {
      path: '/assemblylist/assemblyLine', //线路信息
      name: 'assemblyLine',
      component: assemblyLine,
      meta: {
        title: '区域产品列表',
        query: ["id"]
      }
    },{
      path: '/assemblylist/assemblyTicketprice', //票价信息
      name: 'assemblyTicketprice',
      component: assemblyTicketprice,
      meta: {
        title: '集结产品票价信息',
        query: ["id"]
      }
    },
    {
      path: '/assemblylist/assemblyTicketprice/assemblyAddfare', //票价信息  票价添加
      name: 'assemblyAddfare',
      component: assemblyAddfare,
      meta: {
        title: '集结产品编辑票价'
      }
    }, 
    {
      path: '/assemblylist/assemblySchedule', //票价信息  票价添加
      name: 'assemblySchedule',
      component: assemblySchedule,
      meta: {
        title: '集结产品班期信息'
      }
    },  
    {
      path: '/assemblylist/assemblySchedule/assemblyEditSchedule', //班期信息 班期添加
      name: 'assemblyEditSchedule',
      component: assemblyEditSchedule,
      meta: {
        title: '编辑班期'
      }
    },  
    {
      path: '/ProductDeploy/ProductDeployList', //产品票价班期配置
      name: 'ProductDeployList',
      component: ProductDeployList,
      meta: {
        title: '产品票价班期配置'
      }
    }, 
    {
      path: '/ProductDeploy/ProductDeployList/ProductDeployLine', //产品票价班期配置线路信息
      name: 'ProductDeployLine',
      component: ProductDeployLine,
      meta: {
        title: '线路信息'
      }
    },  
    {
      path: '/ProductDeploy/ProductDeployList/ProductDeployTrip', //产品票价班期配置行程信息
      name: 'ProductDeployTrip',
      component: ProductDeployTrip,
      meta: {
        title: '行程信息'
      }
    }, 
    {
      path: '/ProductDeploy/ProductDeployList/ProductDeployCostList', //产品票价班期配置预算成本信息
      name: 'ProductDeployCostList',
      component: ProductDeployCostList,
      meta: {
        title: '预算成本信息'
      }
    },   
    {
      path: '/ProductDeploy/ProductDeployList/ProductDeployExfactoryPrice', //产品票价班期配置出厂价信息
      name: 'ProductDeployExfactoryPrice',
      component: ProductDeployExfactoryPrice,
      meta: {
        title: '出厂价信息'
      }
    }, 
    {
      path: '/ProductDeploy/ProductDeployList/ProductDeployTicketprice', //产品票价班期配置票价信息
      name: 'ProductDeployTicketprice',
      component: ProductDeployTicketprice,
      meta: {
        title: '票价信息',
        query: ["id","c_id"]
      }
    },   
    {
      path: '/ProductDeploy/ProductDeployList/ProductDeployTicketprice/ProductDeployAddfare', //产品票价班期配置新增/编辑票价
      name: 'ProductDeployAddfare',
      component: ProductDeployAddfare,
      meta: {
        title: '新增/编辑票价',
        query: ["id","c_id"]
      }
    }, 
    {
      path: '/ProductDeploy/ProductDeployList/ProductDeploySchedule', //产品票价班期配置班期信息
      name: 'ProductDeploySchedule',
      component: ProductDeploySchedule,
      meta: {
        title: '班期信息',
        query: ["id","c_id"]
      }
    }, 
    {
      path: '/ProductDeploy/ProductDeployList/ProductDeploySchedule/ProductDeployeditSchedule', //产品票价班期配置编辑班期信息
      name: 'ProductDeployeditSchedule',
      component: ProductDeployeditSchedule,
      meta: {
        title: '编辑班期信息',
        query: ["id","c_id"]
      }
    }, 
    {
      path: '/ProductDeploy/ProductDeployList/ProductDeployInventory', //产品票价班期配置库存信息
      name: 'ProductDeployInventory',
      component: ProductDeployInventory,
      meta: {
        title: '库存信息',
        query: ["id","c_id"]
      }
    },  
    {
      path: '/ProductDeploy/ProductDeployList/ProductDeployInventory/ProductDeployEditInventory', //产品票价班期配置编辑库存信息
      name: 'ProductDeployEditInventory',
      component: ProductDeployEditInventory,
      meta: {
        title: '编辑库存信息',
        query: ["id","c_id"]
      }
    },
    //  申报配置            
    {
      path: '/declareConfig', //产品申报配置
      name: 'declareConfig',
      component: declareConfig,
      meta: {
        title: '产品申报配置'
      }
    }, 
    {
      path: '/declareConfig/declareConfigLine',
      name: 'declareConfigLine',
      component: declareConfigLine,
      meta: {
        title: '线路信息'
      }
    }, 
    {
      path: '/declareConfig/declareConfigTrip', 
      name: 'declareConfigTrip',
      component: declareConfigTrip,
      meta: {
        title: '行程信息'
      }
    },  
    {
      path: '/declareConfig/declareConfigAddCostList', 
      name: 'declareConfigAddCostList',
      component: declareConfigAddCostList,
      meta: {
        title: '预算成本列表',
        query: ["id","c_id"]
      }
    }, 
    {
      path: '/declareConfig/declareConfigAddCostList/declareConfigAddCostPage', 
      name: 'declareConfigAddCostPage',
      component: declareConfigAddCostPage,
      meta: {
        title: '添加成本',
        query: ["id","c_id"]
      }
    },  
    {
      path: '/declareConfig/declareConfigTicketPrice', 
      name: 'declareConfigTicketPrice',
      component: declareConfigTicketPrice,
      meta: {
        title: '出厂价信息',
        query: ["id","c_id"]
      }
    }, 
    {
      path: '/declareConfig/declareConfigTicketPrice/declareConfigAddfare', 
      name: 'declareConfigAddfare',
      component: declareConfigAddfare,
      meta: {
        title: '添加出厂价',
        query: ["id","c_id"]
      }
    },  
    {
      path: '/declareConfig/declareConfigSchedule', 
      name: 'declareConfigSchedule',
      component: declareConfigSchedule,
      meta: {
        title: '班期信息',
        query: ["id","c_id"]
      }
    },  
    {
      path: '/declareConfig/declareConfigSchedule/declareConfigEditSchedule', 
      name: 'declareConfigEditSchedule',
      component: declareConfigEditSchedule,
      meta: {
        title: '编辑班期',
        query: ["id","c_id"]
      }
    }, 
    {
      path: '/declareConfig/declareConfigSchedule/declareConfigAddSchedule', 
      name: 'declareConfigAddSchedule',
      component: declareConfigAddSchedule,
      meta: {
        title: '添加班期',
        query: ["id","c_id"]
      }
    },                                 

  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  linkActiveClass: 'active'
})
