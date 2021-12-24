import React from "react";

export class AdminFrameRoot extends React.Component {
    componentDidMount = () => {
        this.goToDefaultPage();
    };

    goToDefaultPage = () => {
        // pvw todo - route to default page for logged-in user based on role
        window.location.assign('/important-things');
    };

    render = () => {
        return null;
    }
}
