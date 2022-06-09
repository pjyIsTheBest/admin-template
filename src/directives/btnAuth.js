import store from "../store";
//按钮权限
export default {
    name: 'btnAuth',
    directive: {
        mounted(el, binding) {
            let { value } = binding;
            let keys = store.state.menu.btnKey;
            // if (keys.includes(value)) {
            //     return true
            // } else {
            //     el.parentNode && el.parentNode.removeChild(el)
            // }
           !keys.includes(value) && el.parentNode && el.parentNode.removeChild(el)
        }
    }
}