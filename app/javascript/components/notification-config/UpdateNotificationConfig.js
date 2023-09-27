import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {NotificationConfigForm} from "./NotificationConfigForm";
import {useModelUpdateEngine} from "../common/hooks/useModelUpdateEngine";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";

export let UpdateNotificationConfig = function (props) {
    const modelUpdateEngine = useModelUpdateEngine(
        ApiUtility.getNotificationConfig,
        ApiUtility.updateNotificationConfig,
        null,
        'notification config',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelUpdateEngine.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ConditionalRenderer if={modelUpdateEngine.state.model} renderer={() => (
                <NotificationConfigForm
                    cancel={props.cancel}
                    save={modelUpdateEngine.updateModel}
                    onClickDeactivate={modelUpdateEngine.showConfirmDeactivateModal}
                    notificationConfig={modelUpdateEngine.state.model}
                    isNew={false}
                    headerText="Update Notification Config"
                />
            )}/>
        </Fragment>
    );
};
