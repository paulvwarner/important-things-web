import {useContext, useReducer} from 'react';
import {MessageDisplayerUtility} from "../MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "../LeaveWithoutSavingWarningUtility";
import {GlobalContext} from "../../admin-frame/AdminFrame";

function reducer(state, action) {
    switch (action.type) {
        case 'model/createStart':
            return {
                ...state,
                loading: true
            }
        case 'model/createFailure':
            return {
                ...state,
                loading: false
            }
    }
    throw Error(`Unknown action: ${action.type}`);
}

// Engine for a wrapper component for a form, where wrapper is in charge of creating models defined by the form
export function useModelCreateEngine(
    modelCreateApiFunction, modelName, createCallback
) {
    const context = useContext(GlobalContext);
    const initialState = {loading: false};
    const [state, dispatch] = useReducer(reducer, initialState);

    function createModel(formModelData, callback) {
        dispatch({type: 'model/createStart'});
        modelCreateApiFunction(formModelData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success(`Successfully created ${modelName}.`);
                if (createCallback) {
                    createCallback();
                }
            })
            .catch((error) => {
                dispatch({type: 'model/createFailure'});
                console && console.log(error);
                MessageDisplayerUtility.error(`An error occurred while creating the ${modelName}.`);
            })
    }

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

    return {
        state: state,
        createModel: createModel,
    };
}
