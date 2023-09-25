import React, {useEffect, useState} from 'react';
import {LoadingIndicator} from "../common/LoadingIndicator";
import {Modal} from "../common/Modal";
import {useFormManager} from "../common/hooks/useFormManager";
import {ConfirmDeleteModal} from "../common/ConfirmDeleteModal";
import {CommonFormOptions} from "../common/CommonFormOptions";
import {Constants} from "../common/Constants";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {ApiUtility} from "../common/ApiUtility";
import {RadioOptionSet} from "../common/RadioOptionSet";
import {EmailUtility} from "../common/EmailUtility";
import {StringUtility} from "../common/StringUtility";

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
    const formManager = useFormManager(initialModelState, user, validateData, formStateToSaveData, props.save);
    // pvw todo update approach
    const [roleOptions, setRoleOptions] = useState(null);

    // load form data (roles list) on mount
    useEffect(function () {
        ApiUtility.getRolesList()
            .then(function (rolesList) {
                setRoleOptions(_.map(rolesList, function (role) {
                        return {
                            value: role.id,
                            label: role.name
                        }
                    })
                );
            })
            .catch(function (error) {
                console.log("Error loading form data: ", error);
                MessageDisplayerUtility.error("An error occurred while loading form data.")
            });
    }, []);

    function validateData(handleValidationResult) {
        return new Promise(function (resolve, reject) {
            let validationErrors = [];
            let invalidFields = [];

            Promise.resolve({})
                .then(function () {
                    if (formManager.state.email) {
                        if (!EmailUtility.isValid(formManager.state.email)) {
                            validationErrors.push('Please enter a valid email address.');
                            invalidFields.push('email');
                        }

                        if (
                            user &&
                            user.person &&
                            user.person.email &&
                            formManager.state.email === user.person.email
                        ) {
                            // Don't validate email availability if it's an existing user being updated who already
                            // has that email address.
                            return Promise.resolve();
                        } else {
                            return ApiUtility.getIsPersonEmailAvailable(formManager.state.email)
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
                    if (!formManager.state.firstName) {
                        validationErrors.push('Please enter a first name.');
                        invalidFields.push('firstName');
                    }

                    if (!formManager.state.lastName) {
                        validationErrors.push('Please enter a last name.');
                        invalidFields.push('lastName');
                    }

                    // new users must be given a password
                    if (!user && !formManager.state.password) {
                        validationErrors.push('Please enter a password.');
                        invalidFields.push('password');
                        invalidFields.push('confirmPassword');
                    }

                    if (formManager.state.password && formManager.state.password !== Constants.placeholderPassword) {
                        if (formManager.state.password && formManager.state.password.length < Constants.minPasswordLength) {
                            validationErrors.push(
                                `Passwords must be at least ${Constants.minPasswordLength} characters long.`
                            );
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }

                        if (!StringUtility.containsUpperCaseLetter(formManager.state.password)) {
                            validationErrors.push('Passwords must contain at least one upper case letter.');
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }

                        if (!StringUtility.containsNumber(formManager.state.password)) {
                            validationErrors.push('Passwords must contain at least one number.');
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }

                        if (!StringUtility.containsSpecialCharacter(formManager.state.password)) {
                            validationErrors.push(
                                'Passwords must contain at least one of these characters: ' +
                                '!$%^&*()_+|~-=`{}[]:";\'<>?,./'
                            );
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }

                        if (formManager.state.password !== formManager.state.confirmPassword) {
                            validationErrors.push('Password does not match confirm password.');
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }
                    }

                    if (!formManager.state.selectedRoleOption) {
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
            {(() => {
                // pvw todo fetch in wrapper and pass? use suspense?
                if (!roleOptions) {
                    return (
                        <LoadingIndicator/>
                    );
                } else {
                    return (
                        <div className="common-form user-form">
                            <div className="common-form-body">
                                <div className="common-form-body-row">
                                    <div className={formManager.getFormFieldClasses("common-form-field", "firstName")}>
                                        <div className="common-form-field-label">
                                            First Name
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="firstName"
                                                type="text"
                                                className="common-form-input"
                                                value={formManager.state.firstName}
                                                onChange={(event) => formManager.handleTextFieldChange("firstName", event)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div className={formManager.getFormFieldClasses("common-form-field", "lastName")}>
                                        <div className="common-form-field-label">
                                            Last Name
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="lastName"
                                                type="text"
                                                className="common-form-input"
                                                value={formManager.state.lastName}
                                                onChange={(event) => formManager.handleTextFieldChange("lastName", event)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div className={formManager.getFormFieldClasses("common-form-field", "email")}>
                                        <div className="common-form-field-label">
                                            Email (Username)
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="email"
                                                type="text"
                                                className="common-form-input"
                                                value={formManager.state.email}
                                                onChange={(event) => formManager.handleTextFieldChange("email", event)}
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="common-form-body-row">
                                    <div className={formManager.getFormFieldClasses("common-form-field", "password")}>
                                        <div className="common-form-field-label">
                                            Password
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="password"
                                                type="password"
                                                className="common-form-input"
                                                value={formManager.state.password}
                                                onChange={(event) => formManager.handleTextFieldChange("password", event)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div
                                        className={formManager.getFormFieldClasses("common-form-field", "confirmPassword")}>
                                        <div className="common-form-field-label">
                                            Confirm Password
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="confirmPassword"
                                                type="password"
                                                className="common-form-input"
                                                value={formManager.state.confirmPassword}
                                                onChange={(event) => formManager.handleTextFieldChange("confirmPassword", event)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div className={formManager.getFormFieldClasses(
                                        "common-form-field common-radio-option-set-form-field role-selector",
                                        "selectedRoleOption"
                                    )}>
                                        <div className="common-form-field-label">
                                            Role
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <RadioOptionSet
                                                options={roleOptions}
                                                onSelectRadioOption={formManager.handleRadioOptionChange}
                                                selectedOption={formManager.state.selectedRoleOption}
                                                fieldName="selectedRoleOption"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <CommonFormOptions
                                        allowDelete={!props.isNew}
                                        onClickCancel={props.cancel}
                                        onClickSave={formManager.onClickSave}
                                        confirmDeactivate={formManager.confirmDeactivate}
                                    />
                                </div>
                            </div>
                            {(() => {
                                if (formManager.confirmingDeactivate) {
                                    return (
                                        <ConfirmDeleteModal
                                            cancel={formManager.cancelDeactivate}
                                            deactivate={props.deactivate}
                                            modelTypeName="user"
                                        />
                                    );
                                }
                            })()}
                        </div>
                    );
                }
            })()}
        </Modal>
    );
};
