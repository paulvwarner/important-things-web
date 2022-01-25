import React, {useContext, useEffect, useState} from 'react';
import {MessageDisplayerUtility} from "./MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "./LeaveWithoutSavingWarningUtility";
import _ from "underscore";
import {GlobalContext} from "../admin-frame/AdminFrame";

export function useCommonFormEffects(
    props, initialModelSpecificState, initialModel, validateData, formStateToSaveData
) {
    const context = useContext(GlobalContext);
    const [formState, setFormState] = useState({
        id: initialModel ? initialModel.id : null,
        invalidFields: {},
        validationErrors: [],
        saved: true,

        ...initialModelSpecificState,
    });

    const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
    const [deactivating, setDeactivating] = useState(false);
    const [saving, setSaving] = useState(false);

    function mergeToFormState(stateChange) {
        if (stateChange) {
            setFormState(
                {
                    ...formState,
                    ...stateChange,
                }
            );
        }
    }

    function mergeUnsavedToFormState(stateChange) {
        LeaveWithoutSavingWarningUtility.enableLeaveWithoutSavingWarnings(
            context,
            props.headerText
        );

        if (stateChange) {
            setFormState(
                {
                    ...formState,
                    ...stateChange,
                    ...{saved: false}
                }
            );
        }
    }

    // display validation errors if they change in state
    useEffect(function () {
        if (formState.validationErrors && formState.validationErrors.length > 0) {
            for (let e = 0; e < formState.validationErrors.length; e++) {
                MessageDisplayerUtility.error(formState.validationErrors[e]);
            }
        }
    }, [formState.validationErrors]);

    function handleValidationResult(validationErrors, invalidFields, resolve) {
        if (validationErrors.length > 0) {
            let stateChange = {
                invalidFields: {},
                validationErrors: validationErrors
            };
            for (let y = 0; y < invalidFields.length; y++) {
                stateChange.invalidFields['' + invalidFields[y] + '_invalid'] = true;
            }
            mergeToFormState(stateChange);
            window.setTimeout(function () {
                resolve(false);
            }, 0)
        } else {
            mergeToFormState({
                invalidFields: {},
                validationErrors: []
            });
            resolve(true);
        }
    }

    function save() {
        setSaving(true);
    }

    function confirmDeactivate() {
        setConfirmingDeactivate(true);
    }

    function cancelDeactivate() {
        setConfirmingDeactivate(false);
    }

    function deactivate() {
        setDeactivating(true);
    }

    useEffect(function () {
        if (saving) {
            validateData()
                .then(function (validationPasses) {
                    if (validationPasses) {
                        let saveData = _.clone(formState);
                        if (formStateToSaveData) {
                            saveData = formStateToSaveData(formState)
                        }
                        props.save(saveData);
                    } else {
                        setSaving(false);
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
        if (deactivating) {
            props.deactivate();
        }
    }, [deactivating]);

    function getFormFieldClasses(originalClasses, fieldName) {
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
            mergeUnsavedToFormState({[fieldName]: event.target.value});
        }
    }

    function handleRadioOptionChange(fieldName, selectedOption) {
        if (selectedOption) {
            mergeUnsavedToFormState({[fieldName]: selectedOption});
        }
    }

    function forceValueToNumeric(fieldName) {
        if (formState[fieldName] !== parseInt(formState[fieldName]) || 0) {
            mergeUnsavedToFormState({[fieldName]: parseInt(formState[fieldName]) || 0});
        }
    }

    return [
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
        forceValueToNumeric,
        mergeToFormState,
        mergeUnsavedToFormState
    ];
}
