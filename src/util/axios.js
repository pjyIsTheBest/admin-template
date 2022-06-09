import axios from 'axios'
import { ElMessage } from "element-plus";
import routes from '../router/index'
import store from '../store'

const instance = axios.create({
    baseURL: import.meta.env.VITE_requestUrl,
    timeout: 10000,
    headers: { 'X-Custom-Header': 'foobar' }
});
console.log(import.meta.env.VITE_requestUrl);
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.headers.common['Authorization'] = store.state.user.token;
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    ElMessage.error(response.data.msg || '出错啦！');
    if (response.data.code == 400) {
        routes.push({ name: 'login' })
    } else {
        return response.data;
    }
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default instance