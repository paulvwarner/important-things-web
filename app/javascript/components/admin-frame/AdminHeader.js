import React from "react";
import {ApiUtility} from "../common/ApiUtility";
import {withContext} from "../common/GlobalContextConsumerComponent";
import {Constants} from "../common/Constants";
import {CookieUtility} from "../common/CookieUtility";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";

var _ = require('underscore');

export var AdminHeader = withContext(class extends React.Component {
    logout = (event) => {
        if (event) {
            event.preventDefault();
        }

        var self = this;

        ApiUtility.logout()
            .then(function () {
                self.props.context.navigator.navigateTo('/login');
            })
            .catch(function (err) {
                console && console.error(err);
                MessageDisplayerUtility.error('An error occurred while logging out.');
                self.props.context.navigator.navigateTo('/login');
            });
    };

    render = () => {
        return (
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-header-logo-container">
                        <img
                            src="/static/images/logo.png"
                            className="admin-header-logo"
                        />
                    </div>
                    <div className="admin-header-title-container">
                        <div className="admin-header-title">IMPORTANT THINGS - WEB ADMIN</div>
                    </div>

                    <div className="admin-header-tabs-container">
                        <AdminHeaderTab
                            label="USERS"
                            selected={this.props.selectedPagePathSegment === Constants.pagePathSegments.users}
                            path="/users"
                        />
                        <AdminHeaderTab
                            label="IMPORTANT THINGS"
                            selected={this.props.selectedPagePathSegment === Constants.pagePathSegments.importantThings}
                            path="/important-things"
                        />
                    </div>

                    <div className="admin-header-account-info-container">
                        <div className="admin-header-account-info">
                            <div className="admin-header-username">Logged in
                                as {CookieUtility.load("userPersonName")}</div>
                            <div className="logout-option-container">
                                <div
                                    className="logout-option"
                                    onClick={this.logout}
                                >LOGOUT
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var AdminHeaderTab = withContext(class extends React.Component {
    onClick = () => {
        this.props.context.navigator.navigateTo(this.props.path);
    };

    render = () => {
        var tabClasses = "admin-header-tab ";
        if (this.props.selected) {
            tabClasses += "selected";
        }
        return (
            <div
                onClick={this.onClick}
                className={tabClasses}
            >
                <div
                    className="admin-header-tab-text"
                >{this.props.label}</div>
            </div>
        );
    }
});
