import React from "react";
import {ApiUtility} from "../common/ApiUtility";
import {ImportantThingForm} from "./ImportantThingForm";
import {withContext} from "../common/GlobalContextConsumerComponent";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";

export var CreateImportantThing = withContext(class extends React.Component {
    createImportantThing = (importantThingData, callback) => {
        var self = this;

        ApiUtility.createImportantThing(importantThingData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(self.props.context);
                MessageDisplayerUtility.success("Successfully created important thing.");

                if (callback) {
                    callback();
                }
                if (self.props.afterSuccessfulSave) {
                    self.props.afterSuccessfulSave();
                }
            })
            .catch((error) => {
                console && console.log(error);
                MessageDisplayerUtility.error('An error occurred while creating the important thing.');
            })
    };

    render = () => {
        return (
            <ImportantThingForm
                cancel={this.props.cancel}
                save={this.createImportantThing}
                isNew={true}
                headerText="New Important Thing"
            />
        );
    };
});
