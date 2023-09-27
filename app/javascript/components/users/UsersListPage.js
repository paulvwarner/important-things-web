import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {CreateUser} from "./CreateUser";
import {UpdateUser} from "./UpdateUser";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {useModelListEngine} from "../common/hooks/useModelListEngine";
import {CommonListPageHeader} from "../common/CommonListPageHeader";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export const UsersListPage = function (props) {
    const context = useContext(GlobalContext);

    const listEngine = useModelListEngine(
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
                    onClick={() => listEngine.goToUpdateModal(user)}
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

    if (listEngine.state.modelList) {
        return (
            <div className="common-list-page users-list-page">
                <CommonListPageHeader
                    headerText="Users"
                    performSearch={listEngine.performSearch}
                    searchText={listEngine.state.searchText}
                    searchPlaceholderText="Search Users"
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
                                        {renderUsersListDisplay(listEngine.state.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listEngine.state.pageCount}
                                        selectedPage={listEngine.state.selectedPage}
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
                    if (listEngine.state.showCreateModal) {
                        return (
                            <CreateUser
                                cancel={listEngine.closeModals}
                                afterSuccessfulSave={listEngine.afterSuccessfulSave}
                            />
                        );
                    } else if (listEngine.state.showUpdateModal) {
                        return (
                            <UpdateUser
                                cancel={listEngine.closeModals}
                                afterSuccessfulSave={listEngine.afterSuccessfulSave}
                                userId={listEngine.state.updateModelId}
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
