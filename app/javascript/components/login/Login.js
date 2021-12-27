import React from "react";
import {withRouter} from 'react-router-dom';
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {CookieUtility} from "../common/CookieUtility";
import {Constants} from "../common/Constants";
import {PillButton} from "../common/PillButton";
import {ApiUtility} from "../common/ApiUtility";

let _ = require('underscore');

export let Login = withRouter(class extends React.Component {
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

        ApiUtility.login(this.state.username, this.state.password)
            .then(function (response) {
                if (response.user && response.user.authentication_token) {
                    let permissionNames = _.pluck(response.permissions || [], 'name');

                    if (_.includes(permissionNames, Constants.permissionNames.canAccessWebAdmin)) {
                        let cookieParams = {
                            path: '/',
                            expires: new Date(2999, 1, 1, 0, 0, 1)
                        };

                        self.clearCookies();
                        CookieUtility.save("token", response.user.authentication_token, cookieParams);
                        CookieUtility.save("userPersonName", response.user.person.name, cookieParams);
                        CookieUtility.save("userEmailAddress", response.user.person.email, cookieParams);
                        CookieUtility.save("userId", response.user.id, cookieParams);
                        CookieUtility.save("permissionNames", permissionNames, cookieParams);

                        self.props.history.push('/');
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
    };

    handleTextFieldChange = (fieldName, event) => {
        this.setState({[fieldName]: event.target.value});
    };

    render = () => {
        return (
            <div className="login-page">
                <div className="login-page-content">
                    <form className="login-form" onSubmit={this.login}>
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
                            <button className="login-button">
                                <PillButton
                                    onClick={this.login}
                                    buttonText="LOGIN"
                                />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
});
