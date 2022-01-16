import React, {useContext} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {CommitmentForm} from "./CommitmentForm";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";
import {GlobalContext} from "../admin-frame/AdminFrame";

export let CreateCommitment = function (props) {
    const context = useContext(GlobalContext);

    function createCommitment(commitmentData, callback) {
        ApiUtility.createCommitment(commitmentData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success("Successfully created commitment.");

                if (callback) {
                    callback();
                }
                if (props.afterSuccessfulSave) {
                    props.afterSuccessfulSave();
                }
            })
            .catch((error) => {
                console && console.log(error);
                MessageDisplayerUtility.error('An error occurred while creating the commitment.');
            })
    }

    return (
        <CommitmentForm
            cancel={props.cancel}
            save={createCommitment}
            isNew={true}
            headerText="New Commitment"
        />
    );
};
