import React from "react";
import {withContext} from "../common/GlobalContextConsumerComponent";

export var Modal = withContext(class extends React.Component {
    render = () => {
        return (
            <div className="common-modal">
                <div className="common-modal-overlay">
                    <div className={"common-modal-box " + (this.props.boxClass || '')}>
                        <div className="common-modal-header">
                            <div className="common-modal-header-content">
                                <div className="common-modal-header-text-container">
                                    <div
                                        className="common-modal-header-text"
                                    >{this.props.headerText}</div>
                                </div>
                                <div className="common-modal-close-option-container">
                                    <div
                                        className="common-modal-close-option"
                                        onClick={this.props.onClickCloseOption}
                                    >
                                        <img
                                            src="/static/images/times.svg"
                                            className="common-modal-close-option-icon"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="common-modal-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

