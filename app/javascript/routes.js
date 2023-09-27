import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {AdminFrame} from "./components/admin-frame/AdminFrame";
import {AdminFrameRoot} from "./components/admin-frame/AdminFrameRoot";
import {Login} from "./components/login/Login";
import {InsightsListPage} from "./components/insights/InsightsListPage";
import {UsersListPage} from "./components/users/UsersListPage";
import {SelfCareToolsListPage} from "./components/self-care-tools/SelfCareToolsListPage";
import {AffirmationsListPage} from "./components/affirmations/AffirmationsListPage";

// placeholder BrowserRouter confirmation function to be overwritten by AdminFrame
let getUserConfirmationFunction = function (message, callback) {
    const allowTransition = window.confirm(message);
    callback(allowTransition);
};

// get the currently defined user confirmation function
function getUserConfirmationFunctionWrapper(message, callback) {
    return getUserConfirmationFunction(message, callback);
}

export default (
    <BrowserRouter getUserConfirmation={getUserConfirmationFunctionWrapper}>
        <Switch>
            <Route exact path="/login" component={Login}/>

            <AdminFrame setUserConfirmationFunction={function (functionToUse) {
                getUserConfirmationFunction = functionToUse
            }}>
                <Route exact path="/" component={AdminFrameRoot}/>
                <Switch>
                    <Route exact path="/insights" component={InsightsListPage}/>
                    <Route exact path="/insights/add"
                           render={
                               function (props) {
                                   return (
                                       <InsightsListPage
                                           {...props}
                                           showCreateModal={true}
                                       />
                                   );
                               }
                           }
                    />
                    <Route exact path="/insights/notification-config"
                           render={
                               function (props) {
                                   return (
                                       <InsightsListPage
                                           {...props}
                                           showNotificationConfigModal={true}
                                       />
                                   );
                               }
                           }
                    />
                    <Route exact path="/insights/:insightId" component={InsightsListPage}/>

                    <Route exact path="/self-care-tools" component={SelfCareToolsListPage}/>
                    <Route exact path="/self-care-tools/add"
                           render={
                               function (props) {
                                   return (
                                       <SelfCareToolsListPage
                                           {...props}
                                           showCreateModal={true}
                                       />
                                   );
                               }
                           }
                    />
                    <Route exact path="/self-care-tools/:selfCareToolId" component={SelfCareToolsListPage}/>


                    <Route exact path="/affirmations" component={AffirmationsListPage}/>
                    <Route exact path="/affirmations/add"
                           render={
                               function (props) {
                                   return (
                                       <AffirmationsListPage
                                           {...props}
                                           showCreateModal={true}
                                       />
                                   );
                               }
                           }
                    />
                    <Route exact path="/affirmations/:affirmationId" component={AffirmationsListPage}/>


                    <Route exact path="/users" component={UsersListPage}/>
                    <Route exact path="/users/add"
                           render={
                               function (props) {
                                   return (
                                       <UsersListPage
                                           {...props}
                                           showCreateModal={true}
                                       />
                                   );
                               }
                           }
                    />
                    <Route exact path="/users/:userId" component={UsersListPage}/>
                </Switch>
            </AdminFrame>
        </Switch>
    </BrowserRouter>
);
