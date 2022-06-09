import util from '../../util/index';
import router from '../../router/index'
export default {
    namespaced: true,
    state: () => {
        return {
            menu: [],
            hasMenuData: false,
            btnKey: [],
        }
    },
    getter(state) {
        return state.btnKey
    },
    mutations: {
        saveMenuData(state, data) {
            state.hasMenuData = true;
            //保存非按钮菜单数据
            state.menu = data.filter(i => i.type != 3);
            //保存所有按钮的key
            state.btnKey = data.filter(i => i.type == 3).map(i => i.name)
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
            state.btnKey = [];
        },

    },
}