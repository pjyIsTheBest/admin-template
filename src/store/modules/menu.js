import util from '../../util/index';
import router from '../../router/index'
export default {
    namespaced: true,
    state: () => {
        return {
            menu: [],
            hasMenuData: false
        }
    },
    mutations: {
        saveMenuData(state, data) {
            state.hasMenuData = true;
            state.menu = data;

        },
        resetMenu(state) {
            state.hasMenuData = false;
            state.menu = [];
        },
        removeMenuData(state) {
            state.menu
                .filter((i) => i.component)
                .forEach((ele) => {
                    router.removeRoute(ele.name);
                });
            state.hasMenuData = false;
            state.menu = [];
        }
    },
}