import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {PillButton} from "../common/PillButton";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {UrlUtility} from "../common/UrlUtility";
import {CreateImportantThing} from "./CreateImportantThing";
import {UpdateImportantThing} from "./UpdateImportantThing";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {DelayedSearchBar} from "../common/DelayedSearchBar";
import {useLocation} from "react-router-dom";
import {useCommonListEffects} from "../common/CommonListHooks";
import {CommonListPageHeader} from "../common/CommonListPageHeader";

export const ImportantThingsListPage = function (props) {
    const context = useContext(GlobalContext);
    let location = useLocation();

    const [listState, loadingListData] = useCommonListEffects(
        props, 'importantThingId', ApiUtility.getImportantThingsList, 'important thing'
    );

    function goToAddImportantThingModal() {
        context.navigator.navigateTo('/important-things/add' + location.search);
    }

    function goToUpdateImportantThingModal(importantThing) {
        context.navigator.navigateTo('/important-things/' + importantThing.id + location.search);
    }

    function closeModals() {
        context.navigator.navigateTo('/important-things' + location.search);
    }

    function performSearch(searchText) {
        if (listState.searchText !== searchText) {
            let queryParams = UrlUtility.getQueryParamsFromProps(props);
            queryParams.page = 1;
            queryParams.searchText = searchText;
            let queryString = UrlUtility.getUrlQueryStringFromQueryParamsObject(queryParams);
            context.navigator.navigateTo('/important-things' + queryString);
        }
    }

    function renderImportantThingsListDisplay(importantThingsList) {
        let importantThingsListDisplay = [];

        for (let i = 0; i < importantThingsList.length; i++) {
            const importantThing = importantThingsList[i];

            importantThingsListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                    onClick={goToUpdateImportantThingModal.bind(null, importantThing)}
                >
                    <div
                        className="common-list-row-cell common-list-row-value-cell important-things-list-row-cell message"
                    >{importantThing.message}</div>
                    <div
                        className="common-list-row-cell common-list-row-value-cell important-things-list-row-cell weight"
                    >{importantThing.weight}</div>
                </div>
            );
        }

        return importantThingsListDisplay;
    }

    if (listState.modelList) {
        return (
            <div className="common-list-page important-things-list-page">
                <CommonListPageHeader
                    headerText="Important Things"
                    performSearch={performSearch}
                    searchText={listState.searchText}
                    searchPlaceholderText="Search Important Things"
                    onClickAddButton={goToAddImportantThingModal}
                />

                <div className="common-list-page-content">
                    {(() => {
                        if (loadingListData) {
                            return (
                                <OverlayLoadingIndicator/>
                            );
                        }
                    })()}
                    {(() => {
                        if (listState.modelList.length > 0) {
                            return (
                                <Fragment>
                                    <div className="common-list-header">
                                        <div key={0} className="common-list-row common-list-labels-row">
                                            <div
                                                className="common-list-row-cell common-list-row-label-cell important-things-list-row-cell message"
                                            >Message
                                            </div>
                                            <div
                                                className="common-list-row-cell common-list-row-label-cell important-things-list-row-cell weight"
                                            >Weight
                                            </div>
                                        </div>
                                    </div>
                                    <div className="common-list-content">
                                        {renderImportantThingsListDisplay(listState.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listState.pageCount}
                                        selectedPage={listState.selectedPage}
                                        urlBase="/important-things"
                                    />
                                </Fragment>
                            );
                        } else {
                            return (
                                <div className="common-empty-list-message-container">
                                    <div
                                        className="common-empty-list-message"
                                    >No important things found.
                                    </div>
                                </div>
                            );
                        }
                    })()}
                </div>
                {(() => {
                    if (listState.showCreateModal) {
                        return (
                            <CreateImportantThing
                                cancel={closeModals}
                                afterSuccessfulSave={closeModals}
                            />
                        );
                    } else if (listState.showUpdateModal) {
                        return (
                            <UpdateImportantThing
                                cancel={closeModals}
                                afterSuccessfulSave={closeModals}
                                importantThingId={listState.updateModelId}
                            />
                        );
                    }
                })()}
            </div>
        );
    } else {
        return (
            <OverlayLoadingIndicator/>
        );
    }
};
