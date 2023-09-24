import React, {Fragment, useContext} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {UrlUtility} from "../common/UrlUtility";
import {CreateUser} from "./CreateUser";
import {UpdateUser} from "./UpdateUser";
import {GlobalContext} from "../admin-frame/AdminFrame";
import {useLocation} from "react-router-dom";
import {useUrlManagedList} from "../common/hooks/useUrlManagedList";
import {CommonListPageHeader} from "../common/CommonListPageHeader";
import {ConditionalRenderer} from "../common/ConditionalRenderer";

export const UsersListPage = function (props) {
    const context = useContext(GlobalContext);
    let location = useLocation();

    const [listState, reloadList] = useUrlManagedList(
        props, 'userId', ApiUtility.getUsersList, 'user'
    );

    function goToAddUserModal() {
        context.navigator.navigateTo('/users/add' + location.search);
    }

    function goToUpdateUserModal(user) {
        context.navigator.navigateTo('/users/' + user.id + location.search);
    }

    function closeModals() {
        context.navigator.navigateTo('/users' + location.search);
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
            context.navigator.navigateTo('/users' + queryString);
        }
    }

    function renderUsersListDisplay(usersList) {
        let usersListDisplay = [];

        for (let i = 0; i < usersList.length; i++) {
            const user = usersList[i];

            usersListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                    onClick={goToUpdateUserModal.bind(null, user)}
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

    if (listState.modelList) {
        return (
            <div className="common-list-page users-list-page">
                <CommonListPageHeader
                    headerText="Users"
                    performSearch={performSearch}
                    searchText={listState.searchText}
                    searchPlaceholderText="Search Users"
                    onClickAddButton={goToAddUserModal}
                />

                <div className="common-list-page-content">
                    <ConditionalRenderer if={listState.loading} renderer={() => <OverlayLoadingIndicator/>}/>
                    {(() => {
                        if (listState.modelList.length > 0) {
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
                                        {renderUsersListDisplay(listState.modelList)}
                                    </div>
                                    <ListPaginationOptions
                                        pageCount={listState.pageCount}
                                        selectedPage={listState.selectedPage}
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
                    if (listState.showCreateModal) {
                        return (
                            <CreateUser
                                cancel={closeModals}
                                afterSuccessfulSave={afterSuccessfulSave}
                            />
                        );
                    } else if (listState.showUpdateModal) {
                        return (
                            <UpdateUser
                                cancel={closeModals}
                                afterSuccessfulSave={afterSuccessfulSave}
                                userId={listState.updateModelId}
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
