import React from "react";
import {ApiUtility} from "../common/ApiUtility";
import {AffirmationForm} from "./AffirmationForm";
import {LoadingIndicator} from "../common/LoadingIndicator";
import {useCommonUpdateEffects} from "../common/CommonUpdateHooks";

export let UpdateAffirmation = function (props) {
    const [formModel, updateFormModel, deactivateFormModel] = useCommonUpdateEffects(
        props,
        ApiUtility.getAffirmation,
        ApiUtility.updateAffirmation,
        props.affirmationId,
        'affirmation'
    );

    if (formModel) {
        return (
            <AffirmationForm
                cancel={props.cancel}
                save={updateFormModel}
                deactivate={deactivateFormModel}
                affirmation={formModel}
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
