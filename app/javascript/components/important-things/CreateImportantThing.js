import React, {useContext} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {ImportantThingForm} from "./ImportantThingForm";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";
import {GlobalContext} from "../admin-frame/AdminFrame";

export let CreateImportantThing = function (props) {
    const context = useContext(GlobalContext);

    function createImportantThing(importantThingData, callback) {
        ApiUtility.createImportantThing(importantThingData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success("Successfully created important thing.");

                if (callback) {
                    callback();
                }
                if (props.afterSuccessfulSave) {
                    props.afterSuccessfulSave();
                }
            })
            .catch((error) => {
                console && console.log(error);
                MessageDisplayerUtility.error('An error occurred while creating the important thing.');
            })
    }

    return (
        <ImportantThingForm
            cancel={props.cancel}
            save={createImportantThing}
            isNew={true}
            headerText="New Important Thing"
        />
    );

};
