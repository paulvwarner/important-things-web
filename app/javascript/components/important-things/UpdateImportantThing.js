import React from "react";
import {ApiUtility} from "../common/ApiUtility";
import {ImportantThingForm} from "./ImportantThingForm";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";
import {withContext} from "../common/GlobalContextConsumerComponent";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";

export var UpdateImportantThing = withContext(class extends React.Component {
    updateImportantThing = (importantThingData) => {
        var self = this;

        ApiUtility.updateImportantThing(importantThingData)
            .then((response) => {
                LeaveWithoutSavingWarningUtility.disableLeaveWithoutSavingWarnings(self.props.context);
                MessageDisplayerUtility.success("Successfully updated important thing.");
                if (self.props.afterSuccessfulSave) {
                    self.props.afterSuccessfulSave();
                }
            })
            .catch((err) => {
                console && console.error(err);
                MessageDisplayerUtility.error('An error occurred while updating the important thing.');
            });
    };

    render = () => {
        return (
            <ImportantThingForm
                cancel={this.props.cancel}
                save={this.updateImportantThing}
                importantThing={this.props.importantThing}
                isNew={false}
                headerText="Update Important Thing"
            />
        );
    };
});
