import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {SelfCareToolForm} from "./SelfCareToolForm";
import {useModelUpdateManager} from "../common/hooks/useModelUpdateManager";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";

export let UpdateSelfCareTool = function (props) {
    const modelUpdateManager = useModelUpdateManager(
        ApiUtility.getSelfCareTool,
        ApiUtility.updateSelfCareTool,
        props.selfCareToolId,
        'self-care tool',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelUpdateManager.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ConditionalRenderer if={modelUpdateManager.state.model} renderer={() => (
                <SelfCareToolForm
                    cancel={props.cancel}
                    save={modelUpdateManager.updateModel}
                    onClickDeactivate={modelUpdateManager.showConfirmDeactivateModal}
                    selfCareTool={modelUpdateManager.state.model}
                    isNew={false}
                    headerText="Update Self-Care Tool"
                />
            )}/>
            <ConditionalRenderer if={modelUpdateManager.state.showConfirmDeactivateModal} renderer={() => (
                <ConfirmDeleteModal
                    cancel={modelUpdateManager.showConfirmDeactivateModal}
                    deactivate={modelUpdateManager.deactivateModel}
                    modelTypeName="self-care tool"
                />
            )}/>
        </Fragment>
    );
};
