import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path:'/',
        redirect:'/index',
    },
    {
        path:'/index',
        component:()=>import('@/views/IndexPage.vue'),
        children:[
            {
                path:'',
                redirect:'/home'
            },
            {
                path:'/home',
                component:()=>import('@/views/HomeSonpage.vue')
            },
            {
                path:'/shop',
                component:()=>import('@/views/ShopSonpage.vue'),
                props: true,
            },
            {
                path:'/have',
                component:()=>import('@/views/HaveSonpage.vue')
            },
            {
                path:'/history',
                component:()=>import('@/views/HistorySonpage.vue')
            },
        ]
    },
    {
        path:'/toLogin',
        component:()=>import('@/components/LoginComponent.vue')
    },
    {
        path:'/success/:message',
        name:'Success',
        component:()=>import('@/components/SuccessComponent.vue'),
        props: true,
    },
]

const router = createRouter(
    {
        mode: 'hash',
        history:createWebHashHistory(process.env.BASE_URL),
        routes
    }
)

export default router

