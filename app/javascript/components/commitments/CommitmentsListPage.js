import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {PillButton} from "../common/PillButton";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {UrlUtility} from "../common/UrlUtility";
import {CreateCommitment} from "./CreateCommitment";
import {UpdateCommitment} from "./UpdateCommitment";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {DelayedSearchBar} from "../common/DelayedSearchBar";
import {useLocation} from "react-router-dom";
import {useUrlManagedList} from "../common/hooks/useUrlManagedList";
import {CommonListPageHeader} from "../common/CommonListPageHeader";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export const CommitmentsListPage = function (props) {
    const context = useContext(GlobalContext);
    let location = useLocation();

    const [listState, reloadList] = useUrlManagedList(
        props, 'commitmentId', ApiUtility.getCommitmentsList, 'commitment'
    );

    function goToAddCommitmentModal() {
        context.navigator.navigateTo('/commitments/add' + location.search);
    }

    function goToUpdateCommitmentModal(commitment) {
        context.navigator.navigateTo('/commitments/' + commitment.id + location.search);
    }

    function closeModals() {
        context.navigator.navigateTo('/commitments' + location.search);
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
            context.navigator.navigateTo('/commitments' + queryString);
        }
    }

    function renderCommitmentsListDisplay(commitmentsList) {
        let commitmentsListDisplay = [];

        for (let i = 0; i < commitmentsList.length; i++) {
            const commitment = commitmentsList[i];

            commitmentsListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                    onClick={goToUpdateCommitmentModal.bind(null, commitment)}
                >
                    <div
                        className="common-list-row-cell common-list-row-value-cell commitments-list-row-cell title"
                    >{commitment.title}</div>
                </div>
            );
        }

        return commitmentsListDisplay;
    }

    if (listState.modelList) {
        return (
            <div className="common-list-page commitments-list-page">
                <CommonListPageHeader
                    headerText="Commitments"
                    performSearch={performSearch}
                    searchText={listState.searchText}
                    searchPlaceholderText="Search Commitments"
                    onClickAddButton={goToAddCommitmentModal}
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
                                                className="common-list-row-cell common-list-row-label-cell commitments-list-row-cell title"
                                            >Title
                                            </div>
                                        </div>
                                    </div>
                                    <div className="common-list-content">
                                        {renderCommitmentsListDisplay(listState.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listState.pageCount}
                                        selectedPage={listState.selectedPage}
                                        urlBase="/commitments"
                                    />
                                </Fragment>
                            );
                        } else {
                            return (
                                <div className="common-empty-list-message-container">
                                    <div className="common-empty-list-message">No commitments found.</div>
                                </div>
                            );
                        }
                    })()}
                </div>
                {(() => {
                    if (listState.showCreateModal) {
                        return (
                            <CreateCommitment
                                cancel={closeModals}
                                afterSuccessfulSave={afterSuccessfulSave}
                            />
                        );
                    } else if (listState.showUpdateModal) {
                        return (
                            <UpdateCommitment
                                cancel={closeModals}
                                afterSuccessfulSave={afterSuccessfulSave}
                                commitmentId={listState.updateModelId}
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
