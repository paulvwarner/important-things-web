import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {AffirmationForm} from "./AffirmationForm";
import {useModelUpdateManager} from "../common/hooks/useModelUpdateManager";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";

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
                    onClickDeactivate={modelUpdateManager.showConfirmDeactivateModal}
                    affirmation={modelUpdateManager.state.model}
                    isNew={false}
                    headerText="Update Affirmation"
                />
            )}/>
            <ConditionalRenderer if={modelUpdateManager.state.showConfirmDeactivateModal} renderer={() => (
                <ConfirmDeleteModal
                    cancel={modelUpdateManager.showConfirmDeactivateModal}
                    deactivate={modelUpdateManager.deactivateModel}
                    modelTypeName="affirmation"
                />
            )}/>
        </Fragment>
    );
};
