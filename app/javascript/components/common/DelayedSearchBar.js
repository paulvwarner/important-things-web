import React, {useState} from 'react';
import {Constants} from "./Constants";
import {LoadingIndicator} from "./LoadingIndicator";

let delayedSearchTimeout = null;

export let DelayedSearchBar = function (props) {
    const [searchText, setSearchText] = useState(props.value || '');
    const [prevValue, setPrevValue] = useState(props.value || '');

    if (props.value !== prevValue) {
        setPrevValue(props.value);
        setSearchText(props.value || '');
    }

    function clearDelayedSearchTimeout() {
        window.clearTimeout(delayedSearchTimeout);
        delayedSearchTimeout = null;
    }

    function handleSearchTextChange(event) {
        clearDelayedSearchTimeout();
        let updatedSearchText = event.target.value;

        setSearchText(updatedSearchText);

        clearDelayedSearchTimeout();
        delayedSearchTimeout = window.setTimeout(function () {
            props.performSearch(updatedSearchText);
        }, Constants.searchDelayMs);
    }

    return (
        <div className="search-bar-outer-container">
            <div className="search-bar-loading-indicator-container">
                {(() => {
                    if (searchText !== props.value) {
                        return (
                            <LoadingIndicator/>
                        );
                    }
                })()}
            </div>
            <div className="search-bar-container">
                <div className="search-bar-icon-container">
                    <img
                        src="/static/images/search-black.svg"
                        className="search-bar-icon"
                    />
                </div>
                <div className="search-bar-field-container">
                    <input
                        className="search-bar-field"
                        value={searchText}
                        onChange={handleSearchTextChange}
                        placeholder={props.placeholder}
                    />
                </div>
            </div>
        </div>
    );
};
