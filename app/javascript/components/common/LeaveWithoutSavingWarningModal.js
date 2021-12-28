import {Prompt, withRouter} from 'react-router-dom';
import React from "react";
import {PillButton} from "../common/PillButton";
import {Modal} from "../common/Modal";

export var LeaveWithoutSavingWarningModal = withRouter(class extends React.Component {
    constructor(props) {
        super(props);
        this.props.navWarningDisplayValueManager.reactToValueChangeWith(this.handleNavWarningDisplayRequest);
        this.props.confirmBeforeNavValueManager.reactToValueChangeWith(this.handleConfirmBeforeNavRequest);

        this.state = {
            showLeaveWithoutSavingWarningModal: false,
            confirmBeforeNav: false,
            getUserConfirmationCallback: null
        }
    }

    handleNavWarningDisplayRequest = (warningModalSettings) => {
        this.setState({
            showLeaveWithoutSavingWarningModal: warningModalSettings.showLeaveWithoutSavingWarningModal,
            getUserConfirmationCallback: warningModalSettings.getUserConfirmationCallback,
        });
    };

    handleConfirmBeforeNavRequest = (promptRequest) => {
        this.setState({
            confirmBeforeNav: promptRequest.confirmBeforeNav,
        });
    };

    cancel = () => {
        var self = this;
        const getUserConfirmationCallback = self.state.getUserConfirmationCallback;
        this.setState(
            {
                showLeaveWithoutSavingWarningModal: false,
                getUserConfirmationCallback: null,
            },
            function () {
                if (getUserConfirmationCallback) {
                    getUserConfirmationCallback(false);
                }
            }
        );
    };

    leaveWithoutSaving = () => {
        var self = this;
        const getUserConfirmationCallback = self.state.getUserConfirmationCallback;
        this.setState(
            {
                showLeaveWithoutSavingWarningModal: false,
                getUserConfirmationCallback: null,
            },
            function () {
                getUserConfirmationCallback(true);
            }
        );
    };

    render = () => {
        return (
            <div>
                {/*
                 This Prompt doesn't actually display anything, but triggering its "when" prop to
                 true and returning a string from the "message" function is necessary to block
                 navigation.  After that block occurs, BrowserRouter calls its getUserConfirmation
                 prop function to determine what to actually display - I have it set to trigger the
                 display of the modal defined below under the Prompt.
                 */}
                <Prompt
                    when={this.state.confirmBeforeNav}
                    message={function () {
                        return 'You have unsaved changes. Are you sure you want to leave without saving?';
                    }}
                />
                {(() => {
                    if (this.state.showLeaveWithoutSavingWarningModal) {
                        return (
                            <Modal
                                boxClass="leave-without-saving-warning-modal"
                                headerText="Leave Without Saving?"
                                onClickCloseOption={this.cancel}
                            >
                                <div className="leave-without-saving-warning-modal-body">
                                    You have unsaved changes. Are you sure you want to leave without saving?
                                </div>

                                <div className="leave-without-saving-warning-modal-options">
                                    <div className="leave-without-saving-warning-modal-option">
                                        <PillButton
                                            onClick={this.cancel}
                                            buttonClasses={'leave-without-saving-warning-modal-button leave-without-saving-warning-modal-cancel-button'}
                                            buttonText="CANCEL"
                                            buttonTextClasses="leave-without-saving-warning-modal-button-text"
                                        />
                                    </div>
                                    <div className="leave-without-saving-warning-modal-option">
                                        <PillButton
                                            onClick={this.leaveWithoutSaving}
                                            buttonClasses={'leave-without-saving-warning-modal-button leave-without-saving-warning-modal-leave-button'}
                                            buttonText="LEAVE WITHOUT SAVING"
                                            buttonTextClasses="leave-without-saving-warning-modal-button-text"
                                        />
                                    </div>
                                </div>
                            </Modal>
                        );
                    }
                })()}
            </div>
        );
    }
});

