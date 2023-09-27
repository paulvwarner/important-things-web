import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {CreateInsight} from "./CreateInsight";
import {UpdateInsight} from "./UpdateInsight";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {useLocation} from "react-router-dom";
import {useUrlListManager} from "../common/hooks/useUrlListManager";
import {CommonListPageHeader} from "../common/CommonListPageHeader";
import {NotificationConfigDisplay} from "../notification-config/NotificationConfigDisplay";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export const InsightsListPage = function (props) {
    const context = useContext(GlobalContext);
    let location = useLocation();

    const listPageManager = useUrlListManager(
        props,
        'insightId',
        ApiUtility.getInsightsList,
        'insight',
        '/insights',
        context.navigator
    );

    function goToNotificationConfigModal() {
        context.navigator.navigateTo(`/insights/notification-config${location.search}`);
    }

    function renderInsightsListDisplay(insightsList) {
        let insightsListDisplay = [];

        for (let i = 0; i < insightsList.length; i++) {
            const insight = insightsList[i];

            insightsListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                    onClick={() => listPageManager.goToUpdateModal(insight)}
                >
                    <div
                        className="common-list-row-cell common-list-row-value-cell insights-list-row-cell message"
                    >{insight.message}</div>
                    <div
                        className="common-list-row-cell common-list-row-value-cell insights-list-row-cell weight"
                    >{insight.weight}</div>
                </div>
            );
        }

        return insightsListDisplay;
    }

    if (listPageManager.state.modelList) {
        return (
            <div className="common-list-page insights-list-page">
                <CommonListPageHeader
                    headerText="Insights"
                    leftHeaderRenderer={function () {
                        return (
                            <Fragment>
                                <div className="insights-header-left">
                                    <div className="common-list-page-header-text">Insights</div>
                                    <div className="insights-notification-info">
                                        <NotificationConfigDisplay
                                            goToNotificationConfigModal={goToNotificationConfigModal}
                                            showNotificationConfigModal={props.showNotificationConfigModal}
                                            close={listPageManager.closeModals}
                                        />
                                    </div>
                                </div>
                            </Fragment>
                        )
                    }}
                    performSearch={listPageManager.performSearch}
                    searchText={listPageManager.state.searchText}
                    searchPlaceholderText="Search Insights"
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
                                                className="common-list-row-cell common-list-row-label-cell insights-list-row-cell message"
                                            >Message
                                            </div>
                                            <div
                                                className="common-list-row-cell common-list-row-label-cell insights-list-row-cell weight"
                                            >Weight
                                            </div>
                                        </div>
                                    </div>
                                    <div className="common-list-content">
                                        {renderInsightsListDisplay(listPageManager.state.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listPageManager.state.pageCount}
                                        selectedPage={listPageManager.state.selectedPage}
                                        urlBase="/insights"
                                    />
                                </Fragment>
                            );
                        } else {
                            return (
                                <div className="common-empty-list-message-container">
                                    <div
                                        className="common-empty-list-message"
                                    >No insights found.
                                    </div>
                                </div>
                            );
                        }
                    })()}
                </div>
                {(() => {
                    if (listPageManager.state.showCreateModal) {
                        return (
                            <CreateInsight
                                cancel={listPageManager.closeModals}
                                afterSuccessfulSave={listPageManager.afterSuccessfulSave}
                            />
                        );
                    } else if (listPageManager.state.showUpdateModal) {
                        return (
                            <UpdateInsight
                                cancel={listPageManager.closeModals}
                                afterSuccessfulSave={listPageManager.afterSuccessfulSave}
                                insightId={listPageManager.state.updateModelId}
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
