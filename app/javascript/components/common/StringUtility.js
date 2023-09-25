export let StringUtility = {
    containsUpperCaseLetter: function (string) {
        return /[A-Z]+/.test(string);
    },

    containsNumber: function (string) {
        return /[\d]+/.test(string);
    },

    containsSpecialCharacter: function (string) {
        return /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]+/.test(string);
    },

    isNullOrEmpty: function (string) {
        return !string || ('' + string).trim() === '';
    }
};
