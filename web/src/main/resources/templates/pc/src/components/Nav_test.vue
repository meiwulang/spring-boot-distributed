<template>
  <div id="jdyNav" class="jdy-nav fleft">
    <div class="logo"></div>
    <ul>
      <li v-for="item in dnavArr" class="navli">
        <div v-if="item.type.indexOf(companyType)!=-1">
          <div class="jdy-nav-title clearfix current" :class="item.navclass">
            <a class="inlineblock navicon " :href="item.url + item.children[0].url.substr(1)" v-if="companyType == 0"></a>
            <a class="inlineblock navicon " :href="item.url" v-if="companyType == 2"></a>
            <a class="inlineblock navicon " :href="item.url" v-if="companyType == 3"></a>
          </div>
          <ul class="jdy-nav-childul absolute">
            <div class="jdy-nav-title2">{{item.title}}</div>
            <li v-for="citem in item.children" v-if="citem.childType.indexOf(companyType)!=-1">
              <!-- 判断三级子目录(公司级别和是否有下一级) -->
                <ul v-if="citem.children!=null" class="relative ulThr">
                  <div class="jdy-nav-title3">{{citem.title}}</div>
                  <li v-for="itemThr in citem.children" v-if="itemThr.childType.indexOf(companyType)!=-1" class="absolute liThr">
                    <a title="" class="inlineblock" :class="item.navclass" :href="item.url+citem.url+itemThr.url.substr(1)">{{itemThr.title}}</a>
                  </li>
                </ul>
                <!--<router-link :to="citem.url" class="inlineblock" :class="item.navclass">{{citem.title}}</router-link>-->
                <a v-if="citem.children==null" title="" class="inlineblock" :class="item.navclass" :href="item.url+citem.url.substr(1)">{{citem.title}}</a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'nav',
  props: {
    navArr: Array
  },
  data() {
    return {
      companyType: JSON.parse(sessionStorage.loginData).cType,
      msg: 'nav',
      flag: false,
      dnavArr: [{
        type:[0,2,3],
        title: '控制台',
        navclass: 'console',
        url: '/console.html#/',
        children: [{
          childType: [0,2,3],
          title: '控制台首页',
          url: '/main'
        }]
      }, {
        type:[0,2],
        title: '计调中心',
        navclass: 'transfer',
        url: '/transfer.html#/',
        children: [{
          childType: [0,2],
          title: '产品管理',
          url: '/list'
        },{
            childType: [0,2],
            title: '广告管理',
            url: '/advertising'
          }]
      },
      {
        type:[0,2],
        title: '资源中心',
        navclass: 'resources',
        url: '/resources.html#/',
        children: [
          {
            childType: [0,2],
            title: '始发站管理',
            url: '/startstation'
          },
          {
            childType: [0,2],
            title: '出发地管理',
            url: '/origin'
          },
          {
            childType: [0,2],
            title: '酒店管理',
            url: '/hotel'
          },
          {
            childType: [0,2],
            title: '景点管理',
            url: '/scenicspot'
          },
          {
            childType: [0,2],
            title: '图片管理',
            url: '/picture'
          }
        ]
      },
      {
        type:[3,2],
        title: '分销中心',
        navclass: 'buyerCenter',
        url: '/buyerCenter.html#/',
        children: [
          // {
          //   childType: [3,2],
          //   title: '分销中心',
          //   url: '/innerHTML'
          // }
          {
            childType: [3,2],
            title: '首页',
            url: '/todayTarget',
            // children:[{
            //   childType: [3,2],
            //   title: '今日指标',
            //   url: '/todayTarget'
            // }],         
          },
          {
            childType: [3,2],
            title: '微信管理',
            url: '/wechat',
            children:[
              {
                childType: [3,2],
                title: '自动回复',
                url: '/autoReply'
              }, 
              {
                childType: [3,2],
                title: '代言素材库',
                url: '/material'
              },   
              {
                childType: [3,2],
                title: '自定义菜单',
                url: '/menuCustom'
              },               
            ]
          },   
          {
            childType: [3,2],
            title: '渠道管理',
            url: '/channel',
            children:[
              {
                childType: [3,2],
                title: '代理人概况',
                url: '/agentBasic'
              }, 
              {
                childType: [3,2],
                title: '代理人列表',
                url: '/agentList'
              },  
              {
                childType: [3,2],
                title: '商品发布管理',
                url: '/publishManager'
              }, 
              {
                childType: [3,2],
                title: '返佣明细',
                url: '/returndetail'
              },    
              {
                  childType: [3,2],
                  title: '结算管理',
                  url: '/totalManager'
              },  
              {
                  childType: [3,2],
                  title: '渠道管理设置',
                  url: '/channelConfig'
              },                                                     
            ]
          },   
          {
            childType: [3,2],
            title: '账户管理',
            url: '/accountAll'
          },                                        
          // {
          //   childType: [3,2],
          //   title: '今日指标',
          //   url: '/todayTarget'
          // }, 
          // {
          //   childType: [3,2],
          //   title: '账户总览',
          //   url: '/accountAll'
          // }, 
          // {
          //   childType: [3,2],
          //   title: '代理人概况',
          //   url: '/agentBasic'
          // }, 
          // {
          //   childType: [3,2],
          //   title: '代理人列表',
          //   url: '/agentList'
          // }, 
          // 二级目录
          // {
          //   childType: [3,2],
          //   title: '微信管理',
          //   url: '/agentList',
          //   children:[
          //     {
          //       childType: [3,2],
          //       title: '自动回复',
          //       url: '/autoReply'
          //     }, 
          //     {
          //       childType: [3,2],
          //       title: '代言素材库',
          //       url: '/material'
          //     },   
          //     {
          //       childType: [3,2],
          //       title: '自定义菜单',
          //       url: '/menuCustom'
          //     },               
          //   ]
          // },           
          // {
          //   childType: [3,2],
          //   title: '自动回复',
          //   url: '/autoReply'
          // }, 
          // {
          //   childType: [3,2],
          //   title: '代言素材库',
          //   url: '/material'
          // },   
          // {
          //   childType: [3,2],
          //   title: '自定义菜单',
          //   url: '/menuCustom'
          // }, 
          // {
          //   childType: [3,2],
          //   title: '商品发布管理',
          //   url: '/publishManager'
          // }, 
          // {
          //   childType: [3,2],
          //   title: '返佣明细',
          //   url: '/returndetail'
          // },   
          // {
          //   childType: [3,2],
          //   title: '结算管理',
          //   url: '/totalManager'
          // },                                                                             
        ]
      },
      {
        type:[0,2,3],
        title: '系统中心',
        navclass: 'system',
        url: '/system.html#/',
        children: [
          {
            childType: [0],
            title: '品牌管理',
            url: '/brand'
          },
          {
            childType: [2],
            title: '用户管理',
            url: '/user'
          },
          {
            childType: [2],
            title: '模块管理',
            url: '/module'
          },
          {
            childType: [2],
            title: '角色管理',
            url: '/roleManager'
          },
          {
            childType: [2],
            title: '组织架构管理',
            url: '/orgStructure'
          },
          // {
          //   childType: [2,3],
          //   title: '代理人管理',
          //   url: '/agentUser'
          // },
          // {
          //   childType: [2,3],
          //   title: '部门管理',
          //   url: '/department'
          // },
        ]
      },
      {
        type:[0,2],
        title: '销售中心',
        navclass: 'sale',
        url: '/sale.html#/',
        children: [
          {
            childType: [0,2],
            title: '卖家订单',
            url: '/sellerOrderAll'
          }
        ]
      },
      {
        type:[0,2],
        title: '报表中心',
        navclass: 'report',
        url: '/report.html#/',
        children: [
          {
            childType: [0,2],
            title: '代理人返佣报表',
            url: '/agentReturnReport'
          },
          {
            childType: [0,2],
            title: '代理人销售报表',
            url: '/agentSalesReport'
          },
        ]
      }
      ]
    }
  },
  methods: {
    setCurrent() {
      let currentUrl = location.href
      setTimeout(() => {
        $('.jdy-nav-childul').find("a").each(function(num, obj) {
          // console.log("当前",currentUrl,"子",$(obj).attr("href"))
          if (currentUrl.indexOf($(obj).attr("href")) != -1) {
            $(obj).parent().addClass("current")
          } else {
            $(obj).parent().removeClass("current")
          }
        })
      }, 200)
    }
  },
  mounted() {
    this.setCurrent();
  }
}

  //,
  // {
  //   title: '销售中心',
  //   navclass: 'sale',
  //   url: '/sale.html#/',
  //   children: [

  //   ]
  // },
  // {
  //   title: '财务中心',
  //   navclass: 'finance',
  //   url: '/finance.html#/',
  //   children: [

  //   ]
  // },
  // {
  //   title: '报表中心',
  //   navclass: 'reportform',
  //   url: '/reportform.html#/',
  //   children: [

  //   ]
  // },
  // {
  //   title: '应用中心',
  //   navclass: 'application',
  //   url: '/application.html#/',
  //   children: [

  //   ]
  // }
</script>

