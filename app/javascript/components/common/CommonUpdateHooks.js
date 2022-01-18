import React, {useContext, useEffect, useState} from 'react';
import {MessageDisplayerUtility} from "./MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "./LeaveWithoutSavingWarningUtility";
import {GlobalContext} from "../admin-frame/AdminFrame";

export function useCommonUpdateEffects(
    props, modelFetchApiFunction, modelUpdateApiFunction, modelId, modelName
) {
    const context = useContext(GlobalContext);
    const [formModel, setFormModel] = useState(null);

    // on mount, fetch model from API and put it in state
    useEffect(function () {
        modelFetchApiFunction(modelId)
            .then(function (formModelFromApi) {
                setFormModel(formModelFromApi);
            })
            .catch(function (error) {
                console.log("Error fetching " + modelName + ": ", error);
                MessageDisplayerUtility.error("Error fetching " + modelName + ".");
            });
    }, []);

    function updateFormModel(formModelData) {
        modelUpdateApiFunction(formModelData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success("Successfully updated " + modelName + ".");
                if (props.afterSuccessfulSave) {
                    props.afterSuccessfulSave();
                }
            })
            .catch((err) => {
                console && console.error(err);
                MessageDisplayerUtility.error('An error occurred while updating the ' + modelName + '.');
            });
    }

    function deactivateFormModel() {
        modelUpdateApiFunction({id: modelId, active: false})
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success("Successfully deleted " + modelName + ".");
                if (props.afterSuccessfulSave) {
                    props.afterSuccessfulSave();
                }
            })
            .catch((err) => {
                console && console.error(err);
                MessageDisplayerUtility.error('An error occurred while deleting the ' + modelName + '.');
            });
    }

    return [
        formModel,
        updateFormModel,
        deactivateFormModel
    ];
}
