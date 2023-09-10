let queryString = require('query-string').default;
let _ = require('underscore');

export var UrlUtility = {
    getUrlQueryString: function (argumentsArray) {
        var queryString = '';
        var separator = '?';

        for (var i = 0; i < argumentsArray.length; i++) {
            var arg = argumentsArray[i];
            if (arg.value) {
                queryString += separator + arg.label + '=' + arg.value;
                if (i === 0) {
                    separator = '&';
                }
            }
        }

        return queryString;
    },

    getQueryParamsFromProps: function (props) {
        var queryParams = {};
        if (props.location && props.location.search) {
            queryParams = queryString.parse(props.location.search);
        }
        return queryParams;
    },

    getUrlQueryStringFromQueryParamsObject: function (queryParams) {
        var argumentsArray = [];
        var queryParamNames = _.keys(queryParams);
        for (var i = 0; i < queryParamNames.length; i++) {
            var name = queryParamNames[i];
            argumentsArray.push({
                label: name,
                value: queryParams[name]
            });
        }

        return this.getUrlQueryString(argumentsArray)
    },
};
