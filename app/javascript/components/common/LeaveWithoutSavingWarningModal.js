import {Prompt} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {PillButton} from "./PillButton";
import {Modal} from "./Modal";

export let LeaveWithoutSavingWarningModal = function (props) {
    props.navWarningDisplayValueManager.reactToValueChangeWith(handleNavWarningDisplayRequest);
    props.confirmBeforeNavValueManager.reactToValueChangeWith(handleConfirmBeforeNavRequest);

    let [warningModalState, setWarningModalState] = useState({
        showLeaveWithoutSavingWarningModal: false,
        confirmBeforeNav: false,
        getUserConfirmationCallback: null
    });

    let [userConfirmationCallbackToRun, setUserConfirmationCallbackToRun] = useState(null);

    function mergeWarningModalState(prevState, stateChange) {
        if (stateChange) {
            setWarningModalState(
                {
                    ...prevState,
                    ...stateChange,
                }
            );
        }
    }

    function handleNavWarningDisplayRequest(warningModalSettings) {
        mergeWarningModalState(
            warningModalState,
            {
                showLeaveWithoutSavingWarningModal: warningModalSettings.showLeaveWithoutSavingWarningModal,
                getUserConfirmationCallback: warningModalSettings.getUserConfirmationCallback,
            }
        );
    }

    function handleConfirmBeforeNavRequest(promptRequest) {
        mergeWarningModalState(
            warningModalState,
            {
                confirmBeforeNav: promptRequest.confirmBeforeNav,
            }
        );
    }

    function cancel() {
        const getUserConfirmationCallback = warningModalState.getUserConfirmationCallback;

        mergeWarningModalState(
            warningModalState,
            {
                showLeaveWithoutSavingWarningModal: false,
                getUserConfirmationCallback: null,
            }
        );

        if (getUserConfirmationCallback) {
            setUserConfirmationCallbackToRun(getUserConfirmationCallback.bind(null, false))
        }
    }

    function leaveWithoutSaving() {
        const getUserConfirmationCallback = warningModalState.getUserConfirmationCallback;

        mergeWarningModalState(
            warningModalState,
            {
                showLeaveWithoutSavingWarningModal: false,
                getUserConfirmationCallback: null,
            }
        );

        setUserConfirmationCallbackToRun(getUserConfirmationCallback.bind(null, true));
    }

    // run user conf callback after renders where it changes
    // pvw todo - there's gotta be a better way to do this
    useEffect(
        function () {
            if (userConfirmationCallbackToRun) {
                userConfirmationCallbackToRun();
                setUserConfirmationCallbackToRun(null);
            }
        },
        [userConfirmationCallbackToRun]
    )

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
                when={warningModalState.confirmBeforeNav}
                message={function () {
                    return 'You have unsaved changes. Are you sure you want to leave without saving?';
                }}
            />
            {(() => {
                if (warningModalState.showLeaveWithoutSavingWarningModal) {
                    return (
                        <Modal
                            boxClass="leave-without-saving-warning-modal"
                            headerText="Leave Without Saving?"
                            onClickCloseOption={cancel}
                        >
                            <div className="leave-without-saving-warning-modal-body">
                                You have unsaved changes. Are you sure you want to leave without saving?
                            </div>

                            <div className="leave-without-saving-warning-modal-options">
                                <div className="leave-without-saving-warning-modal-option">
                                    <PillButton
                                        onClick={cancel}
                                        buttonClasses={'leave-without-saving-warning-modal-button leave-without-saving-warning-modal-cancel-button'}
                                        buttonText="CANCEL"
                                        buttonTextClasses="leave-without-saving-warning-modal-button-text"
                                    />
                                </div>
                                <div className="leave-without-saving-warning-modal-option">
                                    <PillButton
                                        onClick={leaveWithoutSaving}
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
};

