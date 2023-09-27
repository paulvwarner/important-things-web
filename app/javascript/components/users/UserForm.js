import React from 'react';
import {Modal} from "../common/Modal";
import {useModelFormEngine} from "../common/hooks/useModelFormEngine";
import {CommonFormOptions} from "../common/CommonFormOptions";
import {Constants} from "../common/Constants";
import {ApiUtility} from "../common/ApiUtility";
import {RadioOptionSet} from "../common/RadioOptionSet";
import {EmailUtility} from "../common/EmailUtility";
import {StringUtility} from "../common/StringUtility";
import {ConditionalRenderer} from "../common/ConditionalRenderer";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";

let _ = require('underscore');

export let UserForm = function (props) {
    const user = _.clone(props.user) || null;

    let initialSelectedRoleOption = null;
    if (user && user.user_roles && user.user_roles.length > 0 && user.user_roles[0].role) {
        initialSelectedRoleOption = {
            value: user.user_roles[0].role.id,
            label: user.user_roles[0].role.name
        };
    }

    const initialModelState = {
        email: (user && user.person.email) || '',
        firstName: (user && user.person.first_name) || '',
        lastName: (user && user.person.last_name) || '',
        password: user ? Constants.placeholderPassword : '',
        confirmPassword: user ? Constants.placeholderPassword : '',
        selectedRoleOption: initialSelectedRoleOption,
    };

    const fetchSupportingData = function () {
        return ApiUtility.getRolesList()
            .then(function (roles) {
                return Promise.resolve({
                    roleOptions: _.map(roles, function (role) {
                        return {
                            value: role.id,
                            label: role.name
                        }
                    })
                });
            })
    }

    const formEngine = useModelFormEngine(
        initialModelState, user, fetchSupportingData, validateForm, formStateToSaveData, props.save
    );

    function validateForm(handleValidationResult) {
        return new Promise(function (resolve, reject) {
            let validationErrors = [];
            let invalidFields = [];

            Promise.resolve({})
                .then(function () {
                    if (formEngine.state.email) {
                        if (!EmailUtility.isValid(formEngine.state.email)) {
                            validationErrors.push('Please enter a valid email address.');
                            invalidFields.push('email');
                        }

                        if (
                            user &&
                            user.person &&
                            user.person.email &&
                            formEngine.state.email === user.person.email
                        ) {
                            // Don't validate email availability if it's an existing user being updated who already
                            // has that email address.
                            return Promise.resolve();
                        } else {
                            return ApiUtility.getIsPersonEmailAvailable(formEngine.state.email)
                                .then(function (emailIsAvailable) {
                                    if (!emailIsAvailable) {
                                        validationErrors.push('Another user is already using that email address - please enter a different email address.');
                                        invalidFields.push('email');
                                    }
                                    return Promise.resolve();
                                });
                        }
                    } else {
                        validationErrors.push('Please enter an email address.');
                        invalidFields.push('email');

                        return Promise.resolve();
                    }
                })
                .then(function () {
                    if (!formEngine.state.firstName) {
                        validationErrors.push('Please enter a first name.');
                        invalidFields.push('firstName');
                    }

                    if (!formEngine.state.lastName) {
                        validationErrors.push('Please enter a last name.');
                        invalidFields.push('lastName');
                    }

                    // new users must be given a password
                    if (!user && !formEngine.state.password) {
                        validationErrors.push('Please enter a password.');
                        invalidFields.push('password');
                        invalidFields.push('confirmPassword');
                    }

                    if (formEngine.state.password && formEngine.state.password !== Constants.placeholderPassword) {
                        if (formEngine.state.password && formEngine.state.password.length < Constants.minPasswordLength) {
                            validationErrors.push(
                                `Passwords must be at least ${Constants.minPasswordLength} characters long.`
                            );
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }

                        if (!StringUtility.containsUpperCaseLetter(formEngine.state.password)) {
                            validationErrors.push('Passwords must contain at least one upper case letter.');
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }

                        if (!StringUtility.containsNumber(formEngine.state.password)) {
                            validationErrors.push('Passwords must contain at least one number.');
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }

                        if (!StringUtility.containsSpecialCharacter(formEngine.state.password)) {
                            validationErrors.push(
                                'Passwords must contain at least one of these characters: ' +
                                '!$%^&*()_+|~-=`{}[]:";\'<>?,./'
                            );
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }

                        if (formEngine.state.password !== formEngine.state.confirmPassword) {
                            validationErrors.push('Password does not match confirm password.');
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }
                    }

                    if (!formEngine.state.selectedRoleOption) {
                        validationErrors.push('Please select a role.');
                        invalidFields.push('selectedRoleOption');
                    }

                    return handleValidationResult(validationErrors, invalidFields, resolve);
                });
        });
    }

    function formStateToSaveData(formStateToTransform) {
        let saveData = _.clone(formStateToTransform);
        saveData.roleId = formStateToTransform.selectedRoleOption.value;
        return saveData;
    }

    return (
        <Modal
            headerText={props.headerText}
            onClickCloseOption={props.cancel}
        >
            <ConditionalRenderer if={formEngine.state.showOverlayLoadingIndicator} renderer={() => (
                <OverlayLoadingIndicator/>
            )}/>
            <ConditionalRenderer if={formEngine.state.supportingData} renderer={() => (
                <div className="common-form user-form">
                    <div className="common-form-body">
                        <div className="common-form-body-row">
                            <div className={formEngine.getFormFieldClasses("common-form-field", "firstName")}>
                                <div className="common-form-field-label">
                                    First Name
                                </div>
                                <div className="common-form-field-input-container">
                                    <input
                                        id="firstName"
                                        type="text"
                                        className="common-form-input"
                                        value={formEngine.state.firstName}
                                        onChange={(event) => formEngine.handleTextFieldChange("firstName", event)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="common-form-body-row">
                            <div className={formEngine.getFormFieldClasses("common-form-field", "lastName")}>
                                <div className="common-form-field-label">
                                    Last Name
                                </div>
                                <div className="common-form-field-input-container">
                                    <input
                                        id="lastName"
                                        type="text"
                                        className="common-form-input"
                                        value={formEngine.state.lastName}
                                        onChange={(event) => formEngine.handleTextFieldChange("lastName", event)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="common-form-body-row">
                            <div className={formEngine.getFormFieldClasses("common-form-field", "email")}>
                                <div className="common-form-field-label">
                                    Email (Username)
                                </div>
                                <div className="common-form-field-input-container">
                                    <input
                                        id="email"
                                        type="text"
                                        className="common-form-input"
                                        value={formEngine.state.email}
                                        onChange={(event) => formEngine.handleTextFieldChange("email", event)}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="common-form-body-row">
                            <div className={formEngine.getFormFieldClasses("common-form-field", "password")}>
                                <div className="common-form-field-label">
                                    Password
                                </div>
                                <div className="common-form-field-input-container">
                                    <input
                                        id="password"
                                        type="password"
                                        className="common-form-input"
                                        value={formEngine.state.password}
                                        onChange={(event) => formEngine.handleTextFieldChange("password", event)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="common-form-body-row">
                            <div
                                className={formEngine.getFormFieldClasses("common-form-field", "confirmPassword")}>
                                <div className="common-form-field-label">
                                    Confirm Password
                                </div>
                                <div className="common-form-field-input-container">
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        className="common-form-input"
                                        value={formEngine.state.confirmPassword}
                                        onChange={(event) => formEngine.handleTextFieldChange("confirmPassword", event)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="common-form-body-row">
                            <div className={formEngine.getFormFieldClasses(
                                "common-form-field common-radio-option-set-form-field role-selector",
                                "selectedRoleOption"
                            )}>
                                <div className="common-form-field-label">
                                    Role
                                </div>
                                <div className="common-form-field-input-container">
                                    <RadioOptionSet
                                        options={formEngine.state.supportingData.roleOptions}
                                        onSelectRadioOption={formEngine.handleRadioOptionChange}
                                        selectedOption={formEngine.state.selectedRoleOption}
                                        fieldName="selectedRoleOption"
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
            )}/>
        </Modal>
    );
};
