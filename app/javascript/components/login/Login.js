import React from "react";
import {withRouter} from 'react-router-dom';
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {CookieUtility} from "../common/CookieUtility";
import {Constants} from "../common/Constants";

var _ = require('underscore');

export var Login = withRouter(class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };
    }

    clearCookies = () => {
        CookieUtility.remove("token");
        CookieUtility.remove("userPersonName");
        CookieUtility.remove("userEmailAddress");
        CookieUtility.remove("userId");
        CookieUtility.remove("permissions");
    };

    login = (event) => {
        if (event) {
            event.preventDefault();
        }

        let self = this;

        jQuery.ajax('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
            success: function (data) {
                if (data.user && data.user.authentication_token) {
                    var permissionNames = _.pluck(data.permissions || [], 'name');

                    if (_.includes(permissionNames, Constants.permissionNames.canAccessWebAdmin)) {
                        var cookieParams = {
                            path: '/',
                            expires: new Date(2999, 1, 1, 0, 0, 1)
                        };

                        self.clearCookies();
                        CookieUtility.save("token", data.user.authentication_token, cookieParams);
                        CookieUtility.save("userPersonName", data.user.person.name, cookieParams);
                        CookieUtility.save("userEmailAddress", data.user.person.email, cookieParams);
                        CookieUtility.save("userId", data.user.id, cookieParams);
                        CookieUtility.save("permissionNames", permissionNames, cookieParams);

                        self.props.history.push('/');
                    } else {
                        MessageDisplayerUtility.error('User does not have web admin access.');
                    }
                } else {
                    MessageDisplayerUtility.error('Incorrect username or password.');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console && console.error(errorThrown);
                if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                    MessageDisplayerUtility.error(jqXHR.responseJSON.message);
                } else {
                    MessageDisplayerUtility.error('An error occurred during login.');
                }
            }
        });
    };

    handleTextFieldChange = (fieldName, event) => {
        var stateChange = {[fieldName]: event.target.value};
        this.setState(stateChange);
    };

    render = () => {
        return (
            <div className="login-page">
                <div className="login-page-content">
                    <form className="login-form" onSubmit={this.login}>
                        <div className="login-box">
                            <div className="login-field">
                                <input
                                    autoFocus={true}
                                    className="common-form-input login-input"
                                    type="text"
                                    placeholder="Email Address"
                                    onChange={this.handleTextFieldChange.bind(this, 'username')}
                                    value={this.state.username}
                                />
                            </div>
                            <div className="login-field">
                                <input
                                    className="common-form-input login-input"
                                    type="password"
                                    placeholder="Password"
                                    onChange={this.handleTextFieldChange.bind(this, 'password')}
                                    value={this.state.password}
                                />
                            </div>
                            <button className="submit-button">LOGIN</button>
                            {/* pvw todo common button */}
                        </div>
                    </form>
                </div>
            </div>
        );
    };
});
