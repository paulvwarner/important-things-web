import React from "react";

export let LoadingIndicator = function (props) {
    return (
        <img
            className={`loading-indicator ${props.additionalClasses || ''}`}
            src="/static/images/loading.gif"
        />
    )
};
