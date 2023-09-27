import React, {Fragment} from "react";
import {ApiUtility} from "../common/ApiUtility";
import {SelfCareToolForm} from "./SelfCareToolForm";
import {useModelCreateManager} from "../common/hooks/useModelCreateManager";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

export let CreateSelfCareTool = function (props) {
    const modelCreateManager = useModelCreateManager(
        ApiUtility.createSelfCareTool,
        'self-care tool',
        props.afterSuccessfulSave
    );

    return (
        <Fragment>
            <ConditionalRenderer if={modelCreateManager.state.loading} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <SelfCareToolForm
                cancel={props.cancel}
                save={modelCreateManager.createModel}
                isNew={true}
                headerText="New Self-Care Tool"
            />
        </Fragment>
    );
};
