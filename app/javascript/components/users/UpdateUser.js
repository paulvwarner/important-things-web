import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {UserForm} from "./UserForm";
import {useModelUpdateEngine} from "../common/hooks/useModelUpdateEngine";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";

export let UpdateUser = function (props) {
    const modelUpdateEngine = useModelUpdateEngine(
        ApiUtility.getUser,
        ApiUtility.updateUser,
        props.userId,
        'user',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelUpdateEngine.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ConditionalRenderer if={modelUpdateEngine.state.model} renderer={() => (
                <UserForm
                    cancel={props.cancel}
                    save={modelUpdateEngine.updateModel}
                    onClickDeactivate={modelUpdateEngine.showConfirmDeactivateModal}
                    user={modelUpdateEngine.state.model}
                    isNew={false}
                    headerText="Update User"
                />
            )}/>
            <ConditionalRenderer if={modelUpdateEngine.state.showConfirmDeactivateModal} renderer={() => (
                <ConfirmDeleteModal
                    cancel={modelUpdateEngine.showConfirmDeactivateModal}
                    deactivate={modelUpdateEngine.deactivateModel}
                    modelTypeName="user"
                />
            )}/>
        </Fragment>
    );
};
