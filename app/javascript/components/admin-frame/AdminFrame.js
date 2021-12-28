import React from "react";
import {withRouter} from 'react-router-dom';
import {CookieUtility} from "../common/CookieUtility";
import {CrossComponentValueManager} from "../common/CrossComponentValueManager";
import {AdminHeader} from "./AdminHeader";
import {LeaveWithoutSavingWarningModal} from "../common/LeaveWithoutSavingWarningModal";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";

export let GlobalContext = React.createContext({});

export let AdminFrame = withRouter(class extends React.Component {
    constructor(props) {
        super(props);
        var self = this;

        this.navWarningDisplayValueManager = new CrossComponentValueManager();
        this.navWarningDisplayValueSetter = this.navWarningDisplayValueManager.createValueSetter();

        this.confirmBeforeNavValueManager = new CrossComponentValueManager();
        this.confirmBeforeNavValueSetter = this.confirmBeforeNavValueManager.createValueSetter();

        props.setUserConfirmationFunction(function (message, callback) {
            // this function gets called by BrowserRouter to determine what to show to the user if
            // navigation is blocked by a Prompt. It's meant to return a component for display,
            // but I have it instead triggering an externally-defined component to display (in the
            // same wrapper component as the prompt).

            self.navWarningDisplayValueSetter({
                showLeaveWithoutSavingWarningModal: true,
                getUserConfirmationCallback: function (allowNavigation) {
                    if (allowNavigation) {
                        LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(self.context);
                    }
                    callback(allowNavigation);
                },
            })
        });

        let redirectToLogin = false;
        let token = CookieUtility.load("token");

        // if no token, hard redirect to login page
        if (token === undefined) {
            redirectToLogin = true;
            window.location.assign('/login');
        }

        this.state = {
            redirectToLogin: redirectToLogin
        }
    }

    render = () => {
        var self = this;
        var pathParts = this.props.location.pathname ? this.props.location.pathname.split('/') : [];
        var selectedPagePathSegment;
        if (pathParts.length > 1) {
            selectedPagePathSegment = pathParts[1];
        } else {
            selectedPagePathSegment = ('' + this.props.location.pathname).replace(new RegExp('/', 'g'), '')
        }

        this.context = {
            navigator: {
                navigateTo: function (url) {
                    self.props.history.push(url);
                },
                goBack: function () {
                    if (self.props.history) {
                        self.props.history.goBack()
                    }
                }
            },
            confirmBeforeNavValueManager: this.confirmBeforeNavValueManager,
            navWarningDisplayValueSetter: this.navWarningDisplayValueSetter,
            confirmBeforeNavValueSetter: this.confirmBeforeNavValueSetter,
        };

        if (this.state.redirectToLogin) {
            return null;
        } else {
            return (
                <GlobalContext.Provider
                    value={this.context}
                >
                    <div className="admin-frame">
                        <AdminHeader selectedPagePathSegment={selectedPagePathSegment}/>
                        <div className="admin-page-content">
                            {this.props.children}
                        </div>
                    </div>
                    <LeaveWithoutSavingWarningModal
                        navWarningDisplayValueManager={this.navWarningDisplayValueManager}
                        confirmBeforeNavValueManager={this.confirmBeforeNavValueManager}
                    />
                </GlobalContext.Provider>
            );
        }
    }
});

