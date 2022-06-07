import { createStore } from 'vuex'

import user from './modules/user'
import menu from './modules/menu'
let token = sessionStorage.getItem("token") || null;

const store = createStore({
    state() {
        return {}
    },
    mutations: {},

    modules: {
        user,
        menu
    }
})
export default store