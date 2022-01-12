import {CookieUtility} from "./CookieUtility";

export let AuthUtility = {
    clearAuthCookies: function () {
        CookieUtility.remove("token");
        CookieUtility.remove("userPersonName");
        CookieUtility.remove("userEmailAddress");
        CookieUtility.remove("userId");
        CookieUtility.remove("permissions");
    }
};
