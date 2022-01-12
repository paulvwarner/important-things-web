import React from "react";

export let Modal = function (props) {
    return (
        <div className="common-modal">
            <div className="common-modal-overlay">
                <div className={"common-modal-box " + (props.boxClass || '')}>
                    <div className="common-modal-header">
                        <div className="common-modal-header-content">
                            <div className="common-modal-header-text-container">
                                <div
                                    className="common-modal-header-text"
                                >{props.headerText}</div>
                            </div>
                            <div className="common-modal-close-option-container">
                                <div
                                    className="common-modal-close-option"
                                    onClick={props.onClickCloseOption}
                                >
                                    <img
                                        src="/static/images/times.svg"
                                        className="common-modal-close-option-icon"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="common-modal-divider-container">
                        <div className="common-modal-divider"/>
                    </div>
                    <div className="common-modal-body">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
};

