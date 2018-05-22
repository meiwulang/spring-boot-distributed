import Vue from 'vue'
import Router from 'vue-router'
import consoleIndex from '@/pages/console/main/main';


Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'consoleIndex',
            component: consoleIndex,
            meta: { title: '控制台首页' }
        },
        {
            path: '/main',
            name: 'consoleIndex',
            component: consoleIndex,
            meta: { title: '控制台首页' }
        }
    ]
})
