import React from "react";
import {CreateImportantThing} from "./CreateImportantThing";
import {withContext} from "../common/GlobalContextConsumerComponent";

export var CreateImportantThingWrapper = withContext(class extends React.Component {
    render = () => {
        return (
            <CreateImportantThing
                afterSuccessfulSave={this.props.afterSuccessfulSave}
                cancel={this.props.cancel}
            />
        );
    }
});
