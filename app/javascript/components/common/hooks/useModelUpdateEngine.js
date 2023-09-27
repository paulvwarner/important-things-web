import {useContext, useEffect, useReducer, useState} from 'react';
import {MessageDisplayerUtility} from "../MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "../LeaveWithoutSavingWarningUtility";
import {GlobalContext} from "../../admin-frame/AdminFrame";

function reducer(state, action) {
    switch (action.type) {
        case 'model/readStart':
        case 'model/updateStart':
        case 'model/deactivateStart':
            return {
                ...state,
                loading: true
            }
        case 'model/readSuccess':
            return {
                ...state,
                model: action.model,
                loading: false
            }
        case 'model/readFailure':
        case 'model/updateFailure':
        case 'model/deactivateFailure':
            return {
                ...state,
                loading: false
            }
        case 'model/showConfirmDeactivateModal':
            return {
                ...state,
                showConfirmDeactivateModal: true
            }
        case 'model/hideConfirmDeactivateModal':
            return {
                ...state,
                showConfirmDeactivateModal: false
            }
    }
    throw Error(`Unknown action: ${action.type}`);
}

// Engine for a wrapper component for a form, where wrapper is in charge of updating models defined by the form. Updating includes "deleting" which is really just deactivating.
export function useModelUpdateEngine(
    modelFetchApiFunction, modelUpdateApiFunction, modelId, modelName, updateCallback
) {
    const context = useContext(GlobalContext);
    const initialState = {loading: true};
    const [state, dispatch] = useReducer(reducer, initialState);

    // on mount, fetch model from API and put it in state
    useEffect(function () {
        dispatch({type: 'model/readStart'});
        modelFetchApiFunction(modelId)
            .then(function (model) {
                dispatch({
                    type: 'model/readSuccess',
                    model: model
                });
            })
            .catch(function (error) {
                dispatch({type: 'model/readFailure'});
                console.log(`Error fetching ${modelName}: `, error);
                MessageDisplayerUtility.error(`Error fetching ${modelName}.`);
            });
    }, []);

    function updateModel(formModelData) {
        dispatch({type: 'model/updateStart'});
        modelUpdateApiFunction(formModelData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success(`Successfully updated ${modelName}.`);
                if (updateCallback) {
                    updateCallback();
                }
            })
            .catch((err) => {
                dispatch({type: 'model/updateFailure'});
                console && console.error(err);
                MessageDisplayerUtility.error(`An error occurred while updating the ${modelName}.`);
            });
    }

    // "deletes" are just updates where active is changed to false
    function deactivateModel() {
        dispatch({type: 'model/deactivateStart'});
        modelUpdateApiFunction({id: modelId, active: false})
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success(`Successfully deleted ${modelName}.`);
                if (updateCallback) {
                    updateCallback();
                }
            })
            .catch((err) => {
                dispatch({type: 'model/deactivateFailure'});
                console && console.error(err);
                MessageDisplayerUtility.error(`An error occurred while deleting the ${modelName}.`);
            });
    }

    function showConfirmDeactivateModal() {
        dispatch({type: 'model/showConfirmDeactivateModal'});
    }

    function hideConfirmDeactivateModal() {
        dispatch({type: 'model/hideConfirmDeactivateModal'});
    }

    return {
        state: state,
        updateModel: updateModel,
        deactivateModel: deactivateModel,
        showConfirmDeactivateModal: showConfirmDeactivateModal,
        hideConfirmDeactivateModal: hideConfirmDeactivateModal,
    };
}
