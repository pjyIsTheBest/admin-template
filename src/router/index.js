import { createRouter, createWebHistory } from 'vue-router'
import api from '../views/system-pages/api'
import store from '../store/index'
const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('../views/system-pages/login.vue'),
        meta: { title: '登录' }
    },
    {
        name: 'home',
        path: '/home',
        redirect: '/home/index',
        component: () => import('../views/system-pages/layout.vue'),
        children: [
            {
                name: 'home',
                path: '/home/index',
                component: () => import('../views/system-pages/home.vue'),
                meta: {
                    title: '首页',
                    validate: true
                }
            },
        ],

    },
    {
        name: '404',
        path: '/404',
        component: () => import('../views/system-pages/404.vue'),
        meta: { title: '404' }
    }
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

const modules = import.meta.glob("../views/**/**.vue")
//动态注册路由
const addAsyncRoute = (menu) => {
    menu
        .filter((i) => i.type == 1 && i.component && i.layout == 1)
        .forEach((ele) => {
            router.addRoute("home", {
                name: ele.name,
                path: ele.path,
                component: modules[`../views/${ele.component}`],
                meta: {
                    title: ele.title,
                    validate: ele.validate,
                },
            });
        });
    //全局路由
    menu
        .filter((i) => i.type == 1 && i.component && i.layout == 0)
        .forEach((ele) => {
            router.addRoute({
                name: ele.name,
                path: ele.path,
                component: modules[`../views/${ele.component}`],
                meta: {
                    title: ele.title,
                    validate: ele.validate,
                },
            });
        });
    // router.addRoute({
    //     path: '/*',
    //     redirect: '/404',

    // })

}
//全局导航守卫 校验登录
router.beforeEach((to, from, next) => {
    if ((to.matched.length == 0 || to.matched[0].name == 'home') && !store.state.menu.hasMenuData) {
        //获取菜单
        api.getMenus().then(res => {
            if (res.code == 200) {
                store.commit("menu/saveMenuData", res.data)
                addAsyncRoute(res.data)
                if (to.meta.validate == 1) {
                    let token = store.state.user.token;
                    if (token) {
                        next(to.fullPath)
                    } else {
                        next({ name: 'login' })
                    }
                } else {
                    next(to.fullPath)
                }
            } else {
                next({ name: 'login' })
            }


        }).catch(() => {
            next({ name: 'login' })
        })
    } else {
        if (to.matched.length > 0) {
            if (to.meta.validate) {
                let token = store.state.user.token;
                if (token) {
                    next()
                } else {
                    next({ name: 'login' })
                }
            } else {
                next()
            }
        } else {
            router.replace({ name: '404' })
        }


    }

})
export default router