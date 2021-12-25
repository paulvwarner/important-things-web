import Cookies from 'universal-cookie';

export let CookieUtility = {
    save: function (key, value, params) {
        const cookie = new Cookies();
        cookie.set(key, value, params);
    },

    load: function (key) {
        const cookie = new Cookies();
        return cookie.get(key);
    },

    remove: function (key) {
        const cookie = new Cookies();
        return cookie.remove(key);
    },
};
