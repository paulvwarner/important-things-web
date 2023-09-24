import React from "react";
import {useHistory} from 'react-router-dom';
import {CookieUtility} from "../common/CookieUtility";
import {CrossComponentValueManager} from "../common/CrossComponentValueManager";
import {AdminHeader} from "./AdminHeader";
import {LeaveWithoutSavingWarningModal} from "../common/LeaveWithoutSavingWarningModal";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";

export let GlobalContext = React.createContext({});

let navWarningDisplayValueManager = new CrossComponentValueManager();
let navWarningDisplayValueSetter = navWarningDisplayValueManager.createValueSetter();

let confirmBeforeNavValueManager = new CrossComponentValueManager();
let confirmBeforeNavValueSetter = confirmBeforeNavValueManager.createValueSetter();

export let AdminFrame = function (props) {
    let token = CookieUtility.load("token");

    // if no token, hard redirect to login page
    if (token === undefined) {
        window.location.assign('/login');
    }

    let history = useHistory();

    props.setUserConfirmationFunction(function (message, callback) {
        // this function gets called by BrowserRouter to determine what to show to the user if
        // navigation is blocked by a Prompt. It's meant to return a component for display,
        // but I have it instead triggering an externally-defined component to display (in the
        // same wrapper component as the prompt).

        navWarningDisplayValueSetter({
            showLeaveWithoutSavingWarningModal: true,
            getUserConfirmationCallback: function (allowNavigation) {
                window.setTimeout(function () {
                    if (allowNavigation) {
                        LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                    }
                    callback(allowNavigation);
                }, 0);
            },
        })
    });

    let context = {
        navigator: {
            navigateTo: function (url) {
                history.push(url);
            },
            goBack: function () {
                history.goBack();
            }
        },
        confirmBeforeNavValueManager: confirmBeforeNavValueManager,
        navWarningDisplayValueSetter: navWarningDisplayValueSetter,
        confirmBeforeNavValueSetter: confirmBeforeNavValueSetter,
    };

    if (token === undefined) {
        return null;
    } else {
        return (
            <GlobalContext.Provider value={context}>
                <div className="admin-frame">
                    <AdminHeader/>
                    <div className="admin-page-content">
                        {props.children}
                    </div>
                </div>
                <LeaveWithoutSavingWarningModal
                    navWarningDisplayValueManager={navWarningDisplayValueManager}
                    confirmBeforeNavValueManager={confirmBeforeNavValueManager}
                />
            </GlobalContext.Provider>
        );
    }
};

