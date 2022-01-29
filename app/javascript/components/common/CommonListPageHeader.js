import React from 'react';
import {PillButton} from "./PillButton";
import {DelayedSearchBar} from "./DelayedSearchBar";

export const CommonListPageHeader = function (props) {
    return (
        <div className="common-list-page-header">
            <div className="common-list-page-header-content">
                <div className="common-list-page-header-content-left">
                    {(() => {
                        if (props.leftHeaderRenderer) {
                            return props.leftHeaderRenderer();
                        } else {
                            return (
                                <div className="common-list-page-header-text">
                                    {props.headerText}
                                </div>
                            )
                        }
                    })()}
                </div>
                <div className="common-list-page-header-content-right">
                    <DelayedSearchBar
                        performSearch={props.performSearch}
                        value={props.searchText}
                        placeholder={props.searchPlaceholderText}
                    />
                    <PillButton
                        onClick={props.onClickAddButton}
                        buttonClasses="add-button"
                        buttonText="ADD"
                    />
                </div>
            </div>
        </div>
    )
};
