import React, {useEffect, useState} from 'react';
import {LoadingIndicator} from "../common/LoadingIndicator";
import {PillButton} from "../common/PillButton";
import {Modal} from "../common/Modal";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {ApiUtility} from "../common/ApiUtility";
import {useCommonFormEffects} from "../common/CommonFormHooks";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";

let _ = require('underscore');

export let ImportantThingForm = function (props) {
    const importantThing = _.clone(props.importantThing) || null;

    const initialModelState = {
        message: (importantThing && importantThing.message) || '',
        notes: (importantThing && importantThing.notes) || '',
        weight: (importantThing && importantThing.weight) || 1,
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
        forceValueToNumeric
    ] = useCommonFormEffects(props, initialModelState, importantThing, validateData);

    const [notifying, setNotifying] = useState(false);

    function validateData() {
        return new Promise(function (resolve, reject) {
            let validationErrors = [];
            let invalidFields = [];

            if (!formState.message) {
                validationErrors.push('Please enter a message.');
                invalidFields.push('message');
            }

            if (
                !formState.weight ||
                !(parseInt(formState.weight) || 0) ||
                formState.weight < 1
            ) {
                validationErrors.push('Please enter a weight of at least 1.');
                invalidFields.push('weight');
            }

            return handleValidationResult(validationErrors, invalidFields, resolve);
        });
    }

    useEffect(function () {
        if (notifying) {
            ApiUtility.notifyImportantThingNow(formState.id)
                .then(function () {
                    setNotifying(false);
                    MessageDisplayerUtility.success("Notified app users.")
                })
                .catch(function (error) {
                    console.log("Error notifying about important thing: ", error)
                    MessageDisplayerUtility.error("An error occurred while notifying users.")
                    setNotifying(false);
                });
        }
    }, [notifying]);

    function notifyAppUsersNow() {
        setNotifying(true);
    }

    return (
        <Modal
            headerText={props.headerText}
            onClickCloseOption={props.cancel}
        >
            {(() => {
                if (saving || notifying || deactivating) {
                    return (
                        <LoadingIndicator loading={true}/>
                    );
                } else {
                    return (
                        <div className="common-form important-thing-form">
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
                                    <div className={getFormFieldClasses("common-form-field", "weight")}>
                                        <div className="common-form-field-label">
                                            Weight
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                type="text"
                                                className="common-form-input important-thing-weight-input"
                                                value={formState.weight}
                                                onChange={handleTextFieldChange.bind(null, "weight")}
                                                onBlur={forceValueToNumeric.bind(null, 'weight')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div className="common-form-options">
                                        {(() => {
                                            let commonFormOptions = [
                                                <PillButton
                                                    key={1}
                                                    containerClasses="common-form-button-container"
                                                    buttonClasses="common-form-button cancel-button"
                                                    onClick={props.cancel}
                                                    buttonText={"CANCEL"}
                                                />,
                                                <PillButton
                                                    key={2}
                                                    containerClasses="common-form-button-container"
                                                    buttonClasses="common-form-button save-button"
                                                    onClick={save}
                                                    buttonText={"SAVE"}
                                                />
                                            ];
                                            if (props.isNew) {
                                                return commonFormOptions;
                                            } else {
                                                return [
                                                    <div
                                                        key={1}
                                                        className="common-form-options-section common-form-options-left"
                                                    >
                                                        {commonFormOptions}
                                                    </div>,
                                                    <div
                                                        key={2}
                                                        className="common-form-options-section common-form-options-right"
                                                    >
                                                        <PillButton
                                                            containerClasses="common-form-button-container"
                                                            buttonClasses="common-form-button delete-button white-button"
                                                            onClick={confirmDeactivate}
                                                            buttonText={"DELETE"}
                                                        />
                                                        <PillButton
                                                            containerClasses="common-form-button-container"
                                                            buttonClasses="common-form-button red-button"
                                                            onClick={notifyAppUsersNow}
                                                            buttonText={"NOTIFY APP USERS NOW"}
                                                        />
                                                    </div>
                                                ]
                                            }
                                        })()}

                                    </div>
                                </div>
                            </div>
                            {(() => {
                                if (confirmingDeactivate) {
                                    return (
                                        <ConfirmDeleteModal
                                            cancel={cancelDeactivate}
                                            deactivate={deactivate}
                                            modelTypeName="important thing"
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
