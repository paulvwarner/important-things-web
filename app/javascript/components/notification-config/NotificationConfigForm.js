import React, {useEffect, useState} from 'react';
import {LoadingIndicator} from "../common/LoadingIndicator";
import {PillButton} from "../common/PillButton";
import {Modal} from "../common/Modal";
import {useCommonFormEffects} from "../common/CommonFormHooks";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";
import {CommonFormOptions} from "../common/CommonFormOptions";
import {ApiUtility} from "../common/ApiUtility";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {CheckBox} from "../common/CheckBox";

let _ = require('underscore');

export let NotificationConfigForm = function (props) {
    const notificationConfig = _.clone(props.notificationConfig) || null;
    const initialModelState = {
        notifications_enabled: (notificationConfig && notificationConfig.notifications_enabled) || '',
        active_job_key: (notificationConfig && notificationConfig.active_job_key) || '',
        min_notify_interval_hours: (notificationConfig && notificationConfig.min_notify_interval_hours) || 0,
        max_notify_interval_hours: (notificationConfig && notificationConfig.max_notify_interval_hours) || 0,
    };

    const [
        formState,
        save,
        saving,
        deactivate,
        deactivating,
        confirmDeactivate,
        confirmingDeactivate,
        cancelDeactivate,
        handleValidationResult,
        getFormFieldClasses,
        handleTextFieldChange,
        handleRadioOptionChange,
        handleCheckboxChange,
        forceValueToNumeric,
    ] = useCommonFormEffects(props, initialModelState, notificationConfig, validateData);

    function validateData() {
        return new Promise(function (resolve, reject) {
            let validationErrors = [];
            let invalidFields = [];

            if (!formState.min_notify_interval_hours) {
                validationErrors.push('Please enter a minimum notifications interval.');
                invalidFields.push('min_notify_interval_hours');
            }

            if (!formState.max_notify_interval_hours) {
                validationErrors.push('Please enter a maximum notifications interval.');
                invalidFields.push('max_notify_interval_hours');
            }

            if (!formState.min_notify_interval_hours > formState.max_notify_interval_hours) {
                validationErrors.push('Minimum notifications interval must be less than maximum notifications interval.');
                invalidFields.push('min_notify_interval_hours');
                invalidFields.push('max_notify_interval_hours');
            }

            return handleValidationResult(validationErrors, invalidFields, resolve);
        });
    }

    return (
        <Modal
            boxClass="notification-config-modal"
            headerText={props.headerText}
            onClickCloseOption={props.cancel}
        >
            {(() => {
                if (saving) {
                    return (
                        <LoadingIndicator/>
                    );
                } else {
                    return (
                        <div className="common-form notification-config-form">
                            <div className="common-form-body">
                                <div className="common-form-body-row">
                                    <div
                                        className={getFormFieldClasses("common-form-field checkbox-form-field", "notifications_enabled")}>
                                        <div
                                            className="common-form-field-label"
                                        >Notifications enabled
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <CheckBox
                                                testId="notifications_enabled"
                                                fieldName="notifications_enabled"
                                                checked={formState.notifications_enabled}
                                                onChange={handleCheckboxChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div
                                        className={getFormFieldClasses("common-form-field", "min_notify_interval_hours")}>
                                        <div
                                            className="common-form-field-label"
                                            title="Minimum interval between notifications in hours."
                                        >Min interval (hours)
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="min_notify_interval_hours"
                                                type="text"
                                                className="common-form-input"
                                                value={formState.min_notify_interval_hours}
                                                onChange={handleTextFieldChange.bind(null, "min_notify_interval_hours")}
                                                onBlur={forceValueToNumeric.bind(null, 'min_notify_interval_hours')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div
                                        className={getFormFieldClasses("common-form-field", "max_notify_interval_hours")}>
                                        <div
                                            className="common-form-field-label"
                                            title="Maximum interval between notifications in hours."
                                        >Max interval (hours)
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="max_notify_interval_hours"
                                                type="text"
                                                className="common-form-input"
                                                value={formState.max_notify_interval_hours}
                                                onChange={handleTextFieldChange.bind(null, "max_notify_interval_hours")}
                                                onBlur={forceValueToNumeric.bind(null, 'max_notify_interval_hours')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <CommonFormOptions
                                        allowDelete={false}
                                        cancel={props.cancel}
                                        save={save}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                }
            })()}
        </Modal>
    );
};
