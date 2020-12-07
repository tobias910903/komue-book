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
                name: 'index_book'
            }
        },
        {
            path: '/book',
            name: 'index_book',
            meta: {
                title: "笔记"
            },
            component: require('@/views/index_book').default
        },
        {
            path: '/weekly',
            name: 'index_weekly',
            meta: {
                title: "周报"
            },
            component: require('@/views/index_weekly').default
        },
    ]
})
