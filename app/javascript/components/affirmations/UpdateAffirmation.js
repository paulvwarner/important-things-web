import React, {useContext, useEffect, useState} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {AffirmationForm} from "./AffirmationForm";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {LoadingIndicator} from "../common/LoadingIndicator";
import {GlobalContext} from "../admin-frame/AdminFrame";

export let UpdateAffirmation = function (props) {
    const context = useContext(GlobalContext);
    const [affirmation, setAffirmation] = useState(null);

    // on mount, fetch affirmation from API and put it in state
    useEffect(function () {
        ApiUtility.getAffirmation(props.affirmationId)
            .then(function (affirmation) {
                setAffirmation(affirmation);
            })
            .catch(function (error) {
                console.log("Error fetching affirmation: ", error);
                MessageDisplayerUtility.error("Error fetching affirmation.");
            });
    }, []);

    function updateAffirmation(affirmationData) {
        ApiUtility.updateAffirmation(affirmationData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success("Successfully updated affirmation.");
                if (props.afterSuccessfulSave) {
                    props.afterSuccessfulSave();
                }
            })
            .catch((err) => {
                console && console.error(err);
                MessageDisplayerUtility.error('An error occurred while updating the affirmation.');
            });
    }

    if (affirmation) {
        return (
            <AffirmationForm
                cancel={props.cancel}
                save={updateAffirmation}
                affirmation={affirmation}
                isNew={false}
                headerText="Update Affirmation"
            />
        );
    } else {
        return (
            <LoadingIndicator loading={true}/>
        );
    }
};
