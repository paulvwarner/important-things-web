import React from "react";
import {ApiUtility} from "../common/ApiUtility";
import {ImportantThingForm} from "./ImportantThingForm";
import {LoadingIndicator} from "../common/LoadingIndicator";
import {useCommonUpdateEffects} from "../common/CommonUpdateHooks";

export let UpdateImportantThing = function (props) {
    const [formModel, updateFormModel, deactivateFormModel] = useCommonUpdateEffects(
        props,
        ApiUtility.getImportantThing,
        ApiUtility.updateImportantThing,
        props.importantThingId,
        'important thing'
    );

    if (formModel) {
        return (
            <ImportantThingForm
                cancel={props.cancel}
                save={updateFormModel}
                deactivate={deactivateFormModel}
                importantThing={formModel}
                isNew={false}
                headerText="Update Important Thing"
            />
        );
    } else {
        return (
            <LoadingIndicator/>
        );
    }
};
