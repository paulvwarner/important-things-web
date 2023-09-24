import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {NotificationConfigForm} from "./NotificationConfigForm";
import {useModelUpdateManager} from "../common/hooks/useModelUpdateManager";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export let UpdateNotificationConfig = function (props) {
    const modelUpdateManager = useModelUpdateManager(
        ApiUtility.getNotificationConfig,
        ApiUtility.updateNotificationConfig,
        null,
        'notification config',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelUpdateManager.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ConditionalRenderer if={modelUpdateManager.state.model} renderer={() => (
                <NotificationConfigForm
                    cancel={props.cancel}
                    save={modelUpdateManager.updateModel}
                    deactivate={modelUpdateManager.deactivateModel}
                    notificationConfig={modelUpdateManager.state.model}
                    isNew={false}
                    headerText="Update Notification Config"
                />
            )}/>
        </Fragment>
    );
};
