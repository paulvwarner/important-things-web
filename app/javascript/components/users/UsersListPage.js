import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {CreateUser} from "./CreateUser";
import {UpdateUser} from "./UpdateUser";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {useUrlListManager} from "../common/hooks/useUrlListManager";
import {CommonListPageHeader} from "../common/CommonListPageHeader";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export const UsersListPage = function (props) {
    const context = useContext(GlobalContext);

    const listPageManager = useUrlListManager(
        props,
        'userId',
        ApiUtility.getUsersList,
        'user',
        '/users',
        context.navigator
    );

    function renderUsersListDisplay(usersList) {
        let usersListDisplay = [];

        for (let i = 0; i < usersList.length; i++) {
            const user = usersList[i];

            usersListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                    onClick={() => listPageManager.goToUpdateModal(user)}
                >
                    <div
                        className="common-list-row-cell common-list-row-value-cell users-list-row-cell email"
                    >{user.person.email}</div>
                    <div
                        className="common-list-row-cell common-list-row-value-cell users-list-row-cell full-name"
                    >{user.person.name}</div>
                    <div
                        className="common-list-row-cell common-list-row-value-cell users-list-row-cell role"
                    >{user.user_roles[0].role.name}</div>
                </div>
            );
        }

        return usersListDisplay;
    }

    if (listPageManager.state.modelList) {
        return (
            <div className="common-list-page users-list-page">
                <CommonListPageHeader
                    headerText="Users"
                    performSearch={listPageManager.performSearch}
                    searchText={listPageManager.state.searchText}
                    searchPlaceholderText="Search Users"
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
                                        <div className="common-list-row common-list-labels-row">
                                            <div
                                                className="common-list-row-cell common-list-row-label-cell users-list-row-cell email"
                                            >Email
                                            </div>
                                            <div
                                                className="common-list-row-cell common-list-row-label-cell users-list-row-cell full-name"
                                            >Name
                                            </div>
                                            <div
                                                className="common-list-row-cell common-list-row-label-cell users-list-row-cell role"
                                            >Role
                                            </div>
                                        </div>
                                    </div>
                                    <div className="common-list-content">
                                        {renderUsersListDisplay(listPageManager.state.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listPageManager.state.pageCount}
                                        selectedPage={listPageManager.state.selectedPage}
                                        urlBase="/users"
                                    />
                                </Fragment>
                            );
                        } else {
                            return (
                                <div className="common-empty-list-message-container">
                                    <div className="common-empty-list-message">No users found.</div>
                                </div>
                            );
                        }
                    })()}
                </div>
                {(() => {
                    if (listPageManager.state.showCreateModal) {
                        return (
                            <CreateUser
                                cancel={listPageManager.closeModals}
                                afterSuccessfulSave={listPageManager.afterSuccessfulSave}
                            />
                        );
                    } else if (listPageManager.state.showUpdateModal) {
                        return (
                            <UpdateUser
                                cancel={listPageManager.closeModals}
                                afterSuccessfulSave={listPageManager.afterSuccessfulSave}
                                userId={listPageManager.state.updateModelId}
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
