import { createRouter, createWebHashHistory } from "vue-router";
import IndexView from '@/views/IndexPage.vue'

const routes = [
    {
        path:'/',
        component:IndexView,
    },
    {
        path:'/index',
        component:()=>import('@/views/IndexPage.vue')
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
