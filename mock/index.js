import routesTree from './routes'

export default [
    {
        url: "/api/login",
        method: "post",
        response: ({ body }) => {
            if (body.name == 'admin' && body.password == '123456') {
                return {
                    code: 200,
                    message: "登录成功",
                    data: 'ok'
                };
            } else {
                return {
                    code: 201,
                    message: "账号或密码错误",
                    data: null
                };
            }

        }
    },
    {
        url: "/api/menus",
        method: "get",
        response: (resques) => {
            if (resques.headers.authorization != 'null') {
                return {
                    code: 200,
                    message: '成功',
                    data: routesTree
                }
            } else {
                return {
                    code: 201,
                    message: '失败',
                    data: null
                }
            }

        }
    },
    {
        url: '/api/getUserInfo',
        method: 'get',
        response: () => {
            return {
                code: 200,
                data: {
                    name: '彭江勇',
                    account: 'admin',
                    age: '28',
                    id: 1
                },
                message: '获取用户信息成功'
            }
        }
    }
];

