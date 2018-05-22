import Vue from 'vue'
import Router from 'vue-router'
// 礼品卡
import cardManage from '@/pages/cardCenter/innerHTML/cardManage';
import createIndex from '@/pages/cardCenter/innerHTML/createIndex';
import indexManage from '@/pages/cardCenter/innerHTML/indexManage';
import styleManage from '@/pages/cardCenter/innerHTML/styleManage';




Vue.use(Router)

export default new Router({
    routes: [  
        {
            path: '/indexManage',
            name: 'indexManage',
            component: indexManage,
            meta: { title: '序列号管理' }
        },  
        {
            path: '/cardManage',
            name: 'cardManage',
            component: cardManage,
            meta: { title: '卡订单管理' }
        },  
        {
            path: '/createIndex',
            name: 'createIndex',
            component: createIndex,
            meta: { title: '生成序列号' }
        },  
        {
            path: '/styleManage',
            name: 'styleManage',
            component: styleManage,
            meta: { title: '卡样式管理' }
        },                                                                       
    ]
})
