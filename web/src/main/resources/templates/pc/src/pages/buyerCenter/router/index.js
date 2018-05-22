import Vue from 'vue'
import Router from 'vue-router'
import buyerlogin from '@/pages/buyerCenter/innerHTML/buyerlogin';


Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/buyerlogin',
            name: 'buyerlogin',
            component: buyerlogin,
            meta: { title: '分销中心入口' }
        },                                                  
    ]
})
