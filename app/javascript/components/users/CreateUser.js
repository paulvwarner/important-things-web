import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {UserForm} from "./UserForm";
import {useModelCreateManager} from "../common/hooks/useModelCreateManager";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let CreateUser = function (props) {
    const modelCreateManager = useModelCreateManager(
        ApiUtility.createUser,
        'user',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelCreateManager.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <UserForm
                cancel={props.cancel}
                save={modelCreateManager.createModel}
                isNew={true}
                headerText="New User"
            />
        </Fragment>
    );
};
