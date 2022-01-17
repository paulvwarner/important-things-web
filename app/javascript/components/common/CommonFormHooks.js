import React, {useContext, useEffect, useState} from 'react';
import {MessageDisplayerUtility} from "./MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "./LeaveWithoutSavingWarningUtility";
import _ from "underscore";
import {GlobalContext} from "../admin-frame/AdminFrame";

export function useCommonFormEffects(
    props, initialModelSpecificState, initialModel, validateData
) {
    const context = useContext(GlobalContext);
    const [formState, setFormState] = useState({
        id: initialModel ? initialModel.id : null,
        invalidFields: {},
        validationErrors: [],
        saved: true,

        ...initialModelSpecificState,
    });

    const [saving, setSaving] = useState(false);

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
            mergeFormState(formState, stateChange);
            window.setTimeout(function () {
                resolve(false);
            }, 0)
        } else {
            mergeFormState(
                formState,
                {
                    invalidFields: {},
                    validationErrors: []
                }
            );
            resolve(true);
        }
    }

    function save() {
        setSaving(true);
    }

    useEffect(function () {
        if (saving) {
            validateData()
                .then(function (validationPasses) {
                    if (validationPasses) {
                        props.save(_.clone(formState));
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
            mergeUnsavedFormState(formState, {[fieldName]: event.target.value});
        }
    }

    function forceValueToNumeric(fieldName) {
        if (formState[fieldName] !== parseInt(formState[fieldName]) || 0) {
            mergeUnsavedFormState(formState, {[fieldName]: parseInt(formState[fieldName]) || 0});
        }
    }

    return [
        formState,
        save,
        saving,
        handleValidationResult,
        getFormFieldClasses,
        handleTextFieldChange,
        forceValueToNumeric
    ];
}
