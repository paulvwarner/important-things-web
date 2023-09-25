let queryString = require('query-string').default;
let _ = require('underscore');

export let UrlUtility = {
    getUrlQueryString: function (argumentsArray) {
        let queryString = '';
        let separator = '?';

        for (let i = 0; i < argumentsArray.length; i++) {
            let arg = argumentsArray[i];
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
        let queryParams = {};
        if (props.location && props.location.search) {
            queryParams = queryString.parse(props.location.search);
        }
        return queryParams;
    },

    getUrlQueryStringFromQueryParamsObject: function (queryParams) {
        let argumentsArray = [];
        let queryParamNames = _.keys(queryParams);
        for (let i = 0; i < queryParamNames.length; i++) {
            let name = queryParamNames[i];
            argumentsArray.push({
                label: name,
                value: queryParams[name]
            });
        }

        return this.getUrlQueryString(argumentsArray)
    },
};
