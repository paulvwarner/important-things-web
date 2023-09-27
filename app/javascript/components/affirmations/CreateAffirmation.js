import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {AffirmationForm} from "./AffirmationForm";
import {useModelCreateManager} from "../common/hooks/useModelCreateManager";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let CreateAffirmation = function (props) {
    const modelCreateManager = useModelCreateManager(
        ApiUtility.createAffirmation,
        'affirmation',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelCreateManager.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <AffirmationForm
                cancel={props.cancel}
                save={modelCreateManager.createModel}
                isNew={true}
                headerText="New Affirmation"
            />
        </Fragment>
    );
};
