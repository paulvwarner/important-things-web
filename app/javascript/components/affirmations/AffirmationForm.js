import React from 'react';
import {LoadingIndicator} from "../common/LoadingIndicator";
import {PillButton} from "../common/PillButton";
import {Modal} from "../common/Modal";
import {useCommonFormEffects} from "../common/CommonFormHooks";

let _ = require('underscore');

export let AffirmationForm = function (props) {
    const affirmation = _.clone(props.affirmation) || null;
    const initialModelState = {
        message: (affirmation && affirmation.message) || '',
        notes: (affirmation && affirmation.notes) || '',
    };

    const [
        formState,
        save,
        saving,
        handleValidationResult,
        getFormFieldClasses,
        handleTextFieldChange,
        forceValueToNumeric
    ] = useCommonFormEffects(props, initialModelState, affirmation, validateData);

    function validateData() {
        return new Promise(function (resolve, reject) {
            let validationErrors = [];
            let invalidFields = [];

            if (!formState.message) {
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
            {(() => {
                if (saving) {
                    return (
                        <LoadingIndicator loading={true}/>
                    );
                } else {
                    return (
                        <div className="common-form affirmation-form">
                            <div className="common-form-body">
                                <div className="common-form-body-row">
                                    <div className={getFormFieldClasses("common-form-field", "message")}>
                                        <div className="common-form-field-label">
                                            Message
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                type="text"
                                                className="common-form-input"
                                                value={formState.message}
                                                onChange={handleTextFieldChange.bind(null, "message")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div className={getFormFieldClasses("common-form-field", "notes")}>
                                        <div className="common-form-field-label">
                                            Notes
                                        </div>
                                        <div className="common-form-field-input-container">
                                                <textarea
                                                    className="common-form-textarea"
                                                    value={formState.notes}
                                                    onChange={handleTextFieldChange.bind(null, "notes")}
                                                />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div className="common-form-options">
                                        <PillButton
                                            containerClasses="common-form-button-container"
                                            buttonClasses="common-form-button cancel-button"
                                            onClick={props.cancel}
                                            buttonText={"CANCEL"}
                                        />,
                                        <PillButton
                                            containerClasses="common-form-button-container"
                                            buttonClasses="common-form-button save-button"
                                            onClick={save}
                                            buttonText={"SAVE"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            })()}
        </Modal>
    );
};
