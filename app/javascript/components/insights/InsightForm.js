import React, {useState} from 'react';
import {PillButton} from "../common/PillButton";
import {Modal} from "../common/Modal";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {ApiUtility} from "../common/ApiUtility";
import {useModelFormEngine} from "../common/hooks/useModelFormEngine";
import {CommonFormOptions} from "../common/CommonFormOptions";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

let _ = require('underscore');

export let InsightForm = function (props) {
    const insight = _.clone(props.insight) || null;

    const initialModelState = {
        message: (insight && insight.message) || '',
        notes: (insight && insight.notes) || '',
        weight: (insight && insight.weight) || 1,
    };
    const formEngine = useModelFormEngine(initialModelState, insight, null, validateForm, null, props.save);
    const [notifying, setNotifying] = useState(false);

    function validateForm(handleValidationResult) {
        return new Promise(function (resolve, reject) {
            let validationErrors = [];
            let invalidFields = [];

            if (!formEngine.state.message) {
                validationErrors.push('Please enter a message.');
                invalidFields.push('message');
            }

            if (
                !formEngine.state.weight ||
                !(parseInt(formEngine.state.weight) || 0) ||
                formEngine.state.weight < 1
            ) {
                validationErrors.push('Please enter a weight of at least 1.');
                invalidFields.push('weight');
            }

            return handleValidationResult(validationErrors, invalidFields, resolve);
        });
    }

    function notifyAppUsersNow() {
        setNotifying(true);
        ApiUtility.notifyInsightNow(formEngine.state.id)
            .then(function () {
                setNotifying(false);
                MessageDisplayerUtility.success("Notified app users.")
            })
            .catch(function (error) {
                setNotifying(false);
                console.log("Error notifying about insight: ", error)
                MessageDisplayerUtility.error("An error occurred while notifying users.")
            });
    }

    return (
        <Modal
            headerText={props.headerText}
            onClickCloseOption={props.cancel}
        >
            <ConditionalRenderer if={formEngine.state.showOverlayLoadingIndicator || notifying} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <div className="common-form insight-form">
                <div className="common-form-body">
                    <div className="common-form-body-row">
                        <div className={formEngine.getFormFieldClasses("common-form-field", "message")}>
                            <div className="common-form-field-label">
                                Message
                            </div>
                            <div className="common-form-field-input-container">
                                <input
                                    id="message"
                                    type="text"
                                    className="common-form-input"
                                    value={formEngine.state.message}
                                    onChange={(event) => formEngine.handleTextFieldChange("message", event)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="common-form-body-row">
                        <div className={formEngine.getFormFieldClasses("common-form-field", "notes")}>
                            <div className="common-form-field-label">
                                Notes
                            </div>
                            <div className="common-form-field-input-container">
                                <textarea
                                    id="notes"
                                    className="common-form-textarea"
                                    value={formEngine.state.notes}
                                    onChange={(event) => formEngine.handleTextFieldChange("notes", event)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="common-form-body-row">
                        <div className={formEngine.getFormFieldClasses("common-form-field", "weight")}>
                            <div className="common-form-field-label">
                                Weight
                            </div>
                            <div className="common-form-field-input-container">
                                <input
                                    id="weight"
                                    type="text"
                                    className="common-form-input insight-weight-input"
                                    value={formEngine.state.weight}
                                    onChange={(event) => formEngine.handleTextFieldChange("weight", event)}
                                    onBlur={() => formEngine.forceValueToNumeric('weight')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="common-form-body-row">
                        <div className="common-form-options">
                            <CommonFormOptions
                                allowDelete={!props.isNew}
                                onClickCancel={props.cancel}
                                onClickSave={formEngine.onClickSave}
                                onClickDeactivate={props.onClickDeactivate}
                                renderAdditionalOptions={function () {
                                    return (
                                        <PillButton
                                            containerClasses="common-form-button-container"
                                            buttonClasses="common-form-button red-button notify-now-button"
                                            onClick={notifyAppUsersNow}
                                            buttonText={"NOTIFY APP USERS NOW"}
                                        />
                                    )
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
