import Vue from 'vue'
import Router from 'vue-router'
import Privilege from '@/pages/system/privilege/Privilege'
import Information from '@/pages/system/information/Information'
import addnotice from '@/pages/system/information/addnotice'
import tag from '@/pages/system/tag/tag'
import Department from '@/pages/system/department/department'
import user from '@/pages/system/user/user'
import userinfo from '@/pages/system/user/userinfo'
import advertising from '@/pages/system/advertising/advertising'
import advertisingInfo from '@/pages/system/advertising/advertisingInfo'
import dictionary from '@/pages/system/dictionary/dictionary'
import noun from '@/pages/system/dictionary/noun'
import Company from '@/pages/system/company/Company'
import CompanyInfo from '@/pages/system/company/Info'
import CompanyInfo2 from '@/pages/system/company/Info2'
import CompanyEnclosure from '@/pages/system/company/Enclosure'
import CompanySetting from '@/pages/system/company/Setting'
import CompanyExamine from '@/pages/system/company/Examine'
import CompanyExamineDetail from '@/pages/system/company/ExamineDetail'
import unitauditu from '@/pages/system/unitauditu/unitauditu'
import unitauditudetail from '@/pages/system/unitauditu/unitauditudetail'
import recommend from '@/pages/system/recommend/recommend'
import brand from '@/pages/system/brand/brand'
import putcity from '@/pages/system/putcity/PutCity'
import agentUser from '@/pages/system/agentUser/agentUser'
import agentUserInfo from '@/pages/system/agentUser/agentUserInfo'
import module from '@/pages/system/module/module'
import editmodule from '@/pages/system/module/editmodule'
import roleManager from '@/pages/system/roleManager/roleManager'
import addroleManager from '@/pages/system/roleManager/addroleManager'
import orgStructure from '@/pages/system/orgStructure/orgStructure'
import newuseredit from '@/pages/system/newuser/newuseredit'
import newuserList from '@/pages/system/newuser/newuserList'
import newUserDetail from '@/pages/system/newuser/newuserDetail'
// 权限管理
import authenticList from '@/pages/system/authentic/authenticList'
import authenticEdit from '@/pages/system/authentic/authenticEdit'
import authenticDetail from '@/pages/system/authentic/authenticDetail'
import postlist from '@/pages/system/postlist/postlist'



Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'newuserList',
      component: newuserList,
      meta: {
        title: '系统中心'
      }
    },
    {
      path: '/pivilege', //权限管理
      name: 'Privilege',
      component: Privilege,
      meta: {
        title: '权限管理'
      }
    },
    {
      path: '/module', //权限管理
      name: 'module',
      component: module,
      meta: {
        title: '模块管理'
      }
    },
    {
      path: '/postlist', //权限管理
      name: 'postlist',
      component: postlist,
      meta: {
        title: '岗位管理'
      }
    },
    {
      path: '/editmodule', //权限管理
      name: 'editmodule',
      component: editmodule,
      meta: {
        title: '添加/编辑模块'
      }
    },
    {
      path: '/information', //资讯管理
      name: 'Information',
      component: Information,
      meta: {
        title: '资讯管理'
      }
    },
    {
      path: '/addnotice', //添加资讯
      name: 'addnotice',
      component: addnotice,
      meta: {
        title: '编辑资讯'
      }
    },
    {
      path: '/tag', //标签管理
      name: 'tag',
      component: tag,
      meta: {
        title: '标签管理'
      }
    },
    {
      path: '/department',
      name: 'department',
      component: Department,
      meta: {
        title: '部门管理'
      }
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      meta: {
        title: '用户管理'
      }
    },
    {
      path: '/userinfo',
      name: 'userinfo',
      component: userinfo,
      meta: {
        title: '编辑用户'
      }
    },
    {
      path: '/agentUser',
      name: 'agentUser',
      component: agentUser,
      meta: {
        title: '代理人管理'
      }
    },
    {
      path: '/agentUserInfo',
      name: 'agentUserInfo',
      component: agentUserInfo,
      meta: {
        title: '编辑代理人'
      }
    },
    {
      path: '/advertising',
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
      path: '/dictionary',
      name: 'dictionary',
      component: dictionary,
      meta: {
        title: '字典管理'
      }
    },
    {
      path: '/dictionary/noun',
      name: 'noun',
      component: noun,
      meta: {
        title: '名词管理'
      }
    },
    {
      path: '/company',
      name: 'company',
      component: Company,
      meta: {
        title: '单位管理'
      }
    },
    {
      path: '/company/info',
      name: 'companyInfo',
      component: CompanyInfo,
      meta: {
        title: '编辑单位'
      }
    },
    {
      path: '/company/info2',
      name: 'companyInfo2',
      component: CompanyInfo2,
      meta: {
        title: '编辑单位'
      }
    },
    {
      path: '/company/enclosure',
      name: 'companyEnclosure',
      component: CompanyEnclosure,
      meta: {
        title: '单位附件'
      }
    },
    {
      path: '/company/setting',
      name: 'companySetting',
      component: CompanySetting,
      meta: {
        title: '单位设置'
      }
    },
    {
      path: '/company/examine',
      name: 'companyExamine',
      component: CompanyExamine,
      meta: {
        title: '不知道'
      }
    },
    {
      path: '/company/examineDetail',
      name: 'companyExamineDetail',
      component: CompanyExamineDetail,
      meta: {
        title: '不知道'
      }
    },
    {
      path: '/unitauditu',
      name: 'unitauditu',
      component: unitauditu,
      meta: {
        title: '单位审核'
      }
    },
    {
      path: '/unitauditudetail',
      name: 'unitauditudetail',
      component: unitauditudetail,
      meta: {
        title: '单位详情'
      }
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: recommend,
      meta: {
        title: '产品推荐'
      }
    },
    {
      path: '/brand',
      name: 'brand',
      component: brand,
      meta: {
        title: '品牌管理'
      }
    },
    {
      path: '/putcity',
      name: 'putcity',
      component: putcity,
      meta: {
        title: '投放城市管理'
      }
    },
    {
      path: '/orgStructure',
      name: 'orgStructure',
      component: orgStructure,
      meta: {
        title: '组织架构管理'
      }
    },
    {
      path: '/roleManager',
      name: 'roleManager',
      component: roleManager,
      meta: {
        title: '角色管理'
      }
    },
    {
      path: '/roleManager/addroleManager',
      name: 'addroleManager',
      component: addroleManager,
      meta: {
        title: '新增/编辑角色'
      }
    },
    {
      path: '/newuser',
      name: 'newuser',
      component: newuserList,
      meta: {
        title: '用户基本信息管理'
      }
    },    
    {
      path: '/newuser/newuseredit',
      name: 'newuseredit',
      component: newuseredit,
      meta: {
        title: '新增/编辑用户'
      }
    },
    {
      path: '/newuser/newUserDetail',
      name: 'newUserDetail',
      component: newUserDetail,
      meta: {
        title: '查看用户信息'
      }
    },
    {
      path: '/authentic',
      name: 'authentic',
      component: authenticList,
      meta: {
        title: '用户角色权限管理'
      }
    },
    {
      path: '/authentic/authenticEdit',
      name: 'authenticEdit',
      component: authenticEdit,
      meta: {
        title: '新增/编辑用户权限'
      }
    },
    {
      path: '/authentic/authenticDetail',
      name: 'authenticDetail',
      component: authenticDetail,
      meta: {
        title: '查看用户权限'
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
