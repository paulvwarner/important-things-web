import React from "react";
import {withContext} from "./GlobalContextConsumerComponent";
import {UrlUtility} from "./UrlUtility";

export var ListPaginationOptions = withContext(class extends React.Component {
    changePage = (destinationPageNumber) => {
        let queryParams = UrlUtility.getQueryParamsFromProps(this.props);
        queryParams.page = destinationPageNumber;
        let queryString = UrlUtility.getUrlQueryStringFromQueryParamsObject(queryParams) || '';
        window.scrollTo(0, 0);
        this.props.context.navigator.navigateTo(this.props.urlBase + queryString);
    };

    render = () => {
        let pageCountNumeric = parseInt(this.props.pageCount);
        let selectedPageNumeric = parseInt(this.props.selectedPage);
        const maxPaginationNumberLinksDisplayed = 5;

        if (pageCountNumeric > 1) {
            var leftOffset = 2;
            var rightOffset = 2;

            if (selectedPageNumeric === 1 || selectedPageNumeric === 2) {
                rightOffset = maxPaginationNumberLinksDisplayed - selectedPageNumeric;
            }

            if (selectedPageNumeric === pageCountNumeric) {
                leftOffset = maxPaginationNumberLinksDisplayed - 1;
            } else if (selectedPageNumeric === (pageCountNumeric - 1)) {
                leftOffset = maxPaginationNumberLinksDisplayed - 2;
            }

            var startDisplayNumber = Math.max(1, selectedPageNumeric - leftOffset);
            var endDisplayNumber = Math.min(pageCountNumeric, selectedPageNumeric + rightOffset);

            var pageNumbers = [];
            for (var i = startDisplayNumber; i <= endDisplayNumber; i++) {
                var outerClasses = "pagination-element pagination-link ";
                if (i === selectedPageNumeric) {
                    outerClasses += 'pagination-link-selected';
                }

                pageNumbers.push(
                    <div
                        className={outerClasses}
                        key={i}
                        onClick={this.changePage.bind(this, i)}
                    >
                        {i}
                    </div>
                );
            }

            var leftButtonClasses = "circle-button-container invisible";
            var leftEllipsisClasses = "pagination-ellipsis invisible";
            var rightEllipsisClasses = "pagination-ellipsis invisible"
            var rightButtonClasses = "circle-button-container invisible";

            if (this.props.selectedPage > 1) {
                leftButtonClasses = "circle-button-container ";
                if (startDisplayNumber !== 1) {
                    leftEllipsisClasses = "pagination-ellipsis"
                }
            }

            if (this.props.selectedPage < this.props.pageCount) {
                rightButtonClasses = "circle-button-container";
                if (endDisplayNumber !== this.props.pageCount) {
                    rightEllipsisClasses = "pagination-ellipsis";
                }
            }

            return (
                <div className="common-list-pagination-options">
                    <div className="common-list-pagination-options-left">
                        <div className="paging-nav-cell ">
                            <div className="pagination-element">
                                <div
                                    className={"pagination-nav-button-container " + (leftButtonClasses || '')}
                                    onClick={this.changePage.bind(this, parseInt(this.props.selectedPage) - 1)}
                                >
                                    <img
                                        src="/static/images/chevron-left-black.svg"
                                        onMouseOver={e => (e.currentTarget.src = "/static/images/chevron-left-white.svg")}
                                        onMouseOut={e => (e.currentTarget.src = "/static/images/chevron-left-black.svg")}
                                        className="pagination-nav-button-icon"
                                    />
                                </div>
                            </div>
                            {(() => {
                                if (pageCountNumeric > maxPaginationNumberLinksDisplayed) {
                                    return (
                                        <div
                                            className={leftEllipsisClasses}
                                        >...
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    </div>

                    {pageNumbers}

                    <div className="common-list-pagination-options-right">
                        <div className="paging-nav-cell">
                            {(() => {
                                if (pageCountNumeric > maxPaginationNumberLinksDisplayed) {
                                    return (
                                        <div
                                            className={rightEllipsisClasses}
                                        >...
                                        </div>
                                    );
                                }
                            })()}
                            <div className="pagination-element">
                                <div
                                    className={"pagination-nav-button-container " + (rightButtonClasses || '')}
                                    onClick={this.changePage.bind(this, parseInt(this.props.selectedPage) + 1)}
                                >
                                    <img
                                        src="/static/images/chevron-right-black.svg"
                                        onMouseOver={e => (e.currentTarget.src = "/static/images/chevron-right-white.svg")}
                                        onMouseOut={e => (e.currentTarget.src = "/static/images/chevron-right-black.svg")}
                                        className="pagination-nav-button-icon"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
});