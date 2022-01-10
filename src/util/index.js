export default {
    //获取cookie
    getCookie(key) {
        let result = document.cookie.match(new RegExp(`(?:^|\s)${key}=([^;]*)`));
        return result && result[1]

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