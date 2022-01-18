import React from "react";
import {ApiUtility} from "../common/ApiUtility";
import {CommitmentForm} from "./CommitmentForm";
import {LoadingIndicator} from "../common/LoadingIndicator";
import {useCommonUpdateEffects} from "../common/CommonUpdateHooks";

export let UpdateCommitment = function (props) {
    const [formModel, updateFormModel, deactivateFormModel] = useCommonUpdateEffects(
        props,
        ApiUtility.getCommitment,
        ApiUtility.updateCommitment,
        props.commitmentId,
        'commitment'
    );

    if (formModel) {
        return (
            <CommitmentForm
                cancel={props.cancel}
                save={updateFormModel}
                deactivate={deactivateFormModel}
                commitment={formModel}
                isNew={false}
                headerText="Update Commitment"
            />
        );
    } else {
        return (
            <LoadingIndicator loading={true}/>
        );
    }
};
