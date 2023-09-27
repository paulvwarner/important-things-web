import React from 'react';
import {Modal} from "../common/Modal";
import {useModelFormEngine} from "../common/hooks/useModelFormEngine";
import {CommonFormOptions} from "../common/CommonFormOptions";
import {CheckBox} from "../common/CheckBox";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

let _ = require('underscore');

export let NotificationConfigForm = function (props) {
    const notificationConfig = _.clone(props.notificationConfig) || null;
    const initialModelState = {
        notifications_enabled: (notificationConfig && notificationConfig.notifications_enabled) || '',
        active_job_key: (notificationConfig && notificationConfig.active_job_key) || '',
        min_notify_interval_hours: (notificationConfig && notificationConfig.min_notify_interval_hours) || 0,
        max_notify_interval_hours: (notificationConfig && notificationConfig.max_notify_interval_hours) || 0,
    };
    const formEngine = useModelFormEngine(initialModelState, notificationConfig, null, validateForm, null, props.save);

    function validateForm(handleValidationResult) {
        return new Promise(function (resolve, reject) {
            let validationErrors = [];
            let invalidFields = [];

            if (!formEngine.state.min_notify_interval_hours) {
                validationErrors.push('Please enter a minimum notifications interval.');
                invalidFields.push('min_notify_interval_hours');
            }

            if (!formEngine.state.max_notify_interval_hours) {
                validationErrors.push('Please enter a maximum notifications interval.');
                invalidFields.push('max_notify_interval_hours');
            }

            if (!formEngine.state.min_notify_interval_hours > formEngine.state.max_notify_interval_hours) {
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
            <ConditionalRenderer if={formEngine.state.showOverlayLoadingIndicator} renderer={()=>(
                <OverlayLoadingIndicator/>
            )}/>
            <div className="common-form notification-config-form">
                <div className="common-form-body">
                    <div className="common-form-body-row">
                        <div
                            className={formEngine.getFormFieldClasses("common-form-field checkbox-form-field", "notifications_enabled")}>
                            <div
                                className="common-form-field-label"
                            >Notifications enabled
                            </div>
                            <div className="common-form-field-input-container">
                                <CheckBox
                                    testId="notifications_enabled"
                                    fieldName="notifications_enabled"
                                    checked={formEngine.state.notifications_enabled}
                                    onChange={formEngine.handleCheckboxChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="common-form-body-row">
                        <div
                            className={formEngine.getFormFieldClasses("common-form-field", "min_notify_interval_hours")}>
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
                                    value={formEngine.state.min_notify_interval_hours}
                                    onChange={(event) => formEngine.handleTextFieldChange("min_notify_interval_hours", event)}
                                    onBlur={() => formEngine.forceValueToNumeric('min_notify_interval_hours')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="common-form-body-row">
                        <div
                            className={formEngine.getFormFieldClasses("common-form-field", "max_notify_interval_hours")}>
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
                                    value={formEngine.state.max_notify_interval_hours}
                                    onChange={(event) => formEngine.handleTextFieldChange("max_notify_interval_hours", event)}
                                    onBlur={() => formEngine.forceValueToNumeric('max_notify_interval_hours')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="common-form-body-row">
                        <CommonFormOptions
                            allowDelete={false}
                            onClickCancel={props.cancel}
                            onClickSave={formEngine.onClickSave}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};
