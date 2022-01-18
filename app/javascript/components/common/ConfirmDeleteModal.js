import React from "react";
import {PillButton} from "./PillButton";
import {Modal} from "./Modal";

export let ConfirmDeleteModal = function (props) {
    return (

        <Modal
            boxClass="confirm-delete-modal"
            headerText="Confirm Delete"
            onClickCloseOption={props.cancel}
        >
            <div className="confirm-delete-modal-body">
                {`Are you sure you want to delete this ${props.modelTypeName}?`}
            </div>

            <div className="confirm-delete-modal-options">
                <div className="confirm-delete-modal-option">
                    <PillButton
                        onClick={props.cancel}
                        buttonClasses="confirm-delete-modal-button confirm-delete-modal-cancel-button"
                        buttonText="CANCEL"
                        buttonTextClasses="confirm-delete-modal-button-text"
                    />
                </div>
                <div className="confirm-delete-modal-option">
                    <PillButton
                        onClick={props.deactivate}
                        buttonClasses="confirm-delete-modal-button confirm-delete-modal-delete-button"
                        buttonText="DELETE"
                        buttonTextClasses="confirm-delete-modal-button-text"
                    />
                </div>
            </div>
        </Modal>

    );
};

