import React, {useContext, useEffect, useState} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {ImportantThingForm} from "./ImportantThingForm";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {LoadingIndicator} from "../common/LoadingIndicator";
import {GlobalContext} from "../admin-frame/AdminFrame";

export let UpdateImportantThing = function (props) {
    const context = useContext(GlobalContext);
    const [importantThing, setImportantThing] = useState(null);

    // on mount, fetch important thing from API and put it in state
    useEffect(function () {
        ApiUtility.getImportantThing(props.importantThingId)
            .then(function (importantThing) {
                setImportantThing(importantThing);
            })
            .catch(function (error) {
                console.log("Error fetching important thing: ", error);
                MessageDisplayerUtility.error("Error fetching important thing.");
            });
    }, []);

    function updateImportantThing(importantThingData) {
        ApiUtility.updateImportantThing(importantThingData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success("Successfully updated important thing.");
                if (props.afterSuccessfulSave) {
                    props.afterSuccessfulSave();
                }
            })
            .catch((err) => {
                console && console.error(err);
                MessageDisplayerUtility.error('An error occurred while updating the important thing.');
            });
    }

    if (importantThing) {
        return (
            <ImportantThingForm
                cancel={props.cancel}
                save={updateImportantThing}
                importantThing={importantThing}
                isNew={false}
                headerText="Update Important Thing"
            />
        );
    } else {
        return (
            <LoadingIndicator loading={true}/>
        );
    }
};
