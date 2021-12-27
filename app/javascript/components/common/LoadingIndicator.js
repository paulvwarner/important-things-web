import React from "react";

export var LoadingIndicator = class extends React.Component {
    render = () => {
        return (
            <img className="loading-indicator" src="/static/images/loading.gif"/>
        )
    }
};
