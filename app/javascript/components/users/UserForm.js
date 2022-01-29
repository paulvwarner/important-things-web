import React, {useEffect} from 'react';
import {LoadingIndicator} from "../common/LoadingIndicator";
import {Modal} from "../common/Modal";
import {useCommonFormEffects} from "../common/CommonFormHooks";
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

    var initialSelectedRoleOption = null;
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
        roleOptions: null
    };

    const [
        formState,
        save,
        saving,
        deactivate,
        deactivating,
        confirmDeactivate,
        confirmingDeactivate,
        cancelDeactivate,
        handleValidationResult,
        getFormFieldClasses,
        handleTextFieldChange,
        handleRadioOptionChange,
        handleCheckboxChange,
        forceValueToNumeric,
        mergeToFormState
    ] = useCommonFormEffects(props, initialModelState, user, validateData, formStateToSaveData);

    // load form data (roles list) on mount
    useEffect(function () {
        ApiUtility.getRolesList()
            .then(function (rolesList) {
                mergeToFormState({
                    roleOptions: _.map(rolesList, function (role) {
                        return {
                            value: role.id,
                            label: role.name
                        }
                    })
                });
            })
            .catch(function (error) {
                console.log("Error loading form data: ", error);
                MessageDisplayerUtility.error("An error occurred while loading form data.")
            });
    }, []);

    function validateData() {
        return new Promise(function (resolve, reject) {
            let validationErrors = [];
            let invalidFields = [];

            Promise.resolve({})
                .then(function () {
                    if (formState.email) {
                        if (!EmailUtility.isValid(formState.email)) {
                            validationErrors.push('Please enter a valid email address.');
                            invalidFields.push('email');
                        }

                        if (
                            user &&
                            user.person &&
                            user.person.email &&
                            formState.email === user.person.email
                        ) {
                            // Don't validate email availability if it's an existing user being updated who already
                            // has that email address.
                            return Promise.resolve();
                        } else {
                            return ApiUtility.getIsPersonEmailAvailable(formState.email)
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
                    if (!formState.firstName) {
                        validationErrors.push('Please enter a first name.');
                        invalidFields.push('firstName');
                    }

                    if (!formState.lastName) {
                        validationErrors.push('Please enter a last name.');
                        invalidFields.push('lastName');
                    }

                    // new users must be given a password
                    if (!user && !formState.password) {
                        validationErrors.push('Please enter a password.');
                        invalidFields.push('password');
                        invalidFields.push('confirmPassword');
                    }

                    if (formState.password && formState.password !== Constants.placeholderPassword) {
                        if (formState.password && formState.password.length < Constants.minPasswordLength) {
                            validationErrors.push(
                                `Passwords must be at least ${Constants.minPasswordLength} characters long.`
                            );
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }

                        if (!StringUtility.containsUpperCaseLetter(formState.password)) {
                            validationErrors.push('Passwords must contain at least one upper case letter.');
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }

                        if (!StringUtility.containsNumber(formState.password)) {
                            validationErrors.push('Passwords must contain at least one number.');
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }

                        if (!StringUtility.containsSpecialCharacter(formState.password)) {
                            validationErrors.push(
                                'Passwords must contain at least one of these characters: ' +
                                '!$%^&*()_+|~-=`{}[]:";\'<>?,./'
                            );
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }

                        if (formState.password !== formState.confirmPassword) {
                            validationErrors.push('Password does not match confirm password.');
                            invalidFields.push('password');
                            invalidFields.push('confirmPassword');
                        }
                    }

                    if (!formState.selectedRoleOption) {
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
                if (saving || deactivating || !formState.roleOptions) {
                    return (
                        <LoadingIndicator/>
                    );
                } else {
                    return (
                        <div className="common-form user-form">
                            <div className="common-form-body">
                                <div className="common-form-body-row">
                                    <div className={getFormFieldClasses("common-form-field", "firstName")}>
                                        <div className="common-form-field-label">
                                            First Name
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="firstName"
                                                type="text"
                                                className="common-form-input"
                                                value={formState.firstName}
                                                onChange={handleTextFieldChange.bind(null, "firstName")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div className={getFormFieldClasses("common-form-field", "lastName")}>
                                        <div className="common-form-field-label">
                                            Last Name
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="lastName"
                                                type="text"
                                                className="common-form-input"
                                                value={formState.lastName}
                                                onChange={handleTextFieldChange.bind(null, "lastName")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div className={getFormFieldClasses("common-form-field", "email")}>
                                        <div className="common-form-field-label">
                                            Email (Username)
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="email"
                                                type="text"
                                                className="common-form-input"
                                                value={formState.email}
                                                onChange={handleTextFieldChange.bind(null, "email")}
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="common-form-body-row">
                                    <div className={getFormFieldClasses("common-form-field", "password")}>
                                        <div className="common-form-field-label">
                                            Password
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="password"
                                                type="password"
                                                className="common-form-input"
                                                value={formState.password}
                                                onChange={handleTextFieldChange.bind(null, "password")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div className={getFormFieldClasses("common-form-field", "confirmPassword")}>
                                        <div className="common-form-field-label">
                                            Confirm Password
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <input
                                                id="confirmPassword"
                                                type="password"
                                                className="common-form-input"
                                                value={formState.confirmPassword}
                                                onChange={handleTextFieldChange.bind(null, "confirmPassword")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="common-form-body-row">
                                    <div className={getFormFieldClasses(
                                        "common-form-field common-radio-option-set-form-field role-selector",
                                        "selectedRoleOption"
                                    )}>
                                        <div className="common-form-field-label">
                                            Role
                                        </div>
                                        <div className="common-form-field-input-container">
                                            <RadioOptionSet
                                                options={formState.roleOptions}
                                                onSelectRadioOption={handleRadioOptionChange}
                                                selectedOption={formState.selectedRoleOption}
                                                fieldName="selectedRoleOption"
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="common-form-body-row">
                                    <CommonFormOptions
                                        allowDelete={!props.isNew}
                                        cancel={props.cancel}
                                        save={save}
                                        confirmDeactivate={confirmDeactivate}
                                    />
                                </div>
                            </div>
                            {(() => {
                                if (confirmingDeactivate) {
                                    return (
                                        <ConfirmDeleteModal
                                            cancel={cancelDeactivate}
                                            deactivate={deactivate}
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
