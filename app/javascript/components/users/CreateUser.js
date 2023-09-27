import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {UserForm} from "./UserForm";
import {useModelCreateEngine} from "../common/hooks/useModelCreateEngine";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let CreateUser = function (props) {
    const modelCreateEngine = useModelCreateEngine(
        ApiUtility.createUser,
        'user',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelCreateEngine.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <UserForm
                cancel={props.cancel}
                save={modelCreateEngine.createModel}
                isNew={true}
                headerText="New User"
            />
        </Fragment>
    );
};
