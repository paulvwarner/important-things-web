import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {ImportantThingForm} from "./ImportantThingForm";
import {useModelCreateManager} from "../common/hooks/useModelCreateManager";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let CreateImportantThing = function (props) {
    const modelCreateManager = useModelCreateManager(
        ApiUtility.createImportantThing,
        'important thing',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelCreateManager.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ImportantThingForm
                cancel={props.cancel}
                save={modelCreateManager.createModel}
                isNew={true}
                headerText="New Important Thing"
            />
        </Fragment>
    );

};
