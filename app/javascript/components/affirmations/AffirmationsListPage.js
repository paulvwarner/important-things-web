import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {UrlUtility} from "../common/UrlUtility";
import {CreateAffirmation} from "./CreateAffirmation";
import {UpdateAffirmation} from "./UpdateAffirmation";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {useLocation} from "react-router-dom";
import {useUrlManagedList} from "../common/hooks/useUrlManagedList";
import {CommonListPageHeader} from "../common/CommonListPageHeader";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export const AffirmationsListPage = function (props) {
    const context = useContext(GlobalContext);
    let location = useLocation();

    const [listState, reloadList] = useUrlManagedList(
        props, 'affirmationId', ApiUtility.getAffirmationsList, 'affirmation'
    );

    function goToAddAffirmationModal() {
        context.navigator.navigateTo('/affirmations/add' + location.search);
    }

    function goToUpdateAffirmationModal(affirmation) {
        context.navigator.navigateTo('/affirmations/' + affirmation.id + location.search);
    }

    function closeModals() {
        context.navigator.navigateTo('/affirmations' + location.search);
    }

    function afterSuccessfulSave() {
        closeModals()
        reloadList();
    }

    function performSearch(searchText) {
        if (listState.searchText !== searchText) {
            let queryParams = UrlUtility.getQueryParamsFromProps(props);
            queryParams.page = 1;
            queryParams.searchText = searchText;
            let queryString = UrlUtility.getUrlQueryStringFromQueryParamsObject(queryParams);
            context.navigator.navigateTo('/affirmations' + queryString);
        }
    }

    function renderAffirmationsListDisplay(affirmationsList) {
        let affirmationsListDisplay = [];

        for (let i = 0; i < affirmationsList.length; i++) {
            const affirmation = affirmationsList[i];

            affirmationsListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                    onClick={goToUpdateAffirmationModal.bind(null, affirmation)}
                >
                    <div
                        className="common-list-row-cell common-list-row-value-cell affirmations-list-row-cell message"
                    >{affirmation.message}</div>
                </div>
            );
        }

        return affirmationsListDisplay;
    }

    if (listState.modelList) {
        return (
            <div className="common-list-page affirmations-list-page">
                <CommonListPageHeader
                    headerText="Affirmations"
                    performSearch={performSearch}
                    searchText={listState.searchText}
                    searchPlaceholderText="Search Affirmations"
                    onClickAddButton={goToAddAffirmationModal}
                />

                <div className="common-list-page-content">
                    <ConditionalRenderer if={listState.loading} renderer={() => <OverlayLoadingIndicator/>}/>
                    {(() => {
                        if (listState.modelList.length > 0) {
                            return (
                                <Fragment>
                                    <div className="common-list-header">
                                        <div key={0} className="common-list-row common-list-labels-row">
                                            <div
                                                className="common-list-row-cell common-list-row-label-cell affirmations-list-row-cell message"
                                            >Message
                                            </div>
                                        </div>
                                    </div>
                                    <div className="common-list-content">
                                        {renderAffirmationsListDisplay(listState.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listState.pageCount}
                                        selectedPage={listState.selectedPage}
                                        urlBase="/affirmations"
                                    />
                                </Fragment>
                            );
                        } else {
                            return (
                                <div className="common-empty-list-message-container">
                                    <div className="common-empty-list-message">No affirmations found.</div>
                                </div>
                            );
                        }
                    })()}
                </div>
                {(() => {
                    if (listState.showCreateModal) {
                        return (
                            <CreateAffirmation
                                cancel={closeModals}
                                afterSuccessfulSave={afterSuccessfulSave}
                            />
                        );
                    } else if (listState.showUpdateModal) {
                        return (
                            <UpdateAffirmation
                                cancel={closeModals}
                                afterSuccessfulSave={afterSuccessfulSave}
                                affirmationId={listState.updateModelId}
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
