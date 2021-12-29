import React from "react";
import {ApiUtility} from "../common/ApiUtility";
import {LoadingIndicator} from "../common/LoadingIndicator";
import {UpdateImportantThing} from "./UpdateImportantThing";
import {withContext} from "../common/GlobalContextConsumerComponent";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";

export var UpdateImportantThingWrapper = withContext(class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            importantThing: null
        };
    }

    componentDidMount = () => {
        // fetch important thing from API and put it in state
        var self = this;

        ApiUtility.getImportantThing(self.props.importantThingId)
            .then(function (importantThing) {
                self.setState({
                    loading: false,
                    importantThing: importantThing
                });
            })
            .catch(function (error) {
                console.log("Error fetching important thing: ", error);
                MessageDisplayerUtility.error("Error fetching important thing.");
            });
    };

    render = () => {
        if (this.state.importantThing) {
            return (
                <UpdateImportantThing
                    importantThing={this.state.importantThing}
                    afterSuccessfulSave={this.props.afterSuccessfulSave}
                    cancel={this.props.cancel}
                />
            );
        } else {
            return (
                <LoadingIndicator loading={true}/>
            );
        }
    }
});
