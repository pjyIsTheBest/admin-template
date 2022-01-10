import { createStore } from 'vuex'

import user from './modules/user'
import menu from './modules/menu'
let token = sessionStorage.getItem("token") || null;

const store = createStore({
    state() {
        return {
            token,
            count:1
        }
    },
    mutations: {
        //保存用户的token
        saveToken(state, { token }) {
            state.token = token;
            sessionStorage.setItem('token', token)
        }
    },
    modules: {
        user,
        menu
    }
})
export default store