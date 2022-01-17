import React, {useContext} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {AffirmationForm} from "./AffirmationForm";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";
import {GlobalContext} from "../admin-frame/AdminFrame";

export let CreateAffirmation = function (props) {
    const context = useContext(GlobalContext);

    function createAffirmation(affirmationData, callback) {
        ApiUtility.createAffirmation(affirmationData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success("Successfully created affirmation.");

                if (callback) {
                    callback();
                }
                if (props.afterSuccessfulSave) {
                    props.afterSuccessfulSave();
                }
            })
            .catch((error) => {
                console && console.log(error);
                MessageDisplayerUtility.error('An error occurred while creating the affirmation.');
            })
    }

    return (
        <AffirmationForm
            cancel={props.cancel}
            save={createAffirmation}
            isNew={true}
            headerText="New Affirmation"
        />
    );
};
