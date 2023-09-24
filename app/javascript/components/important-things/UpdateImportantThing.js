import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {ImportantThingForm} from "./ImportantThingForm";
import {useModelUpdateManager} from "../common/hooks/useModelUpdateManager";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let UpdateImportantThing = function (props) {
    const modelUpdateManager = useModelUpdateManager(
        ApiUtility.getImportantThing,
        ApiUtility.updateImportantThing,
        props.importantThingId,
        'important thing',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelUpdateManager.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ConditionalRenderer if={modelUpdateManager.state.model} renderer={() => (
                <ImportantThingForm
                    cancel={props.cancel}
                    save={modelUpdateManager.updateModel}
                    deactivate={modelUpdateManager.deactivateModel}
                    importantThing={modelUpdateManager.state.model}
                    isNew={false}
                    headerText="Update Important Thing"
                />
            )}/>
        </Fragment>
    );
};
