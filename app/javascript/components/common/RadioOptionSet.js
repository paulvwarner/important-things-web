import React from 'react';

let _ = require('underscore');

export let RadioOptionSet = function (props) {
    function onSelectRadioOption(selectedOption) {
        props.onSelectRadioOption(props.fieldName, selectedOption);
    }

    let optionsDisplay = [];
    for (let i = 0; i < props.options.length; i++) {
        let option = props.options[i];

        optionsDisplay.push(
            <div key={i} className="common-radio-option" onClick={() => onSelectRadioOption(option)}>
                <div className={`common-radio-option-circle option-circle-${option.value}`}>
                    {(() => {
                        if (props.selectedOption && props.selectedOption.value === option.value) {
                            return (
                                <div className="common-radio-option-dot"/>
                            );
                        }
                    })()}
                </div>
                <div className="common-radio-option-label">{option.label}</div>
            </div>
        )
    }

    return (
        <div className="radio-option-set">{optionsDisplay}</div>
    );
};
