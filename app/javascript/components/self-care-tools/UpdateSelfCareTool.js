import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {SelfCareToolForm} from "./SelfCareToolForm";
import {useModelUpdateEngine} from "../common/hooks/useModelUpdateEngine";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";

export let UpdateSelfCareTool = function (props) {
    const modelUpdateEngine = useModelUpdateEngine(
        ApiUtility.getSelfCareTool,
        ApiUtility.updateSelfCareTool,
        props.selfCareToolId,
        'self-care tool',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelUpdateEngine.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ConditionalRenderer if={modelUpdateEngine.state.model} renderer={() => (
                <SelfCareToolForm
                    cancel={props.cancel}
                    save={modelUpdateEngine.updateModel}
                    onClickDeactivate={modelUpdateEngine.showConfirmDeactivateModal}
                    selfCareTool={modelUpdateEngine.state.model}
                    isNew={false}
                    headerText="Update Self-Care Tool"
                />
            )}/>
            <ConditionalRenderer if={modelUpdateEngine.state.showConfirmDeactivateModal} renderer={() => (
                <ConfirmDeleteModal
                    cancel={modelUpdateEngine.hideConfirmDeactivateModal}
                    deactivate={modelUpdateEngine.deactivateModel}
                    modelTypeName="self-care tool"
                />
            )}/>
        </Fragment>
    );
};
