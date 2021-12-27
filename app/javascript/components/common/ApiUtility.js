import React from 'react';
import {CookieUtility} from "./CookieUtility";
import {Constants} from "./Constants";
import {MessageDisplayerUtility} from "./MessageDisplayerUtility";

var _ = require('underscore');

export var ApiUtility = {
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
        var extendedHeaders = (options && options.headers) || {};
        var token = CookieUtility.load('token');
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

    getImportantThingsList: function () {
        return ApiUtility.apiRequest('api/important-things');
    },

    logout: function () {
        return ApiUtility.apiRequest('/api/users/' + encodeURIComponent(CookieUtility.load('token')) + '/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
};
