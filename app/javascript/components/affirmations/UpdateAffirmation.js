import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {AffirmationForm} from "./AffirmationForm";
import {useModelUpdateEngine} from "../common/hooks/useModelUpdateEngine";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";

export let UpdateAffirmation = function (props) {
    const modelUpdateEngine = useModelUpdateEngine(
        ApiUtility.getAffirmation,
        ApiUtility.updateAffirmation,
        props.affirmationId,
        'affirmation',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelUpdateEngine.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ConditionalRenderer if={modelUpdateEngine.state.model} renderer={() => (
                <AffirmationForm
                    cancel={props.cancel}
                    save={modelUpdateEngine.updateModel}
                    onClickDeactivate={modelUpdateEngine.showConfirmDeactivateModal}
                    affirmation={modelUpdateEngine.state.model}
                    isNew={false}
                    headerText="Update Affirmation"
                />
            )}/>
            <ConditionalRenderer if={modelUpdateEngine.state.showConfirmDeactivateModal} renderer={() => (
                <ConfirmDeleteModal
                    cancel={modelUpdateEngine.showConfirmDeactivateModal}
                    deactivate={modelUpdateEngine.deactivateModel}
                    modelTypeName="affirmation"
                />
            )}/>
        </Fragment>
    );
};
