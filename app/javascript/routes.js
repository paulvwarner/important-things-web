import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {AdminFrame} from "./components/admin-frame/AdminFrame";
import {AdminFrameRoot} from "./components/admin-frame/AdminFrameRoot";
import {Login} from "./components/login/Login";
import {ImportantThingsListPage} from "./components/important-things/ImportantThingsListPage";
import {UsersListPage} from "./components/users/UsersListPage";
import {CommitmentsListPage} from "./components/commitments/CommitmentsListPage";

// placeholder BrowserRouter confirmation function to be overwritten by AdminFrame
var getUserConfirmationFunction = function (message, callback) {
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
                    <Route exact path="/important-things" component={ImportantThingsListPage}/>
                    <Route exact path="/important-things/add"
                           render={
                               function (props) {
                                   return (
                                       <ImportantThingsListPage
                                           {...props}
                                           showAddImportantThingModal={true}
                                       />
                                   );
                               }
                           }
                    />
                    <Route exact path="/important-things/:importantThingId" component={ImportantThingsListPage}/>

                    <Route exact path="/commitments" component={CommitmentsListPage}/>
                    <Route exact path="/commitments/add"
                           render={
                               function (props) {
                                   return (
                                       <CommitmentsListPage
                                           {...props}
                                           showCreateModal={true}
                                       />
                                   );
                               }
                           }
                    />
                    <Route exact path="/commitments/:commitmentId" component={CommitmentsListPage}/>

                    <Route exact path="/users" component={UsersListPage}/>
                </Switch>
            </AdminFrame>
        </Switch>
    </BrowserRouter>
);
