import React from "react";
import {LoadingIndicator} from "../common/LoadingIndicator";
import {LeaveWithoutSavingWarningUtility} from "../common/LeaveWithoutSavingWarningUtility";
import {PillButton} from "../common/PillButton";
import {Modal} from "../common/Modal";
import {withContext} from "../common/GlobalContextConsumerComponent";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";

var _ = require('underscore');

export var ImportantThingForm = withContext(class extends React.Component {
    constructor(props) {
        super(props);
        const importantThing = _.clone(props.importantThing) || null;

        this.state = {
            id: importantThing ? importantThing.id : null,
            message: (importantThing && importantThing.message) || '',
            weight: (importantThing && importantThing.weight) || 1,

            invalidFields: {},
            validationErrors: [],
            loading: false,
            saved: true,
        };
    }

    setUnsavedState = (stateChange, callback) => {
        LeaveWithoutSavingWarningUtility.enableLeaveWithoutSavingWarnings(
            this.props.context,
            this.props.headerText
        );
        if (stateChange) {
            this.setState(
                _.extend(
                    stateChange,
                    {saved: false}
                ),
                () => {
                    if (callback) {
                        callback();
                    }
                }
            );
        }
    };

    displayValidationErrors = (validationErrors) => {
        for (var e = 0; e < validationErrors.length; e++) {
            MessageDisplayerUtility.error(validationErrors[e]);
        }
    };

    validateData = () => {
        var self = this;
        return new Promise(function (resolve, reject) {
            var validationErrors = [];
            var invalidFields = [];

            if (!self.state.message) {
                validationErrors.push('Please enter a message.');
                invalidFields.push('message');
            }

            if (
                !self.state.weight ||
                !(parseInt(self.state.weight) || 0) ||
                self.state.weight < 1
            ) {
                validationErrors.push('Please enter a weight of at least 1.');
                invalidFields.push('weight');
            }

            if (validationErrors.length > 0) {
                var stateChange = {
                    invalidFields: {},
                    validationErrors: validationErrors
                };
                for (var y = 0; y < invalidFields.length; y++) {
                    stateChange.invalidFields['' + invalidFields[y] + '_invalid'] = true;
                }
                self.setState(stateChange);
                resolve(false);
            } else {
                self.setState({
                    invalidFields: {},
                    validationErrors: []
                });
                resolve(true);
            }
        });
    };

    getSubmitData = () => {
        return _.clone(this.state);
    };

    save = () => {
        var self = this;
        self.setState({loading: true}, function () {
            self.validateData()
                .then(function (validationPasses) {
                    if (validationPasses) {
                        self.props.save(self.getSubmitData());
                    } else {
                        self.setState({loading: false}, function () {
                            window.setTimeout(function () {
                                self.displayValidationErrors(self.state.validationErrors);
                            }, 0);
                        });
                    }
                })
                .catch(function (error) {
                    self.setState({loading: false});
                    console.log("Error validating form: ", error);
                    MessageDisplayerUtility.error("An error occurred while saving.")
                });
        }, 0);
    };

    getFieldClasses = (originalClasses, fieldName) => {
        var returnClasses = originalClasses;
        if (Array.isArray(fieldName)) {
            var allValid = true;
            for (var f = 0; f < fieldName.length; f++) {
                if (this.state.invalidFields[fieldName[f]] + '_invalid') {
                    allValid = false;
                    break;
                }
            }
            if (!allValid) {
                returnClasses += ' invalid';
            }
        } else {
            if (this.state.invalidFields[fieldName + '_invalid']) {
                returnClasses += ' invalid';
            }
        }
        return returnClasses;
    };

    handleTextFieldChange = (fieldName, event) => {
        if (event && event.target) {
            this.setUnsavedState({[fieldName]: event.target.value});
        }
    };

    forceValueToNumeric = (fieldName) => {
        this.setUnsavedState({[fieldName]: parseInt(this.state[fieldName]) || 0});
    };

    render = () => {
        return (
            <Modal
                headerText={this.props.headerText}
                onClickCloseOption={this.props.cancel}
            >
                {(() => {
                    if (this.state.loading) {
                        return (
                            <LoadingIndicator loading={true}/>
                        );
                    } else {
                        return (
                            <div className="common-form important-thing-form">
                                <div className="common-form-body">
                                    <div className="common-form-body-row">
                                        <div className={this.getFieldClasses("common-form-field", "message")}>
                                            <div className="common-form-field-label">
                                                Message
                                            </div>
                                            <div className="common-form-field-input-container">
                                                <input
                                                    type="text"
                                                    className="common-form-input"
                                                    value={this.state.message}
                                                    onChange={this.handleTextFieldChange.bind(this, "message")}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="common-form-body-row">
                                        <div className={this.getFieldClasses("common-form-field", "weight")}>
                                            <div className="common-form-field-label">
                                                Weight
                                            </div>
                                            <div className="common-form-field-input-container">
                                                <input
                                                    type="text"
                                                    className="common-form-input important-thing-weight-input"
                                                    value={this.state.weight}
                                                    onChange={this.handleTextFieldChange.bind(this, "weight")}
                                                    onBlur={this.forceValueToNumeric.bind(this, 'weight')}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="common-form-body-row">
                                        <div className="common-form-options">
                                            <PillButton
                                                containerClasses="common-form-button-container"
                                                buttonClasses="common-form-button cancel-button"
                                                onClick={this.props.cancel}
                                                buttonText={"CANCEL"}
                                            />
                                            <PillButton
                                                containerClasses="common-form-button-container"
                                                buttonClasses="common-form-button save-button"
                                                onClick={this.save}
                                                buttonText={"SAVE"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })()}
            </Modal>
        );
    }
});
