import React, {useContext} from "react";
import {UrlUtility} from "./UrlUtility";
import {GlobalContext} from "../admin-frame/AdminFrame";

export let ListPaginationOptions = function (props) {
    const context = useContext(GlobalContext);

    function changePage(destinationPageNumber) {
        let queryParams = UrlUtility.getQueryParamsFromProps(props);
        queryParams.page = destinationPageNumber;
        let queryString = UrlUtility.getUrlQueryStringFromQueryParamsObject(queryParams) || '';
        window.scrollTo(0, 0);
        context.navigator.navigateTo(props.urlBase + queryString);
    }

    let pageCountNumeric = parseInt(props.pageCount);
    let selectedPageNumeric = parseInt(props.selectedPage);
    const maxPaginationNumberLinksDisplayed = 5;

    if (pageCountNumeric > 1) {
        let leftOffset = 2;
        let rightOffset = 2;

        if (selectedPageNumeric === 1 || selectedPageNumeric === 2) {
            rightOffset = maxPaginationNumberLinksDisplayed - selectedPageNumeric;
        }

        if (selectedPageNumeric === pageCountNumeric) {
            leftOffset = maxPaginationNumberLinksDisplayed - 1;
        } else if (selectedPageNumeric === (pageCountNumeric - 1)) {
            leftOffset = maxPaginationNumberLinksDisplayed - 2;
        }

        let startDisplayNumber = Math.max(1, selectedPageNumeric - leftOffset);
        let endDisplayNumber = Math.min(pageCountNumeric, selectedPageNumeric + rightOffset);

        let pageNumbers = [];
        for (let i = startDisplayNumber; i <= endDisplayNumber; i++) {
            let outerClasses = "pagination-element pagination-link ";
            const index = i;
            if (i === selectedPageNumeric) {
                outerClasses += 'pagination-link-selected';
            }

            pageNumbers.push(
                <div
                    className={outerClasses}
                    key={index}
                    onClick={() => changePage(index)}
                >
                    {index}
                </div>
            );
        }

        let leftButtonClasses = "circle-button-container invisible";
        let leftEllipsisClasses = "pagination-ellipsis invisible";
        let rightEllipsisClasses = "pagination-ellipsis invisible"
        let rightButtonClasses = "circle-button-container invisible";

        if (props.selectedPage > 1) {
            leftButtonClasses = "circle-button-container ";
            if (startDisplayNumber !== 1) {
                leftEllipsisClasses = "pagination-ellipsis"
            }
        }

        if (props.selectedPage < props.pageCount) {
            rightButtonClasses = "circle-button-container";
            if (endDisplayNumber !== props.pageCount) {
                rightEllipsisClasses = "pagination-ellipsis";
            }
        }

        return (
            <div className="common-list-pagination-options">
                <div className="common-list-pagination-options-left">
                    <div className="paging-nav-cell ">
                        <div className="pagination-element">
                            <div
                                className={`pagination-nav-button-container ${leftButtonClasses || ''}`}
                                onClick={() => changePage(parseInt(props.selectedPage) - 1)}
                            >
                                <img
                                    src="/static/images/chevron-left-textcolor.svg"
                                    onMouseOver={e => (e.currentTarget.src = "/static/images/chevron-left-white.svg")}
                                    onMouseOut={e => (e.currentTarget.src = "/static/images/chevron-left-textcolor.svg")}
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
                                className={`pagination-nav-button-container ${rightButtonClasses || ''}`}
                                onClick={() => changePage(parseInt(props.selectedPage) + 1)}
                            >
                                <img
                                    src="/static/images/chevron-right-textcolor.svg"
                                    onMouseOver={e => (e.currentTarget.src = "/static/images/chevron-right-white.svg")}
                                    onMouseOut={e => (e.currentTarget.src = "/static/images/chevron-right-textcolor.svg")}
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
};
