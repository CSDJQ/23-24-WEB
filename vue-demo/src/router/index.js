import { createRouter, createWebHashHistory } from "vue-router";
import { requireAuth } from './auth';

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
                meta: { requiresAuth: true },
            },
            {
                path:'/have',
                component:()=>import('@/views/HaveSonpage.vue'),
                meta: { requiresAuth: true },
            },
            {
                path:'/history',
                component:()=>import('@/views/HistorySonpage.vue'),
                meta: { requiresAuth: true },
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
        meta: { requiresAuth: true },
        props: true,
    },
]

const router = createRouter(
    {
        // mode: 'hash',
        history:createWebHashHistory(process.env.BASE_URL),
        routes,
        assetsPublicPath: './'
    }
)

// 使用导航守卫来检查用户登录状态
router.beforeEach((to, from, next) => {
    // 如果页面需要登录权限，则调用 requireAuth 导航守卫函数检查用户登录状态
    if (to.meta.requiresAuth) {
        requireAuth(to, from, next);
    } else {
        // 如果页面不需要登录权限，则直接允许访问
        next();
    }
});

export default router

