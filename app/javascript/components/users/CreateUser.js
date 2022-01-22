import React, {useContext} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {UserForm} from "./UserForm";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";
import {GlobalContext} from "../admin-frame/AdminFrame";

export let CreateUser = function (props) {
    const context = useContext(GlobalContext);

    function createUser(userData, callback) {
        ApiUtility.createUser(userData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(context);
                MessageDisplayerUtility.success("Successfully created user.");

                if (callback) {
                    callback();
                }
                if (props.afterSuccessfulSave) {
                    props.afterSuccessfulSave();
                }
            })
            .catch((error) => {
                console && console.log(error);
                MessageDisplayerUtility.error('An error occurred while creating the user.');
            })
    }

    return (
        <UserForm
            cancel={props.cancel}
            save={createUser}
            isNew={true}
            headerText="New User"
        />
    );
};
