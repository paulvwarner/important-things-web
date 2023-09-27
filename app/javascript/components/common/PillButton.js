import React from "react";

export let PillButton = function (props) {
    let containerClasses = `pill-button-container ${props.containerClasses || ''}`;
    let buttonClasses = `pill-button ${props.buttonClasses || ''}`;
    let buttonTextClasses = `pill-button-text ${props.buttonTextClasses || ''}`;

    return (
        <div className={containerClasses}>
            <div
                className={buttonClasses}
                onClick={props.onClick}
            >
                <div className={buttonTextClasses}>
                    {props.buttonText}
                </div>
            </div>
        </div>
    );

};
