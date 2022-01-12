import React from "react";
import {LoadingIndicator} from "./LoadingIndicator";

export let OverlayLoadingIndicator = function (props) {
    return (
        <div className="loading-indicator-overlay">
            <div className="loading-indicator-box">
                <LoadingIndicator/>
            </div>
        </div>
    );
};
