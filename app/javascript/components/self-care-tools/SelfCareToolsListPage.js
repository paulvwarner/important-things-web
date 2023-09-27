import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {CreateSelfCareTool} from "./CreateSelfCareTool";
import {UpdateSelfCareTool} from "./UpdateSelfCareTool";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {useUrlListManager} from "../common/hooks/useUrlListManager";
import {CommonListPageHeader} from "../common/CommonListPageHeader";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export const SelfCareToolsListPage = function (props) {
    const context = useContext(GlobalContext);

    const listPageManager = useUrlListManager(
        props,
        'selfCareToolId',
        ApiUtility.getSelfCareToolsList,
        'self-care tool',
        '/self-care-tools',
        context.navigator
    );

    function renderSelfCareToolsListDisplay(selfCareToolsList) {
        let selfCareToolsListDisplay = [];

        for (let i = 0; i < selfCareToolsList.length; i++) {
            const selfCareTool = selfCareToolsList[i];

            selfCareToolsListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                    onClick={() => listPageManager.goToUpdateModal(selfCareTool)}
                >
                    <div
                        className="common-list-row-cell common-list-row-value-cell self-care-tools-list-row-cell title"
                    >{selfCareTool.title}</div>
                </div>
            );
        }

        return selfCareToolsListDisplay;
    }

    if (listPageManager.state.modelList) {
        return (
            <div className="common-list-page self-care-tools-list-page">
                <CommonListPageHeader
                    headerText="Self-Care Tools"
                    performSearch={listPageManager.performSearch}
                    searchText={listPageManager.state.searchText}
                    searchPlaceholderText="Search Self-Care Tools"
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
                                                className="common-list-row-cell common-list-row-label-cell self-care-tools-list-row-cell title"
                                            >Title
                                            </div>
                                        </div>
                                    </div>
                                    <div className="common-list-content">
                                        {renderSelfCareToolsListDisplay(listPageManager.state.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listPageManager.state.pageCount}
                                        selectedPage={listPageManager.state.selectedPage}
                                        urlBase="/self-care-tools"
                                    />
                                </Fragment>
                            );
                        } else {
                            return (
                                <div className="common-empty-list-message-container">
                                    <div className="common-empty-list-message">No self-care tools found.</div>
                                </div>
                            );
                        }
                    })()}
                </div>
                {(() => {
                    if (listPageManager.state.showCreateModal) {
                        return (
                            <CreateSelfCareTool
                                cancel={listPageManager.closeModals}
                                afterSuccessfulSave={listPageManager.afterSuccessfulSave}
                            />
                        );
                    } else if (listPageManager.state.showUpdateModal) {
                        return (
                            <UpdateSelfCareTool
                                cancel={listPageManager.closeModals}
                                afterSuccessfulSave={listPageManager.afterSuccessfulSave}
                                selfCareToolId={listPageManager.state.updateModelId}
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
