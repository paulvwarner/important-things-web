import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {CreateInsight} from "./CreateInsight";
import {UpdateInsight} from "./UpdateInsight";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {useLocation} from "react-router-dom";
import {useModelListEngine} from "../common/hooks/useModelListEngine";
import {CommonListPageHeader} from "../common/CommonListPageHeader";
import {NotificationConfigDisplay} from "../notification-config/NotificationConfigDisplay";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export const InsightsListPage = function (props) {
    const context = useContext(GlobalContext);
    let location = useLocation();

    const listEngine = useModelListEngine(
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
                    onClick={() => listEngine.goToUpdateModal(insight)}
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

    if (listEngine.state.modelList) {
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
                                            close={listEngine.closeModals}
                                        />
                                    </div>
                                </div>
                            </Fragment>
                        )
                    }}
                    performSearch={listEngine.performSearch}
                    searchText={listEngine.state.searchText}
                    searchPlaceholderText="Search Insights"
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
                                        {renderInsightsListDisplay(listEngine.state.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listEngine.state.pageCount}
                                        selectedPage={listEngine.state.selectedPage}
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
                    if (listEngine.state.showCreateModal) {
                        return (
                            <CreateInsight
                                cancel={listEngine.closeModals}
                                afterSuccessfulSave={listEngine.afterSuccessfulSave}
                            />
                        );
                    } else if (listEngine.state.showUpdateModal) {
                        return (
                            <UpdateInsight
                                cancel={listEngine.closeModals}
                                afterSuccessfulSave={listEngine.afterSuccessfulSave}
                                insightId={listEngine.state.updateModelId}
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
