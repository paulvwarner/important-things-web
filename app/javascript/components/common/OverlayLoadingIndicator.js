import React from "react";
import {LoadingIndicator} from "./LoadingIndicator";

export var OverlayLoadingIndicator = class extends React.Component {
    render = () => {
        return (
            <div className="loading-indicator-overlay">
                <div className="loading-indicator-box">
                    <LoadingIndicator/>
                </div>
            </div>
        );
    }
};
