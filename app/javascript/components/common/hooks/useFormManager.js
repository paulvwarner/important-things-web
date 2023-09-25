import React, {useContext, useEffect, useReducer, useState} from 'react';
import {MessageDisplayerUtility} from "../MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "../LeaveWithoutSavingWarningUtility";
import _ from "underscore";
import {GlobalContext} from "../../admin-frame/AdminFrame";

function reducer(state, action) {
    switch (action.type) {
        case 'failed_validation': {
            return {
                ...state,
                invalidFields: action.invalidFields,
                validationErrors: action.validationErrors
            }
        }
        case 'passed_validation': {
            return {
                ...state,
                invalidFields: {},
                validationErrors: []
            }
        }
        case 'user_updated_field': {
            return {
                ...state,
                [action.fieldName]: action.value,
                saved: false
            }
        }
        case 'auto_updated_field': {
            return {
                ...state,
                saved: false
            }
        }
    }
    throw Error('Unknown action: ' + action.type);
}

export function useFormManager(
    initialModelSpecificState, initialModel, validateData, formStateToSaveData, save
) {
    const context = useContext(GlobalContext);
    const initialState = {
        id: initialModel ? initialModel.id : null,
        invalidFields: {},
        validationErrors: [],
        saved: true,
        ...initialModelSpecificState,
    }
    const [state, dispatch] = useReducer(reducer, initialState);
    const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);

    // display validation errors if they change in state
    // pvw todo does this require an effect?
    useEffect(function () {
        if (state.validationErrors && state.validationErrors.length > 0) {
            for (let e = 0; e < state.validationErrors.length; e++) {
                MessageDisplayerUtility.error(state.validationErrors[e]);
            }
        }
    }, [state.validationErrors]);

    function dispatchFormContentUpdate(action) {
        LeaveWithoutSavingWarningUtility.enableLeaveWithoutSavingWarnings(context);
        dispatch(action);
    }

    function onClickSave() {
        // pvw todo debounce - do at form button level? may need to use useCallback
        validateData(handleValidationResult)
            .then(function (validationPasses) {
                if (validationPasses) {
                    let saveData = _.clone(state);
                    if (formStateToSaveData) {
                        saveData = formStateToSaveData(state)
                    }
                    save(saveData);
                }
            })
            .catch(function (error) {
                console.log("Error validating form: ", error);
                MessageDisplayerUtility.error("An error occurred while saving.")
            });
    }

    function handleValidationResult(validationErrors, invalidFields, resolve) {
        if (validationErrors.length > 0) {
            let invalidFields = {};
            for (let y = 0; y < invalidFields.length; y++) {
                invalidFields['' + invalidFields[y] + '_invalid'] = true;
            }
            dispatch({
                type: 'failed_validation',
                invalidFields: invalidFields,
                validationErrors: validationErrors
            })
            resolve(false);
        } else {
            dispatch({type: 'passed_validation'})
            resolve(true);
        }
    }

    // pvw todo move confirm-cancel handling out of here
    function confirmDeactivate() {
        setConfirmingDeactivate(true);
    }

    function cancelDeactivate() {
        setConfirmingDeactivate(false);
    }

    function getFormFieldClasses(originalClasses, fieldName) {
        let returnClasses = originalClasses;
        if (Array.isArray(fieldName)) {
            let allValid = true;
            for (let f = 0; f < fieldName.length; f++) {
                if (state.invalidFields[fieldName[f]] + '_invalid') {
                    allValid = false;
                    break;
                }
            }
            if (!allValid) {
                returnClasses += ' invalid';
            }
        } else {
            if (state.invalidFields[fieldName + '_invalid']) {
                returnClasses += ' invalid';
            }
        }
        return returnClasses;
    }

    function handleTextFieldChange(fieldName, event) {
        if (event && event.target) {
            dispatchFormContentUpdate({
                type: 'user_updated_field',
                fieldName: fieldName,
                value: event.target.value
            })
        }
    }

    function handleRadioOptionChange(fieldName, selectedOption) {
        if (selectedOption) {
            dispatchFormContentUpdate({
                type: 'user_updated_field',
                fieldName: fieldName,
                value: selectedOption
            })
        }
    }

    function handleCheckboxChange(fieldName, value) {
        dispatchFormContentUpdate({
            type: 'user_updated_field',
            fieldName: fieldName,
            value: value
        })
    }

    function forceValueToNumeric(fieldName) {
        if (state[fieldName] !== parseInt(state[fieldName]) || 0) {
            dispatchFormContentUpdate({
                type: 'auto_updated_field',
                fieldName: fieldName,
                value: parseInt(state[fieldName]) || 0
            })
        }
    }

    return {
        state: state,
        onClickSave: onClickSave,
        confirmDeactivate: confirmDeactivate,
        confirmingDeactivate: confirmingDeactivate,
        cancelDeactivate: cancelDeactivate,
        getFormFieldClasses: getFormFieldClasses,
        handleTextFieldChange: handleTextFieldChange,
        handleRadioOptionChange: handleRadioOptionChange,
        handleCheckboxChange: handleCheckboxChange,
        forceValueToNumeric: forceValueToNumeric,
    };
}
