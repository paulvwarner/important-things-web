import React from 'react';
import {Modal} from "../common/Modal";
import {useModelFormEngine} from "../common/hooks/useModelFormEngine";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";
import {CommonFormOptions} from "../common/CommonFormOptions";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

let _ = require('underscore');

export let AffirmationForm = function (props) {
    const affirmation = _.clone(props.affirmation) || null;
    const initialModelState = {
        message: (affirmation && affirmation.message) || '',
        notes: (affirmation && affirmation.notes) || '',
    };
    const formEngine = useModelFormEngine(initialModelState, affirmation, null, validateForm, null, props.save);

    function validateForm(handleValidationResult) {
        return new Promise(function (resolve, reject) {
            let validationErrors = [];
            let invalidFields = [];

            if (!formEngine.state.message) {
                validationErrors.push('Please enter a message.');
                invalidFields.push('message');
            }

            return handleValidationResult(validationErrors, invalidFields, resolve);
        });
    }

    return (
        <Modal
            headerText={props.headerText}
            onClickCloseOption={props.cancel}
        >
            <ConditionalRenderer if={formEngine.state.showOverlayLoadingIndicator} renderer={()=>(
                <OverlayLoadingIndicator/>
            )}/>
            <div className="common-form affirmation-form">
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
                        <CommonFormOptions
                            allowDelete={!props.isNew}
                            onClickCancel={props.cancel}
                            onClickSave={formEngine.onClickSave}
                            onClickDeactivate={props.onClickDeactivate}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};
