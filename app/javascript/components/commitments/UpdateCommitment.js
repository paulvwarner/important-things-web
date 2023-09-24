import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {CommitmentForm} from "./CommitmentForm";
import {useModelUpdateManager} from "../common/hooks/useModelUpdateManager";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let UpdateCommitment = function (props) {
    const modelUpdateManager = useModelUpdateManager(
        ApiUtility.getCommitment,
        ApiUtility.updateCommitment,
        props.commitmentId,
        'commitment',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelUpdateManager.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ConditionalRenderer if={modelUpdateManager.state.model} renderer={() => (
                <CommitmentForm
                    cancel={props.cancel}
                    save={modelUpdateManager.updateModel}
                    deactivate={modelUpdateManager.deactivateModel}
                    commitment={modelUpdateManager.state.model}
                    isNew={false}
                    headerText="Update Commitment"
                />
            )}/>
        </Fragment>
    );
};
