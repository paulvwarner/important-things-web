import React from 'react';
import {LoadingIndicator} from "../common/LoadingIndicator";
import {PillButton} from "../common/PillButton";
import {Modal} from "../common/Modal";
import {useModelFormEngine} from "../common/hooks/useModelFormEngine";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";
import {CommonFormOptions} from "../common/CommonFormOptions";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

let _ = require('underscore');

export let SelfCareToolForm = function (props) {
    const selfCareTool = _.clone(props.selfCareTool) || null;
    const initialModelState = {
        title: (selfCareTool && selfCareTool.title) || '',
        notes: (selfCareTool && selfCareTool.notes) || '',
    };
    const formEngine = useModelFormEngine(initialModelState, selfCareTool, null, validateForm, null, props.save);

    function validateForm(handleValidationResult) {
        return new Promise(function (resolve, reject) {
            let validationErrors = [];
            let invalidFields = [];

            if (!formEngine.state.title) {
                validationErrors.push('Please enter a title.');
                invalidFields.push('title');
            }

            return handleValidationResult(validationErrors, invalidFields, resolve);
        });
    }

    return (
        <Modal
            headerText={props.headerText}
            onClickCloseOption={props.cancel}
        >
            <ConditionalRenderer if={formEngine.state.showOverlayLoadingIndicator} renderer={()=>(
                <OverlayLoadingIndicator/>
            )}/>
            <div className="common-form self-care-tool-form">
                <div className="common-form-body">
                    <div className="common-form-body-row">
                        <div className={formEngine.getFormFieldClasses("common-form-field", "title")}>
                            <div className="common-form-field-label">
                                Title
                            </div>
                            <div className="common-form-field-input-container">
                                <input
                                    id="title"
                                    type="text"
                                    className="common-form-input"
                                    value={formEngine.state.title}
                                    onChange={(event) => formEngine.handleTextFieldChange("title", event)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="common-form-body-row">
                        <div className={formEngine.getFormFieldClasses("common-form-field", "notes")}>
                            <div className="common-form-field-label">
                                Notes
                            </div>
                            <div className="common-form-field-input-container">
                                <textarea
                                    id="notes"
                                    className="common-form-textarea"
                                    value={formEngine.state.notes}
                                    onChange={(event) => formEngine.handleTextFieldChange("notes", event)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="common-form-body-row">
                        <CommonFormOptions
                            allowDelete={!props.isNew}
                            onClickCancel={props.cancel}
                            onClickSave={formEngine.onClickSave}
                            onClickDeactivate={props.onClickDeactivate}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};
