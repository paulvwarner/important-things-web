import React from 'react';
import {PillButton} from "./PillButton";

let _ = require('underscore');

export let CommonFormOptions = function (props) {
    let commonFormOptions = [
        <PillButton
            key={1}
            containerClasses="common-form-button-container"
            buttonClasses="common-form-button cancel-button"
            onClick={props.onClickCancel}
            buttonText={"CANCEL"}
        />,
        <PillButton
            key={2}
            containerClasses="common-form-button-container"
            buttonClasses="common-form-button save-button"
            onClick={props.onClickSave}
            buttonText={"SAVE"}
        />
    ];

    let optionsContent = null;

    if (!props.allowDelete && !props.renderAdditionalOptions) {
        optionsContent = commonFormOptions;
    } else {
        optionsContent = [
            <div
                key={1}
                className="common-form-options-section common-form-options-left"
            >
                {commonFormOptions}
            </div>,
            <div
                key={2}
                className="common-form-options-section common-form-options-right"
            >
                {(() => {
                    if (props.allowDelete) {
                        return (
                            <PillButton
                                containerClasses="common-form-button-container"
                                buttonClasses="common-form-button delete-button white-button"
                                onClick={props.onClickDeactivate}
                                buttonText="DELETE"
                            />
                        )
                    }
                })()}
                {(() => {
                    if (props.renderAdditionalOptions) {
                        return props.renderAdditionalOptions();
                    }
                })()}
            </div>
        ]
    }

    return (
        <div className="common-form-options">
            {optionsContent}
        </div>
    );
};
