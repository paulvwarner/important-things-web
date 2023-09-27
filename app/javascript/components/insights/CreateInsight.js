import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {InsightForm} from "./InsightForm";
import {useModelCreateManager} from "../common/hooks/useModelCreateManager";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let CreateInsight = function (props) {
    const modelCreateManager = useModelCreateManager(
        ApiUtility.createInsight,
        'insight',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelCreateManager.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <InsightForm
                cancel={props.cancel}
                save={modelCreateManager.createModel}
                isNew={true}
                headerText="New Insight"
            />
        </Fragment>
    );

};
