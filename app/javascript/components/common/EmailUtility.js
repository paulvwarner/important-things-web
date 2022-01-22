export var EmailUtility = {
    isValid: function (email) {
        if (email && (('' + email).trim()).length > 0) {
            var emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return emailRegex.test((('' + email).trim()));
        } else {
            return false;
        }
    }
};
