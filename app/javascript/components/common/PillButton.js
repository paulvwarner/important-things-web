import React from "react";

export let PillButton = class extends React.Component {
    render = () => {
        let containerClasses = "pill-button-container " + (this.props.containerClasses || '');
        let buttonClasses = "pill-button " + (this.props.buttonClasses || '');
        let buttonTextClasses = "pill-button-text " + (this.props.buttonTextClasses || '');

        return (
            <div className={containerClasses}>
                <div
                    className={buttonClasses}
                    onClick={this.props.onClick}
                >
                    <div className={buttonTextClasses}>
                        {this.props.buttonText}
                    </div>
                </div>
            </div>
        );
    }
};
