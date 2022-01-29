import React from "react";
import {ApiUtility} from "../common/ApiUtility";
import {NotificationConfigForm} from "./NotificationConfigForm";
import {useCommonUpdateEffects} from "../common/CommonUpdateHooks";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let UpdateNotificationConfig = function (props) {
    const [formModel, updateFormModel, deactivateFormModel] = useCommonUpdateEffects(
        props,
        ApiUtility.getNotificationConfig,
        ApiUtility.updateNotificationConfig,
        null,
        'notification config'
    );

    if (formModel) {
        return (
            <NotificationConfigForm
                cancel={props.cancel}
                save={updateFormModel}
                deactivate={deactivateFormModel}
                notificationConfig={formModel}
                isNew={false}
                headerText="Update Notification Config"
            />
        );
    } else {
        return (
            <OverlayLoadingIndicator/>
        );
    }
};
