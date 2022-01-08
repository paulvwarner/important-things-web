import React, {useContext, useEffect, useState} from 'react';
import {LoadingIndicator} from "../common/LoadingIndicator";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";
import {PillButton} from "../common/PillButton";
import {Modal} from "../common/Modal";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {ApiUtility} from "../common/ApiUtility";
import {GlobalContext} from "../admin-frame/AdminFrame";

let _ = require('underscore');

export let ImportantThingForm = function (props) {
    const context = useContext(GlobalContext);
    const importantThing = _.clone(props.importantThing) || null;

    const [formState, setFormState] = useState({
        id: importantThing ? importantThing.id : null,
        message: (importantThing && importantThing.message) || '',
        notes: (importantThing && importantThing.notes) || '',
        weight: (importantThing && importantThing.weight) || 1,

        invalidFields: {},
        validationErrors: [],
        saved: true,
    });

    const [saving, setSaving] = useState(false);
    const [notifying, setNotifying] = useState(false);

    function mergeFormState(prevState, stateChange) {
        if (stateChange) {
            setFormState(
                {
                    ...prevState,
                    ...stateChange,
                }
            );
        }
    }

    function mergeUnsavedFormState(prevState, stateChange) {
        LeaveWithoutSavingWarningUtility.enableLeaveWithoutSavingWarnings(
            context,
            props.headerText
        );

        if (stateChange) {
            setFormState(
                {
                    ...prevState,
                    ...stateChange,
                    ...{saved: false}
                }
            );
        }
    }

    function displayValidationErrors(validationErrors) {
        for (let e = 0; e < validationErrors.length; e++) {
            MessageDisplayerUtility.error(validationErrors[e]);
        }
    }

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

            if (validationErrors.length > 0) {
                let stateChange = {
                    invalidFields: {},
                    validationErrors: validationErrors
                };
                for (let y = 0; y < invalidFields.length; y++) {
                    stateChange.invalidFields['' + invalidFields[y] + '_invalid'] = true;
                }
                mergeFormState(stateChange);
                resolve(false);
            } else {
                mergeFormState({
                    invalidFields: {},
                    validationErrors: []
                });
                resolve(true);
            }
        });
    }

    function getSubmitData() {
        return _.clone(formState);
    }

    function save() {
        setSaving(true);
    }

    useEffect(function () {
        if (saving) {
            validateData()
                .then(function (validationPasses) {
                    if (validationPasses) {
                        props.save(getSubmitData());
                    } else {
                        setSaving(false);
                        displayValidationErrors(formState.validationErrors);
                    }
                })
                .catch(function (error) {
                    setSaving(false);
                    console.log("Error validating form: ", error);
                    MessageDisplayerUtility.error("An error occurred while saving.")
                });
        }
    }, [saving]);

    useEffect(function () {
        if (notifying) {
            ApiUtility.notifyImportantThingNow(formState.id)
                .then(function () {
                    setNotifying(false);
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

    function getFieldClasses(originalClasses, fieldName) {
        let returnClasses = originalClasses;
        if (Array.isArray(fieldName)) {
            let allValid = true;
            for (let f = 0; f < fieldName.length; f++) {
                if (formState.invalidFields[fieldName[f]] + '_invalid') {
                    allValid = false;
                    break;
                }
            }
            if (!allValid) {
                returnClasses += ' invalid';
            }
        } else {
            if (formState.invalidFields[fieldName + '_invalid']) {
                returnClasses += ' invalid';
            }
        }
        return returnClasses;
    }

    function handleTextFieldChange(fieldName, event) {
        if (event && event.target) {
            mergeUnsavedFormState(formState, {[fieldName]: event.target.value});
        }
    }

    function forceValueToNumeric(fieldName) {
        if (formState[fieldName] !== parseInt(formState[fieldName]) || 0) {
            mergeUnsavedFormState(formState, {[fieldName]: parseInt(formState[fieldName]) || 0});
        }
    }

    return (
        <Modal
            headerText={props.headerText}
            onClickCloseOption={props.cancel}
        >
            {(() => {
                if (saving || notifying) {
                    return (
                        <LoadingIndicator loading={true}/>
                    );
                } else {
                    return (
                        <div className="common-form important-thing-form">
                            <div className="common-form-body">
                                <div className="common-form-body-row">
                                    <div className={getFieldClasses("common-form-field", "message")}>
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
                                    <div className={getFieldClasses("common-form-field", "notes")}>
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
                                    <div className={getFieldClasses("common-form-field", "weight")}>
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
                                            ]
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
                        </div>
                    );
                }
            })()}
        </Modal>
    );

};
