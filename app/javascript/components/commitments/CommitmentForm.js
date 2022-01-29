import React from 'react';
import {LoadingIndicator} from "../common/LoadingIndicator";
import {PillButton} from "../common/PillButton";
import {Modal} from "../common/Modal";
import {useCommonFormEffects} from "../common/CommonFormHooks";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";
import {CommonFormOptions} from "../common/CommonFormOptions";

let _ = require('underscore');

export let CommitmentForm = function (props) {
    const commitment = _.clone(props.commitment) || null;
    const initialModelState = {
        title: (commitment && commitment.title) || '',
        notes: (commitment && commitment.notes) || '',
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
    ] = useCommonFormEffects(props, initialModelState, commitment, validateData);

    function validateData() {
        return new Promise(function (resolve, reject) {
            let validationErrors = [];
            let invalidFields = [];

            if (!formState.title) {
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
            {(() => {
                if (saving || deactivating) {
                    return (
                        <LoadingIndicator/>
                    );
                } else {
                    return (
                        <div className="common-form commitment-form">
                            <div className="common-form-body">
                                <div className="common-form-body-row">
                                    <div className={getFormFieldClasses("common-form-field", "title")}>
                                        <div className="common-form-field-label">
                                            Title
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="title"
                                                type="text"
                                                className="common-form-input"
                                                value={formState.title}
                                                onChange={handleTextFieldChange.bind(null, "title")}
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
                                                id="notes"
                                                className="common-form-textarea"
                                                value={formState.notes}
                                                onChange={handleTextFieldChange.bind(null, "notes")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <CommonFormOptions
                                        allowDelete={!props.isNew}
                                        cancel={props.cancel}
                                        save={save}
                                        confirmDeactivate={confirmDeactivate}
                                    />
                                </div>
                            </div>
                            {(() => {
                                if (confirmingDeactivate) {
                                    return (
                                        <ConfirmDeleteModal
                                            cancel={cancelDeactivate}
                                            deactivate={deactivate}
                                            modelTypeName="commitment"
                                        />
                                    );
                                }
                            })()}
                        </div>
                    );
                }
            })()}
        </Modal>
    );
};
