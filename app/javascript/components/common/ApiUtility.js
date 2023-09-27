import React from 'react';
import {CookieUtility} from "./CookieUtility";
import {UrlUtility} from "./UrlUtility";

let _ = require('underscore');

export let ApiUtility = {
    login: function (username, password) {
        return new Promise(function (resolve, reject) {
            jQuery.ajax('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    username: username,
                    password: password
                }),
                success: function (response) {
                    resolve(response);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console && console.error(errorThrown);
                    if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                        reject(jqXHR.responseJSON.message);
                    } else {
                        reject('An error occurred during login.');
                    }
                }
            });
        });
    },

    apiRequest: function (url, options) {
        // fetch from API - pass auth token
        let extendedHeaders = (options && options.headers) || {};
        let token = CookieUtility.load('token');
        extendedHeaders['wwwauthenticate'] = '' + token;

        return new Promise(function (resolve, reject) {
            jQuery.ajax(url,
                _.extend(options || {}, {
                    headers: extendedHeaders,
                    success: function (response, textStatus, jqXHR) {
                        if (jqXHR && jqXHR.status === 401) {
                            window.location.assign('/login');
                        } else if (response.httpStatusCode === 500) {
                            reject(new Error(response.statusText));
                        } else {
                            resolve(response);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (jqXHR && jqXHR.status === 401) {
                            window.location.assign('/login');
                        } else {
                            console && console.log("An error occurred during an API call: ", arguments);
                            reject(new Error(errorThrown));
                        }
                    }
                })
            );
        });
    },

    logout: function () {
        let encodedToken = encodeURIComponent(CookieUtility.load('token'));
        return ApiUtility.apiRequest(`/api/users/${encodedToken}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    },

    getInsightsList: function (pageNumber, searchText) {
        let argumentsArray = [];

        if (pageNumber) {
            argumentsArray.push({label: 'page', value: pageNumber})
        }

        if (searchText) {
            argumentsArray.push({label: 'searchText', value: searchText})
        }

        return ApiUtility.apiRequest(
            `/api/insights${UrlUtility.getUrlQueryString(argumentsArray)}`
        );
    },

    getInsight: function (insightId) {
        return ApiUtility.apiRequest(`/api/insights/${insightId}`);
    },

    createInsight: function (insightData) {
        return ApiUtility.apiRequest(
            '/api/insights/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(insightData),
            }
        );
    },

    updateInsight: function (insightData) {
        return ApiUtility.apiRequest(
            `/api/insights/${insightData.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(insightData)
            }
        );
    },

    notifyInsightNow: function (insightId) {
        return ApiUtility.apiRequest(
            `/api/insights/${insightId}/notify-now`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        );
    },

    getSelfCareToolsList: function (pageNumber, searchText) {
        let argumentsArray = [];

        if (pageNumber) {
            argumentsArray.push({label: 'page', value: pageNumber})
        }

        if (searchText) {
            argumentsArray.push({label: 'searchText', value: searchText})
        }

        return ApiUtility.apiRequest(
            `/api/self-care-tools${UrlUtility.getUrlQueryString(argumentsArray)}`
        );
    },

    getSelfCareTool: function (selfCareToolId) {
        return ApiUtility.apiRequest(`/api/self-care-tools/${selfCareToolId}`);
    },

    createSelfCareTool: function (selfCareToolData) {
        return ApiUtility.apiRequest(
            '/api/self-care-tools/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(selfCareToolData),
            }
        );
    },

    updateSelfCareTool: function (selfCareToolData) {
        return ApiUtility.apiRequest(
            `/api/self-care-tools/${selfCareToolData.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(selfCareToolData)
            }
        );
    },

    getAffirmationsList: function (pageNumber, searchText) {
        let argumentsArray = [];

        if (pageNumber) {
            argumentsArray.push({label: 'page', value: pageNumber})
        }

        if (searchText) {
            argumentsArray.push({label: 'searchText', value: searchText})
        }

        return ApiUtility.apiRequest(
            `/api/affirmations${UrlUtility.getUrlQueryString(argumentsArray)}`
        );
    },

    getAffirmation: function (affirmationId) {
        return ApiUtility.apiRequest(`/api/affirmations/${affirmationId}`);
    },

    createAffirmation: function (affirmationData) {
        return ApiUtility.apiRequest(
            '/api/affirmations/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(affirmationData),
            }
        );
    },

    updateAffirmation: function (affirmationData) {
        return ApiUtility.apiRequest(
            `/api/affirmations/${affirmationData.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(affirmationData)
            }
        );
    },

    getIsPersonEmailAvailable: function (email) {
        return ApiUtility.apiRequest(`/api/users/is-person-email-available/${encodeURIComponent(email)}`);
    },

    getUsersList: function (pageNumber, searchText) {
        let argumentsArray = [];

        if (pageNumber) {
            argumentsArray.push({label: 'page', value: pageNumber})
        }

        if (searchText) {
            argumentsArray.push({label: 'searchText', value: searchText})
        }

        return ApiUtility.apiRequest(
            `/api/users${UrlUtility.getUrlQueryString(argumentsArray)}`
        );
    },

    getUser: function (userId) {
        return ApiUtility.apiRequest(`/api/users/${userId}`);
    },

    createUser: function (userData) {
        return ApiUtility.apiRequest(
            '/api/users/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(userData),
            }
        );
    },

    updateUser: function (userData) {
        return ApiUtility.apiRequest(
            `/api/users/${userData.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(userData)
            }
        );
    },

    getRolesList: function () {
        return ApiUtility.apiRequest('/api/roles');
    },

    getNotificationConfig: function () {
        return ApiUtility.apiRequest('/api/notification-config');
    },

    updateNotificationConfig: function (notificationConfigData) {
        return ApiUtility.apiRequest(
            '/api/notification-config',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(notificationConfigData)
            }
        );
    },
};
