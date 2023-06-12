import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            meta: {
                title: "首页"
            },
            redirect: {
                name: 'book'
            }
        },
        {
            path: '/book',
            name: 'book',
            meta: {
                title: "笔记"
            },
            component: require('@/views/book').default
        },
        {
            path: '/tools',
            name: 'tools',
            meta: {
                title: "常用工具"
            },
            component: require('@/views/tools').default
        }
    ]
})
