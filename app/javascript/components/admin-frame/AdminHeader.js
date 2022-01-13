import React, {useContext} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {Constants} from "../common/Constants";
import {CookieUtility} from "../common/CookieUtility";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {GlobalContext} from "./AdminFrame";
import {AuthUtility} from "../common/AuthUtility";
import {useLocation} from "react-router-dom";

export let AdminHeader = function (props) {
    const context = useContext(GlobalContext);

    function logout(event) {
        if (event) {
            event.preventDefault();
        }

        AuthUtility.clearAuthCookies();

        ApiUtility.logout()
            .then(function () {
                context.navigator.navigateTo('/login');
            })
            .catch(function (err) {
                console && console.error(err);
                MessageDisplayerUtility.error('An error occurred while logging out.');
                context.navigator.navigateTo('/login');
            });
    }

    let location = useLocation();
    var pathParts = location.pathname ? location.pathname.split('/') : [];
    var selectedPagePathSegment;
    if (pathParts.length > 1) {
        selectedPagePathSegment = pathParts[1];
    } else {
        selectedPagePathSegment = ('' + location.pathname).replace(new RegExp('/', 'g'), '')
    }

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
                        selected={selectedPagePathSegment === Constants.pagePathSegments.users}
                        path="/users"
                    />
                    <AdminHeaderTab
                        label="IMPORTANT THINGS"
                        selected={selectedPagePathSegment === Constants.pagePathSegments.importantThings}
                        path="/important-things"
                    />
                </div>

                <div className="admin-header-account-info-container">
                    <div className="admin-header-account-info">
                        <div
                            className="admin-header-username"
                        >Logged in as {CookieUtility.load("userPersonName")}
                        </div>
                        <div className="logout-option-container">
                            <div
                                className="logout-option"
                                onClick={logout}
                            >LOGOUT
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

let AdminHeaderTab = function (props) {
    const context = useContext(GlobalContext);

    function onClick() {
        context.navigator.navigateTo(props.path);
    }

    let tabClasses = "admin-header-tab ";
    if (props.selected) {
        tabClasses += "selected";
    }

    return (
        <div
            onClick={onClick}
            className={tabClasses}
        >
            <div
                className="admin-header-tab-text"
            >{props.label}</div>
        </div>
    );
};
