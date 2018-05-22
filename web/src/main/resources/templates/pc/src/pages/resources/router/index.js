import Vue from 'vue'
import Router from 'vue-router'
import Startstation from '@/pages/resources/startstation/startstation';
import Origin from '@/pages/resources/origin/origin';
import Origincar from '@/pages/resources/origin/originCar';
import Hotel from '@/pages/resources/hotel/hotel';
import HotelInfo from '@/pages/resources/hotel/info';
import HotelPic from '@/pages/resources/hotel/pic';
import Scenicspot from '@/pages/resources/scenicspot/scenicspot';
import ScenicspotInfo from '@/pages/resources/scenicspot/info';
import ScenicspotPic from '@/pages/resources/scenicspot/pic';
import Pic from '@/pages/resources/pics/Pic';
import PicDetail from '@/pages/resources/pics/Picdetail';
import contractFtl from '@/pages/resources/contract/contract';
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'index',
      component: Startstation,
    meta:{title:'资源中心'}
    },
    {
      path: '/startstation',
      name: 'Startstation',
      component: Startstation,
      meta:{title:'始发站管理'}
    },

    {
      path: '/origin',
      name: 'origin',
      component: Origin,
      meta:{title:'出发地管理'}
    },
    {
      path: '/origin/origincar',
      name: 'origincar',
      component: Origincar,
      meta:{title:'班车管理'}
    },
    {
      path:'/hotel',
      name:'hotel',
      component:Hotel,
      meta:{title:'酒店管理'}
    },
    {
      path:'/hotel/info',
      name:'hotelInfo',
      component:HotelInfo,
      meta:{titles:[{
        conditions:[{
          param : "hotelId",
          type:'null'
        }],
        title:'新增酒店',
      },{
        conditions:[{
          param : "hotelId",
          type:'notNull'
        }],
        title:'编辑酒店'
      }]}
    },
    {
      path:'/hotel/pic',
      name:'hotelPic',
      component:HotelPic,
      meta:{title:'图片管理'}
    },
    {
      path:'/scenicspot',
      name:'scenicspot',
      component:Scenicspot,
      meta:{title:'景点管理'

      }
    },
    {
      path:'/scenicspot/info',
      name:'scenicspotInfo',
      component:ScenicspotInfo,
      meta:{titles:[{
        conditions:[{
          param : "spotId",
          type:'null'
        }],
        title:'新增景点',
      },{
        conditions:[{
          param : "spotId",
          type:'notNull'
        }],
        title:'编辑景点'
      }]}
    },
    {
      path:'/scenicspot/pic',
      name:'scenicspotPic',
      component:ScenicspotPic,
      meta:{title:'图片管理'}
    },
    {
      path:'/picture',
      name:'picture',
      component:Pic,
      meta:{title:'图片管理'}
    },
    {
      path:'/picdetail',
      name:'picdetail',
      component:PicDetail,
      meta:{title:'相册详情页'}
    },
    {
      path:'/contractFtl',
      name:'contractFtl',
      component:contractFtl,
      meta:{title:'合同模板管理'}
    }    
  ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },
    linkActiveClass: 'active'
})
