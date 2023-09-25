import {useEffect, useReducer, useState} from 'react';
import {UrlUtility} from "../UrlUtility";
import {Constants} from "../Constants";
import {MessageDisplayerUtility} from "../MessageDisplayerUtility";

function reducer(state, action) {
    switch (action.type) {
        case 'list/readStart': {
            return {
                ...state,
                loading: true
            }
        }
        case 'list/readSuccess': {
            return {
                ...state,
                modelList: action.modelList,
                pageCount: action.pageCount,
                loading: false
            }
        }
        case 'list/readFailure': {
            return {
                ...state,
                loading: false
            }
        }
        case 'list/urlChangedConfig': {
            return {
                ...state,
                selectedPage: action.selectedPage,
                searchText: action.searchText,
                showCreateModal: action.showCreateModal,
                showUpdateModal: action.showUpdateModal,
                updateModelId: action.updateModelId,

                prevSearch: action.prevSearch,
                prevParams: action.prevParams,
                prevShowCreateModal: action.prevShowCreateModal
            }
        }
    }
    throw Error('Unknown action: ' + action.type);
}

// Use a list whose state is described by the URL. User actions trigger URL changes, and URL changes trigger list state updates. Certain state value changes can trigger a reload of the list. Returns a "list page manager" that exposes list operations and state.
export function useUrlListManager(
    listPageProps, modelIdParamName, listFetchApiFunction, modelName, urlBase, navigator
) {
    const initialListState = {
        selectedPage: 1,
        searchText: '',
        showCreateModal: false,
        showUpdateModal: false,
        updateModelId: null,
        modelList: [],
        pageCount: 0,
        loading: false,

        prevSearch: listPageProps.location && listPageProps.location.search,
        prevParams: listPageProps.match && listPageProps.match.params,
        prevShowCreateModal: listPageProps.showCreateModal
    }

    const [state, dispatch] = useReducer(reducer, initialListState);

    // Update state if URL changes.
    if (
        (listPageProps.location && listPageProps.location.search) !== state.prevSearch ||
        (listPageProps.match && listPageProps.match.params) !== state.prevParams ||
        listPageProps.showCreateModal !== state.prevShowCreateModal
    ) {
        let selectedPage = 1;
        let searchText = '';
        let updateModelId = null;
        let showUpdateModal = false;

        let routeParams = listPageProps.match && listPageProps.match.params;
        if (routeParams && routeParams[modelIdParamName] && routeParams[modelIdParamName] !== 'add') {
            showUpdateModal = true;
            updateModelId = routeParams[modelIdParamName];
        }

        let queryParams = UrlUtility.getQueryParamsFromProps(listPageProps);
        if (queryParams.page) {
            selectedPage = queryParams.page;
        }

        if (queryParams.searchText) {
            searchText = queryParams.searchText;
        }

        dispatch({
            type: 'list/urlChangedConfig',
            selectedPage: selectedPage,
            searchText: searchText,
            showCreateModal: listPageProps.showCreateModal || false,
            showUpdateModal: showUpdateModal || false,
            updateModelId: updateModelId,

            prevSearch: listPageProps.location && listPageProps.location.search,
            prevParams: listPageProps.match && listPageProps.match.params,
            prevShowCreateModal: listPageProps.showCreateModal
        })
    }

    // Trigger reload of list data on mount and if certain values change in list state.
    useEffect(
        function () {
            reloadList();
        },
        [
            '' + state.selectedPage,
            '' + state.searchText
        ]
    );

    function reloadList() {
        dispatch({type: 'list/readStart'})
        listFetchApiFunction(
            state.selectedPage,
            state.searchText
        )
            .then(function (listData) {
                dispatch({
                    type: 'list/readSuccess',
                    modelList: listData.modelList || [],
                    pageCount: listData.pageCount || Constants.defaultPageCount,
                });
            })
            .catch(function (error) {
                dispatch({type: 'list/readFailure'});
                console && console.error(error);
                MessageDisplayerUtility.error('An error occurred while loading the ' + modelName + ' list.');
            });
    }

    function goToAddModal() {
        navigator.navigateTo(`${urlBase}/add${listPageProps.location.search}`);
    }

    function goToUpdateModal(model) {
        navigator.navigateTo(`${urlBase}/${model.id}${listPageProps.location.search}`);
    }

    function closeModals() {
        navigator.navigateTo(`${urlBase}${listPageProps.location.search}`);
    }

    function afterSuccessfulSave() {
        closeModals()
        reloadList();
    }

    function performSearch(searchText) {
        if (state.searchText !== searchText) {
            let queryParams = UrlUtility.getQueryParamsFromProps(listPageProps);
            queryParams.page = 1;
            queryParams.searchText = searchText;
            let queryString = UrlUtility.getUrlQueryStringFromQueryParamsObject(queryParams);
            navigator.navigateTo(`${urlBase}${queryString}`);
        }
    }

    return {
        state: state,
        reloadList: reloadList,
        goToAddModal: goToAddModal,
        goToUpdateModal: goToUpdateModal,
        closeModals: closeModals,
        afterSuccessfulSave: afterSuccessfulSave,
        performSearch: performSearch
    };
}
