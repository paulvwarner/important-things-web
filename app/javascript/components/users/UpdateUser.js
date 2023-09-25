import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {UserForm} from "./UserForm";
import {useModelUpdateManager} from "../common/hooks/useModelUpdateManager";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";

export let UpdateUser = function (props) {
    const modelUpdateManager = useModelUpdateManager(
        ApiUtility.getUser,
        ApiUtility.updateUser,
        props.userId,
        'user',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelUpdateManager.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ConditionalRenderer if={modelUpdateManager.state.model} renderer={() => (
                <UserForm
                    cancel={props.cancel}
                    save={modelUpdateManager.updateModel}
                    onClickDeactivate={modelUpdateManager.showConfirmDeactivateModal}
                    user={modelUpdateManager.state.model}
                    isNew={false}
                    headerText="Update User"
                />
            )}/>
            <ConditionalRenderer if={modelUpdateManager.state.showConfirmDeactivateModal} renderer={() => (
                <ConfirmDeleteModal
                    cancel={modelUpdateManager.showConfirmDeactivateModal}
                    deactivate={modelUpdateManager.deactivateModel}
                    modelTypeName="user"
                />
            )}/>
        </Fragment>
    );
};
