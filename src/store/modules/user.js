import util from '../../util/index';
import router from '../../router/index'
let session = window.sessionStorage.getItem("userInfo");
let userInfo = session ? JSON.parse(session) : {};
let token = util.getCookie("token");
export default {
    namespaced: true,
    state: () => {
        return {
            userInfo,
            token
        }
    },
    mutations: {
        saveUserInfo(state, info) {
            window.sessionStorage.setItem('userInfo', JSON.stringify(info))
            util.setCookie('token', info.token)
            state.userInfo = info;
            state.token = info.token;
            router.push("/home");
        }
    },
    actions: {},
    getters: {
        name(state) {
            return state.userInfo.name
        }
    }
}