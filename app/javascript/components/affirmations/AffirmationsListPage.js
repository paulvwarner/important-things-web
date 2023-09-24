import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {CreateAffirmation} from "./CreateAffirmation";
import {UpdateAffirmation} from "./UpdateAffirmation";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {useUrlListManager} from "../common/hooks/useUrlListManager";
import {CommonListPageHeader} from "../common/CommonListPageHeader";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export const AffirmationsListPage = function (props) {
    const context = useContext(GlobalContext);

    const listPageManager = useUrlListManager(
        props,
        'affirmationId',
        ApiUtility.getAffirmationsList,
        'affirmation',
        '/affirmations',
        context.navigator
    );

    function renderAffirmationsListDisplay(affirmationsList) {
        let affirmationsListDisplay = [];

        for (let i = 0; i < affirmationsList.length; i++) {
            const affirmation = affirmationsList[i];

            affirmationsListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                    onClick={() => listPageManager.goToUpdateModal(affirmation)}
                >
                    <div
                        className="common-list-row-cell common-list-row-value-cell affirmations-list-row-cell message"
                    >{affirmation.message}</div>
                </div>
            );
        }

        return affirmationsListDisplay;
    }

    if (listPageManager.state.modelList) {
        return (
            <div className="common-list-page affirmations-list-page">
                <CommonListPageHeader
                    headerText="Affirmations"
                    performSearch={listPageManager.performSearch}
                    searchText={listPageManager.state.searchText}
                    searchPlaceholderText="Search Affirmations"
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
                                                className="common-list-row-cell common-list-row-label-cell affirmations-list-row-cell message"
                                            >Message
                                            </div>
                                        </div>
                                    </div>
                                    <div className="common-list-content">
                                        {renderAffirmationsListDisplay(listPageManager.state.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listPageManager.state.pageCount}
                                        selectedPage={listPageManager.state.selectedPage}
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
                    if (listPageManager.state.showCreateModal) {
                        return (
                            <CreateAffirmation
                                cancel={listPageManager.closeModals}
                                afterSuccessfulSave={listPageManager.afterSuccessfulSave}
                            />
                        );
                    } else if (listPageManager.state.showUpdateModal) {
                        return (
                            <UpdateAffirmation
                                cancel={listPageManager.closeModals}
                                afterSuccessfulSave={listPageManager.afterSuccessfulSave}
                                affirmationId={listPageManager.state.updateModelId}
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
