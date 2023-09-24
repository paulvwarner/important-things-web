import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {AffirmationForm} from "./AffirmationForm";
import {useModelUpdateManager} from "../common/hooks/useModelUpdateManager";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let UpdateAffirmation = function (props) {
    const modelUpdateManager = useModelUpdateManager(
        ApiUtility.getAffirmation,
        ApiUtility.updateAffirmation,
        props.affirmationId,
        'affirmation',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelUpdateManager.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ConditionalRenderer if={modelUpdateManager.state.model} renderer={() => (
                <AffirmationForm
                    cancel={props.cancel}
                    save={modelUpdateManager.updateModel}
                    deactivate={modelUpdateManager.deactivateModel}
                    affirmation={modelUpdateManager.state.model}
                    isNew={false}
                    headerText="Update Affirmation"
                />
            )}/>
        </Fragment>
    );
};
