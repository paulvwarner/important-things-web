import {useEffect, useReducer} from 'react';
import {UrlUtility} from "../UrlUtility";
import {Constants} from "../Constants";
import {MessageDisplayerUtility} from "../MessageDisplayerUtility";

function listReducer(state, action) {
    switch (action.type) {
        case 'started_loading_list': {
            return {
                ...state,
                loading: true
            }
        }
        case 'reloaded_list': {
            return {
                ...state,
                modelList: action.modelList,
                pageCount: action.pageCount,
                loading: false
            }
        }
        case 'failed_list_reload': {
            return {
                ...state,
                loading: false
            }
        }
        case 'url_changed_list_config': {
            return {
                ...state,
                selectedPage: action.selectedPage,
                searchText: action.searchText,
                showCreateModal: action.showCreateModal,
                showUpdateModal: action.showUpdateModal,
                updateModelId: action.updateModelId
            }
        }
    }
    throw Error('Unknown action: ' + action.type);
}

export function useManagedList(
    props, modelIdParam, listFetchApiFunction, modelName
) {
    const initialListState = {
        selectedPage: 1,
        searchText: '',
        showCreateModal: false,
        showUpdateModal: false,
        updateModelId: null,
        modelList: [],
        pageCount: 0,
        loading: false
    }

    const [listState, dispatch] = useReducer(listReducer, initialListState);

    function reloadList() {
        listFetchApiFunction(
            listState.selectedPage,
            listState.searchText
        )
            .then(function (listData) {
                dispatch({
                    type: 'reloaded_list',
                    modelList: listData.modelList || [],
                    pageCount: listData.pageCount || Constants.defaultPageCount,
                });
            })
            .catch(function (error) {
                dispatch({type: 'failed_list_reload'});
                console && console.error(error);
                MessageDisplayerUtility.error('An error occurred while loading the ' + modelName + ' list.');
            });
    }

    // User actions trigger URL changes, and the URL governs list state. Update state from URL changes here.
    useEffect(
        function () {
            let selectedPage = 1;
            let searchText = '';
            let updateModelId = null;
            let showUpdateModal = false;

            let routeParams = props.match && props.match.params;
            if (routeParams && routeParams[modelIdParam] && routeParams[modelIdParam] !== 'add') {
                showUpdateModal = true;
                updateModelId = routeParams[modelIdParam];
            }

            let queryParams = UrlUtility.getQueryParamsFromProps(props);
            if (queryParams.page) {
                selectedPage = queryParams.page;
            }

            if (queryParams.searchText) {
                searchText = queryParams.searchText;
            }

            dispatch({
                type: 'url_changed_list_config',
                selectedPage: selectedPage,
                searchText: searchText,
                showCreateModal: props.showCreateModal || false,
                showUpdateModal: showUpdateModal || false,
                updateModelId: updateModelId
            })
        },
        [
            props.location && props.location.search,
            props.match && props.match.params,
            props.showCreateModal
        ]
    )

    // trigger reload of list data on mount and if certain values change in list state
    useEffect(
        function () {
            reloadList();
        },
        [
            '' + listState.selectedPage,
            '' + listState.searchText
        ]
    );

    // pvw todo apply refactor to all lists, commit
    return [listState, reloadList];
}
