import React, {useEffect, useState} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {UpdateNotificationConfig} from "./UpdateNotificationConfig";
import {LoadingIndicator} from "../common/LoadingIndicator";

export const NotificationConfigDisplay = function (props) {
    const [notificationConfig, setNotificationConfig] = useState(null);

    useEffect(function () {
        loadNotificationConfig();
    }, [])

    function loadNotificationConfig(callback) {
        ApiUtility.getNotificationConfig()
            .then(function (notificationConfig) {
                setNotificationConfig(notificationConfig);

                if (callback) {
                    callback();
                }
            })
            .catch(function (error) {
                console.log('Error getting notification config:', error);
                MessageDisplayerUtility.error('Error getting notification config.');
            });
    }

    function afterSuccessfulSave() {
        loadNotificationConfig(props.close)
    }

    if (notificationConfig) {
        return (
            <div className="notification-info-wrapper">
                <div
                    className="notification-info-details"
                >{`NOTIFICATIONS ${notificationConfig.notifications_enabled ? 'ENABLED' : 'DISABLED'} - `}</div>
                <div
                    className="notification-info-link"
                    onClick={props.goToNotificationConfigModal}
                >EDIT
                </div>
                {(() => {
                    if (props.showNotificationConfigModal) {
                        return (
                            <UpdateNotificationConfig
                                cancel={props.close}
                                afterSuccessfulSave={afterSuccessfulSave}
                            />
                        );
                    }
                })()}
            </div>
        );
    } else {
        return (
            <LoadingIndicator additionalClasses="tiny-loading-indicator"/>
        );
    }
};
