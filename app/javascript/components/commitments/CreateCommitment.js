import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {CommitmentForm} from "./CommitmentForm";
import {useModelCreateManager} from "../common/hooks/useModelCreateManager";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let CreateCommitment = function (props) {
    const modelCreateManager = useModelCreateManager(
        ApiUtility.createCommitment,
        'commitment',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelCreateManager.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <CommitmentForm
                cancel={props.cancel}
                save={modelCreateManager.createModel}
                isNew={true}
                headerText="New Commitment"
            />
        </Fragment>
    );
};
