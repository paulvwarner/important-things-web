import React from 'react';
import {LoadingIndicator} from "../common/LoadingIndicator";
import {PillButton} from "../common/PillButton";
import {Modal} from "../common/Modal";
import {useFormManager} from "../common/hooks/useFormManager";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";
import {CommonFormOptions} from "../common/CommonFormOptions";

let _ = require('underscore');

export let CommitmentForm = function (props) {
    const commitment = _.clone(props.commitment) || null;
    const initialModelState = {
        title: (commitment && commitment.title) || '',
        notes: (commitment && commitment.notes) || '',
    };
    const formManager = useFormManager(initialModelState, commitment, validateData, null, props.save);

    function validateData(handleValidationResult) {
        return new Promise(function (resolve, reject) {
            let validationErrors = [];
            let invalidFields = [];

            if (!formManager.state.title) {
                validationErrors.push('Please enter a title.');
                invalidFields.push('title');
            }

            return handleValidationResult(validationErrors, invalidFields, resolve);
        });
    }

    return (
        <Modal
            headerText={props.headerText}
            onClickCloseOption={props.cancel}
        >
            <div className="common-form commitment-form">
                <div className="common-form-body">
                    <div className="common-form-body-row">
                        <div className={formManager.getFormFieldClasses("common-form-field", "title")}>
                            <div className="common-form-field-label">
                                Title
                            </div>
                            <div className="common-form-field-input-container">
                                <input
                                    id="title"
                                    type="text"
                                    className="common-form-input"
                                    value={formManager.state.title}
                                    onChange={(event) => formManager.handleTextFieldChange("title", event)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="common-form-body-row">
                        <div className={formManager.getFormFieldClasses("common-form-field", "notes")}>
                            <div className="common-form-field-label">
                                Notes
                            </div>
                            <div className="common-form-field-input-container">
                                <textarea
                                    id="notes"
                                    className="common-form-textarea"
                                    value={formManager.state.notes}
                                    onChange={(event) => formManager.handleTextFieldChange("notes", event)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="common-form-body-row">
                        <CommonFormOptions
                            allowDelete={!props.isNew}
                            onClickCancel={props.cancel}
                            onClickSave={formManager.onClickSave}
                            confirmDeactivate={formManager.confirmDeactivate}
                        />
                    </div>
                </div>
                {(() => {
                    if (formManager.confirmingDeactivate) {
                        return (
                            <ConfirmDeleteModal
                                cancel={formManager.cancelDeactivate}
                                deactivate={props.deactivate}
                                modelTypeName="commitment"
                            />
                        );
                    }
                })()}
            </div>
        </Modal>
    );
};
