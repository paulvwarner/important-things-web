import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {CreateCommitment} from "./CreateCommitment";
import {UpdateCommitment} from "./UpdateCommitment";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {useUrlListManager} from "../common/hooks/useUrlListManager";
import {CommonListPageHeader} from "../common/CommonListPageHeader";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export const CommitmentsListPage = function (props) {
    const context = useContext(GlobalContext);

    const listPageManager = useUrlListManager(
        props,
        'commitmentId',
        ApiUtility.getCommitmentsList,
        'commitment',
        '/commitments',
        context.navigator
    );

    function renderCommitmentsListDisplay(commitmentsList) {
        let commitmentsListDisplay = [];

        for (let i = 0; i < commitmentsList.length; i++) {
            const commitment = commitmentsList[i];

            commitmentsListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                    onClick={() => listPageManager.goToUpdateModal(commitment)}
                >
                    <div
                        className="common-list-row-cell common-list-row-value-cell commitments-list-row-cell title"
                    >{commitment.title}</div>
                </div>
            );
        }

        return commitmentsListDisplay;
    }

    if (listPageManager.state.modelList) {
        return (
            <div className="common-list-page commitments-list-page">
                <CommonListPageHeader
                    headerText="Commitments"
                    performSearch={listPageManager.performSearch}
                    searchText={listPageManager.state.searchText}
                    searchPlaceholderText="Search Commitments"
                    onClickAddButton={listPageManager.goToAddModal}
                />

                <div className="common-list-page-content">
                    <ConditionalRenderer
                        if={listPageManager.state.loading}
                        renderer={() => <OverlayLoadingIndicator/>}
                    />
                    {(() => {
                        if (listPageManager.state.modelList.length > 0) {
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
                                        {renderCommitmentsListDisplay(listPageManager.state.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listPageManager.state.pageCount}
                                        selectedPage={listPageManager.state.selectedPage}
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
                    if (listPageManager.state.showCreateModal) {
                        return (
                            <CreateCommitment
                                cancel={listPageManager.closeModals}
                                afterSuccessfulSave={listPageManager.afterSuccessfulSave}
                            />
                        );
                    } else if (listPageManager.state.showUpdateModal) {
                        return (
                            <UpdateCommitment
                                cancel={listPageManager.closeModals}
                                afterSuccessfulSave={listPageManager.afterSuccessfulSave}
                                commitmentId={listPageManager.state.updateModelId}
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
