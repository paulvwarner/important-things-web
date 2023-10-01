import React from 'react';

let _ = require('underscore');

export let CheckBox = function (props) {
    function onChange() {
        props.onChange(props.fieldName, !props.checked);
    }

    return (
        <div className="common-form-checkbox" onClick={onChange}>
            {(()=>{
                if (props.checked) {
                    return (
                         <img
                            src="/static/images/check-textcolor.svg"
                            className="common-form-checkbox-check"
                        />
                    )
                }
            })()}
        </div>
    );
};
