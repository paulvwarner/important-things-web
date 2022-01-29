import React from "react";
import {ApiUtility} from "../common/ApiUtility";
import {UserForm} from "./UserForm";
import {LoadingIndicator} from "../common/LoadingIndicator";
import {useCommonUpdateEffects} from "../common/CommonUpdateHooks";

export let UpdateUser = function (props) {
    const [formModel, updateFormModel, deactivateFormModel] = useCommonUpdateEffects(
        props,
        ApiUtility.getUser,
        ApiUtility.updateUser,
        props.userId,
        'user'
    );

    if (formModel) {
        return (
            <UserForm
                cancel={props.cancel}
                save={updateFormModel}
                deactivate={deactivateFormModel}
                user={formModel}
                isNew={false}
                headerText="Update User"
            />
        );
    } else {
        return (
            <LoadingIndicator/>
        );
    }
};
