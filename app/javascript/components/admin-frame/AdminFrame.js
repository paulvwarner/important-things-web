import React from "react";
import {withRouter} from 'react-router-dom';
import {CookieUtility} from "../common/CookieUtility";

export var GlobalContext = React.createContext({});

export var AdminFrame = withRouter(class extends React.Component {
    constructor(props) {
        super(props);

        var redirectToLogin = false;
        var token = CookieUtility.load("token");

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
        if (this.state.redirectToLogin) {
            return null;
        } else {
            return (
                <GlobalContext.Provider
                    value={this.context}
                >
                    <div className="admin-frame">
                        {this.props.children}
                    </div>
                </GlobalContext.Provider>
            );
        }
    }
});

