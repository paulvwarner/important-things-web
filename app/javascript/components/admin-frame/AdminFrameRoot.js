import React from "react";

export class AdminFrameRoot extends React.Component {
    componentDidMount = () => {
        this.goToDefaultPage();
    };

    goToDefaultPage = () => {
        window.location.assign('/important-things');
    };

    render = () => {
        return null;
    }
}
