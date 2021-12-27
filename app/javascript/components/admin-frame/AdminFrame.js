import React from "react";
import {withRouter} from 'react-router-dom';
import {CookieUtility} from "../common/CookieUtility";
import {AdminHeader} from "./AdminHeader";

export let GlobalContext = React.createContext({});

export let AdminFrame = withRouter(class extends React.Component {
    constructor(props) {
        super(props);
        var self = this;

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
                </GlobalContext.Provider>
            );
        }
    }
});

