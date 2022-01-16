import React, {useContext, useEffect, useState} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {CommitmentForm} from "./CommitmentForm";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {LoadingIndicator} from "../common/LoadingIndicator";
import {GlobalContext} from "../admin-frame/AdminFrame";

export let UpdateCommitment = function (props) {
    const context = useContext(GlobalContext);
    const [commitment, setCommitment] = useState(null);

    // on mount, fetch commitment from API and put it in state
    useEffect(function () {
        ApiUtility.getCommitment(props.commitmentId)
            .then(function (commitment) {
                setCommitment(commitment);
            })
            .catch(function (error) {
                console.log("Error fetching commitment: ", error);
                MessageDisplayerUtility.error("Error fetching commitment.");
            });
    }, []);

    function updateCommitment(commitmentData) {
        ApiUtility.updateCommitment(commitmentData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success("Successfully updated commitment.");
                if (props.afterSuccessfulSave) {
                    props.afterSuccessfulSave();
                }
            })
            .catch((err) => {
                console && console.error(err);
                MessageDisplayerUtility.error('An error occurred while updating the commitment.');
            });
    }

    if (commitment) {
        return (
            <CommitmentForm
                cancel={props.cancel}
                save={updateCommitment}
                commitment={commitment}
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
