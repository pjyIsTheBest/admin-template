export default {
    //获取cookie
    getCookie(key) {
        let arr,
            reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)"); //匹配字段
        arr = document.cookie.match(reg);
        if (arr) {
            return arr[2];
        } else {
            return null;
        }

    },
    //添加
    setCookie(key, value, expires, domain, path) {
        let now = new Date().getTime();
        let times = expires || 60 * 60 * 1000;
        domain = domain || window.location.hostname;
        path = path || '/';
        document.cookie = key + "=" + value + ';domain=' + domain + ";path=" + path + ";expires=" + (new Date(now + times)).toGMTString();
    },
    //删除
    delCookie(key) {
        let value = this.getCookie(key);
        if (value) {
            this.setCookie(key, value, -1);
        }
    }

}