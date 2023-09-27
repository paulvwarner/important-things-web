import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {SelfCareToolForm} from "./SelfCareToolForm";
import {useModelCreateEngine} from "../common/hooks/useModelCreateEngine";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let CreateSelfCareTool = function (props) {
    const modelCreateEngine = useModelCreateEngine(
        ApiUtility.createSelfCareTool,
        'self-care tool',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelCreateEngine.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <SelfCareToolForm
                cancel={props.cancel}
                save={modelCreateEngine.createModel}
                isNew={true}
                headerText="New Self-Care Tool"
            />
        </Fragment>
    );
};
