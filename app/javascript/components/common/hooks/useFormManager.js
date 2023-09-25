import {useContext, useEffect, useReducer} from 'react';
import {MessageDisplayerUtility} from "../MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "../LeaveWithoutSavingWarningUtility";
import _ from "underscore";
import {GlobalContext} from "../../admin-frame/AdminFrame";
import {useDebouncedFunction} from "./useDebouncedFunction";

function reducer(state, action) {
    switch (action.type) {
        case 'form/loadSupportingDataStart':
        case 'form/validationStart':
            return {
                ...state,
                showOverlayLoadingIndicator: true
            }
        case 'form/loadSupportingDataSuccess':
            return {
                ...state,
                supportingData: action.supportingData,
                showOverlayLoadingIndicator: false
            }
        case 'form/loadSupportingDataFailure':
        case 'form/loadSupportingDataSkip':
            return {
                ...state,
                showOverlayLoadingIndicator: false
            }
        case 'form/validationFailure':
            return {
                ...state,
                showOverlayLoadingIndicator: false,
                invalidFields: action.invalidFields,
                validationErrors: action.validationErrors
            }
        case 'form/validationSuccess':
            return {
                ...state,
                showOverlayLoadingIndicator: false,
                invalidFields: {},
                validationErrors: []
            }
        case 'form/userUpdatedField':
            return {
                ...state,
                [action.fieldName]: action.value,
                saved: false
            }
        case 'form/systemAutoUpdatedField':
            return {
                ...state,
                saved: false
            }
    }
    throw Error('Unknown action: ' + action.type);
}

export function useFormManager(
    initialModelSpecificState, initialModel, fetchSupportingData, validateForm, formStateToSaveData, save
) {
    const context = useContext(GlobalContext);
    const initialState = {
        id: initialModel ? initialModel.id : null,
        invalidFields: {},
        validationErrors: [],
        saved: true,
        supportingData: null,
        validating: false,
        ...initialModelSpecificState,
    }
    const [state, dispatch] = useReducer(reducer, initialState);

    const onClickSave = useDebouncedFunction(() => {
        dispatch({type: 'form/validationStart'})
        validateForm(handleValidationResult)
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
    });

    // on mount, load supporting data if there is any that needs to be loaded
    useEffect(function () {
        if (fetchSupportingData) {
            dispatch({type: 'form/loadSupportingDataStart'})
            fetchSupportingData()
                .then(function (supportingData) {
                    dispatch({
                        type: 'form/loadSupportingDataSuccess',
                        supportingData: supportingData,
                    })
                })
                .catch(function (error) {
                    dispatch({type: 'form/loadSupportingDataFailure'})
                    console.log("Error loading form data: ", error);
                    MessageDisplayerUtility.error("An error occurred while loading form data.")
                });
        } else {
            dispatch({type: 'form/loadSupportingDataSkip'})
        }
    }, []);

    function dispatchFormContentUpdate(action) {
        LeaveWithoutSavingWarningUtility.enableLeaveWithoutSavingWarnings(context);
        dispatch(action);
    }

    function handleValidationResult(validationErrors, invalidFields, resolve) {
        if (validationErrors.length > 0) {
            let invalidFields = {};
            for (let y = 0; y < invalidFields.length; y++) {
                invalidFields['' + invalidFields[y] + '_invalid'] = true;
            }
            dispatch({
                type: 'form/validationFailure',
                invalidFields: invalidFields,
                validationErrors: validationErrors
            })
            // display validation errors
            for (let e = 0; e < validationErrors.length; e++) {
                MessageDisplayerUtility.error(validationErrors[e]);
            }
            resolve(false);
        } else {
            dispatch({type: 'form/validationSuccess'})
            resolve(true);
        }
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
                type: 'form/userUpdatedField',
                fieldName: fieldName,
                value: event.target.value
            })
        }
    }

    function handleRadioOptionChange(fieldName, selectedOption) {
        if (selectedOption) {
            dispatchFormContentUpdate({
                type: 'form/userUpdatedField',
                fieldName: fieldName,
                value: selectedOption
            })
        }
    }

    function handleCheckboxChange(fieldName, value) {
        dispatchFormContentUpdate({
            type: 'form/userUpdatedField',
            fieldName: fieldName,
            value: value
        })
    }

    function forceValueToNumeric(fieldName) {
        if (state[fieldName] !== parseInt(state[fieldName]) || 0) {
            dispatchFormContentUpdate({
                type: 'form/systemAutoUpdatedField',
                fieldName: fieldName,
                value: parseInt(state[fieldName]) || 0
            })
        }
    }

    return {
        state: state,
        onClickSave: onClickSave,
        getFormFieldClasses: getFormFieldClasses,
        handleTextFieldChange: handleTextFieldChange,
        handleRadioOptionChange: handleRadioOptionChange,
        handleCheckboxChange: handleCheckboxChange,
        forceValueToNumeric: forceValueToNumeric,
    };
}
