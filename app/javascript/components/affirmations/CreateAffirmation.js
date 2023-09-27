import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {AffirmationForm} from "./AffirmationForm";
import {useModelCreateEngine} from "../common/hooks/useModelCreateEngine";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let CreateAffirmation = function (props) {
    const modelCreateEngine = useModelCreateEngine(
        ApiUtility.createAffirmation,
        'affirmation',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelCreateEngine.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <AffirmationForm
                cancel={props.cancel}
                save={modelCreateEngine.createModel}
                isNew={true}
                headerText="New Affirmation"
            />
        </Fragment>
    );
};
