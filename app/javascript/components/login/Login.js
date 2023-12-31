import React, {useState} from "react";
import {useHistory} from 'react-router-dom';
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {CookieUtility} from "../common/CookieUtility";
import {Constants} from "../common/Constants";
import {PillButton} from "../common/PillButton";
import {ApiUtility} from "../common/ApiUtility";
import {AuthUtility} from "../common/AuthUtility";

let _ = require('underscore');

export let Login = function (props) {
    let history = useHistory();

    const [formState, setFormState] = useState({
        username: '',
        password: ''
    });

    function mergeToFormState(stateChange) {
        if (stateChange) {
            setFormState(
                {
                    ...formState,
                    ...stateChange,
                }
            );
        }
    }

    function login(event) {
        if (event) {
            event.preventDefault();
        }

        ApiUtility.login(formState.username, formState.password)
            .then(function (response) {
                if (response.user && response.user.authentication_token) {
                    let permissionNames = _.pluck(response.permissions || [], 'name');

                    if (_.includes(permissionNames, Constants.permissionNames.canAccessWebAdmin)) {
                        let cookieParams = {
                            path: '/',
                            expires: new Date(2999, 1, 1, 0, 0, 1)
                        };

                        AuthUtility.clearAuthCookies();
                        CookieUtility.save("token", response.user.authentication_token, cookieParams);
                        CookieUtility.save("userPersonName", response.user.person.name, cookieParams);
                        CookieUtility.save("userEmailAddress", response.user.person.email, cookieParams);
                        CookieUtility.save("userId", response.user.id, cookieParams);
                        CookieUtility.save("permissionNames", permissionNames, cookieParams);

                        history.push('/');
                    } else {
                        MessageDisplayerUtility.error('User does not have web admin access.');
                    }
                } else {
                    MessageDisplayerUtility.error('Incorrect username or password.');
                }
            })
            .catch(function (errorMessage) {
                MessageDisplayerUtility.error(errorMessage);
            });
    }

    function handleTextFieldChange(fieldName, event) {
        mergeToFormState({[fieldName]: event.target.value});
    }

    return (
        <div className="login-page">
            <div className="login-page-content">
                <form className="login-form" onSubmit={login}>
                    <div className="login-box">
                        <div className="login-logo-container">
                            <img
                                src="/static/images/logo.png"
                                className="login-logo"
                            />
                        </div>
                        <div className="login-header">IMPORTANT THINGS</div>
                        <div className="login-field">
                            <input
                                id="usernameInput"
                                autoFocus={true}
                                className="common-form-input login-input"
                                type="text"
                                placeholder="Email Address"
                                onChange={(event) => handleTextFieldChange('username', event)}
                                value={formState.username}
                            />
                        </div>
                        <div className="login-field">
                            <input
                                id="passwordInput"
                                className="common-form-input login-input"
                                type="password"
                                placeholder="Password"
                                onChange={(event) => handleTextFieldChange('password', event)}
                                value={formState.password}
                            />
                        </div>
                        <button className="login-button">
                            <PillButton
                                onClick={login}
                                buttonText="LOGIN"
                            />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
