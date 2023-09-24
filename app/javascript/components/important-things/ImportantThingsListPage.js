import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {CreateImportantThing} from "./CreateImportantThing";
import {UpdateImportantThing} from "./UpdateImportantThing";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {useLocation} from "react-router-dom";
import {useUrlManagedList} from "../common/hooks/useUrlManagedList";
import {CommonListPageHeader} from "../common/CommonListPageHeader";
import {NotificationConfigDisplay} from "../notification-config/NotificationConfigDisplay";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export const ImportantThingsListPage = function (props) {
    const context = useContext(GlobalContext);
    let location = useLocation();

    const listPageManager = useUrlManagedList(
        props,
        'importantThingId',
        ApiUtility.getImportantThingsList,
        'important thing',
        '/important-things',
        context.navigator
    );

    function goToNotificationConfigModal() {
        context.navigator.navigateTo(`/important-things/notification-config${location.search}`);
    }

    function renderImportantThingsListDisplay(importantThingsList) {
        let importantThingsListDisplay = [];

        for (let i = 0; i < importantThingsList.length; i++) {
            const importantThing = importantThingsList[i];

            importantThingsListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                    onClick={() => listPageManager.goToUpdateModal(importantThing)}
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

    if (listPageManager.listState.modelList) {
        return (
            <div className="common-list-page important-things-list-page">
                <CommonListPageHeader
                    headerText="Important Things"
                    leftHeaderRenderer={function () {
                        return (
                            <Fragment>
                                <div className="important-things-header-left">
                                    <div className="common-list-page-header-text">Important Things</div>
                                    <div className="important-things-notification-info">
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
                    searchText={listPageManager.listState.searchText}
                    searchPlaceholderText="Search Important Things"
                    onClickAddButton={listPageManager.goToAddModal}
                />

                <div className="common-list-page-content">
                    <ConditionalRenderer
                        if={listPageManager.listState.loading}
                        renderer={() => <OverlayLoadingIndicator/>}
                    />
                    {(() => {
                        if (listPageManager.listState.modelList.length > 0) {
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
                                        {renderImportantThingsListDisplay(listPageManager.listState.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listPageManager.listState.pageCount}
                                        selectedPage={listPageManager.listState.selectedPage}
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
                    if (listPageManager.listState.showCreateModal) {
                        return (
                            <CreateImportantThing
                                cancel={listPageManager.closeModals}
                                afterSuccessfulSave={listPageManager.afterSuccessfulSave}
                            />
                        );
                    } else if (listPageManager.listState.showUpdateModal) {
                        return (
                            <UpdateImportantThing
                                cancel={listPageManager.closeModals}
                                afterSuccessfulSave={listPageManager.afterSuccessfulSave}
                                importantThingId={listPageManager.listState.updateModelId}
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
