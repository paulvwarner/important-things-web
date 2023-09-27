import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {CreateAffirmation} from "./CreateAffirmation";
import {UpdateAffirmation} from "./UpdateAffirmation";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {useModelListEngine} from "../common/hooks/useModelListEngine";
import {CommonListPageHeader} from "../common/CommonListPageHeader";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export const AffirmationsListPage = function (props) {
    const context = useContext(GlobalContext);

    const listEngine = useModelListEngine(
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
                    onClick={() => listEngine.goToUpdateModal(affirmation)}
                >
                    <div
                        className="common-list-row-cell common-list-row-value-cell affirmations-list-row-cell message"
                    >{affirmation.message}</div>
                </div>
            );
        }

        return affirmationsListDisplay;
    }

    if (listEngine.state.modelList) {
        return (
            <div className="common-list-page affirmations-list-page">
                <CommonListPageHeader
                    headerText="Affirmations"
                    performSearch={listEngine.performSearch}
                    searchText={listEngine.state.searchText}
                    searchPlaceholderText="Search Affirmations"
                    onClickAddButton={listEngine.goToAddModal}
                />

                <div className="common-list-page-content">
                    <ConditionalRenderer
                        if={listEngine.state.loading}
                        renderer={() => <OverlayLoadingIndicator/>}
                    />
                    {(() => {
                        if (listEngine.state.modelList.length > 0) {
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
                                        {renderAffirmationsListDisplay(listEngine.state.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listEngine.state.pageCount}
                                        selectedPage={listEngine.state.selectedPage}
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
                    if (listEngine.state.showCreateModal) {
                        return (
                            <CreateAffirmation
                                cancel={listEngine.closeModals}
                                afterSuccessfulSave={listEngine.afterSuccessfulSave}
                            />
                        );
                    } else if (listEngine.state.showUpdateModal) {
                        return (
                            <UpdateAffirmation
                                cancel={listEngine.closeModals}
                                afterSuccessfulSave={listEngine.afterSuccessfulSave}
                                affirmationId={listEngine.state.updateModelId}
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
