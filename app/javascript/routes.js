import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {AdminFrame} from "./components/admin-frame/AdminFrame";
import {AdminFrameRoot} from "./components/admin-frame/AdminFrameRoot";
import {Login} from "./components/login/Login";
import {ImportantThingsListPage} from "./components/important-things/ImportantThingsListPage";

export default (
    <BrowserRouter>
        <Switch>
            <Route exact path="/login" component={Login}/>

            <AdminFrame>
                <Route exact path="/" component={AdminFrameRoot}/>
                <Switch>
                    <Route exact path="/important-things" component={ImportantThingsListPage}/>
                </Switch>
            </AdminFrame>
        </Switch>
    </BrowserRouter>
);
