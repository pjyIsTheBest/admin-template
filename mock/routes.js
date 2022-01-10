export default [
    {
        //菜单类
        type: 0,//0 带单标题，1 菜单页，2 跳转外部链接
        name: '',
        title: '权限管理',//路由标题
        path: '',
        parentId: 0,
        id: 1,
        menu: true,//是否显示在菜单栏
        order: 2,//排序规则 由小到大
    },
    {
        //可访问页面
        type: 1,
        name: 'userList',
        title: '用户列表',
        component: 'system-pages/user-list.vue',
        path: '/config/userList',
        parentId: 1,
        id: 2,
        order: 2,
        menu: true,
        layout: true,//是否为layout子路由
        validate: true,//是否校验登录状态
    },
    {
        type: 1,
        name: 'roleList',
        title: '角色列表',
        component: 'system-pages/role-list.vue',
        path: '/config/roleList',
        parentId: 1,
        id: 3,
        order: 1,
        menu: true,
        layout: true,
        validate: true,
    },
    {
        type: 1,
        name: 'register',
        title: '注册',
        component: 'system-pages/register.vue',
        path: '/register',
        parentId: 0,
        id: 4,
        order: 1,
        menu: false,
        layout: false,
        validate: false,
    },
    {
        type: 1,
        name: 'asyncRoute',
        title: '路由配置',
        component: 'system-pages/asyncRoute.vue',
        path: '/config/asyncRoute',
        parentId: 1,
        id: 5,
        order: 3,
        menu: true,
        layout: true,
        validate: true,
    },
    {
        type: 1,
        name: 'screenConfig',
        title: '大屏配置',
        component: 'system-pages/screenConfig.vue',
        path: '/config/screenConfig',
        parentId: 1,
        id: 6,
        order: 4,
        menu: true,
        layout: true,
        validate: true,
    },
    {
        type:2,
        title:'百度',
        path:'http://www.baidu.com/',
        parentId:1,
        id:7,
        order:1,
        menu:true,
    }
]

