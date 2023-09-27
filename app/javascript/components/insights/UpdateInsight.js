import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {InsightForm} from "./InsightForm";
import {useModelUpdateEngine} from "../common/hooks/useModelUpdateEngine";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";

export let UpdateInsight = function (props) {
    const modelUpdateEngine = useModelUpdateEngine(
        ApiUtility.getInsight,
        ApiUtility.updateInsight,
        props.insightId,
        'insight',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelUpdateEngine.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ConditionalRenderer if={modelUpdateEngine.state.model} renderer={() => (
                <InsightForm
                    cancel={props.cancel}
                    save={modelUpdateEngine.updateModel}
                    onClickDeactivate={modelUpdateEngine.showConfirmDeactivateModal}
                    insight={modelUpdateEngine.state.model}
                    isNew={false}
                    headerText="Update Insight"
                />
            )}/>
            <ConditionalRenderer if={modelUpdateEngine.state.showConfirmDeactivateModal} renderer={() => (
                <ConfirmDeleteModal
                    cancel={modelUpdateEngine.showConfirmDeactivateModal}
                    deactivate={modelUpdateEngine.deactivateModel}
                    modelTypeName="insight"
                />
            )}/>
        </Fragment>
    );
};
