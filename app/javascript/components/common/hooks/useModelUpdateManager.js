import {useContext, useEffect, useReducer} from 'react';
import {MessageDisplayerUtility} from "../MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "../LeaveWithoutSavingWarningUtility";
import {GlobalContext} from "../../admin-frame/AdminFrame";

function reducer(state, action) {
    switch (action.type) {
        case 'started_loading_operation': {
            return {
                ...state,
                loading: true
            }
        }
        case 'loaded_model': {
            return {
                ...state,
                model: action.model,
                loading: false
            }
        }
        case 'failed_loading_operation': {
            return {
                ...state,
                loading: false
            }
        }
    }
    throw Error('Unknown action: ' + action.type);
}

export function useModelUpdateManager(
    modelFetchApiFunction, modelUpdateApiFunction, modelId, modelName, updateCallback
) {
    const context = useContext(GlobalContext);
    const initialState = {loading: true};
    const [state, dispatch] = useReducer(reducer, initialState);

    // on mount, fetch model from API and put it in state
    useEffect(function () {
        dispatch({type: 'started_loading_operation'});
        modelFetchApiFunction(modelId)
            .then(function (model) {
                dispatch({
                    type: 'loaded_model',
                    model: model
                });
            })
            .catch(function (error) {
                dispatch({type: 'failed_loading_operation'});
                console.log(`Error fetching ${modelName}: `, error);
                MessageDisplayerUtility.error(`Error fetching ${modelName}.`);
            });
    }, []);

    function updateModel(formModelData) {
        dispatch({type: 'started_loading_operation'});
        modelUpdateApiFunction(formModelData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success(`Successfully updated ${modelName}.`);
                if (updateCallback) {
                    updateCallback();
                }
            })
            .catch((err) => {
                dispatch({type: 'failed_loading_operation'});
                console && console.error(err);
                MessageDisplayerUtility.error(`An error occurred while updating the ${modelName}.`);
            });
    }

    // "deletes" are just updates where active is changed to false
    function deactivateModel() {
        dispatch({type: 'started_loading_operation'});
        modelUpdateApiFunction({id: modelId, active: false})
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success(`Successfully deleted ${modelName}.`);
                if (updateCallback) {
                    updateCallback();
                }
            })
            .catch((err) => {
                dispatch({type: 'failed_loading_operation'});
                console && console.error(err);
                MessageDisplayerUtility.error(`An error occurred while deleting the ${modelName}.`);
            });
    }

    return {
        state: state,
        updateModel: updateModel,
        deactivateModel: deactivateModel
    };
}
