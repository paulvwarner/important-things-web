import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {InsightForm} from "./InsightForm";
import {useModelCreateEngine} from "../common/hooks/useModelCreateEngine";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let CreateInsight = function (props) {
    const modelCreateEngine = useModelCreateEngine(
        ApiUtility.createInsight,
        'insight',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelCreateEngine.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <InsightForm
                cancel={props.cancel}
                save={modelCreateEngine.createModel}
                isNew={true}
                headerText="New Insight"
            />
        </Fragment>
    );

};
