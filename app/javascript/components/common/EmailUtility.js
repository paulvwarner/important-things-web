export let EmailUtility = {
    isValid: function (email) {
        if (email && (('' + email).trim()).length > 0) {
            let emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return emailRegex.test((('' + email).trim()));
        } else {
            return false;
        }
    }
};
