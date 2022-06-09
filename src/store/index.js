import { createStore } from 'vuex'

import user from './modules/user'
import menu from './modules/menu'

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