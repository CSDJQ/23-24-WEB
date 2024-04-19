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
                component:()=>import('@/views/ShopSonpage.vue')
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
   
]

const router = createRouter(
    {
        mode: 'hash',
        history:createWebHashHistory(process.env.BASE_URL),
        routes
    }
)

export default router

