import React, {useEffect, useState} from 'react';
import {UrlUtility} from "./UrlUtility";
import {Constants} from "./Constants";
import {MessageDisplayerUtility} from "./MessageDisplayerUtility";

export function useCommonListEffects(
    props, modelIdParam, listFetchApiFunction, modelName
) {
    const [listState, setListState] = useState({
        selectedPage: 1,
        searchText: '',
        showCreateModal: false,
        showUpdateModal: false,
        updateModelId: null,
        modelList: [],
        pageCount: 0
    });

    const [loadingListData, setLoadingListData] = useState(false);

    function mergeListState(prevState, stateChange) {
        if (stateChange) {
            setListState(
                {
                    ...prevState,
                    ...stateChange,
                }
            );
        }
    }

    // update state from prop changes reflected in URL
    useEffect(
        function () {
            let selectedPage = 1;
            var searchText = '';
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

            mergeListState(listState, {
                selectedPage: selectedPage,
                searchText: searchText,
                showCreateModal: props.showCreateModal,
                showUpdateModal: showUpdateModal,
                updateModelId: updateModelId
            })
        },
        [
            props.location && props.location.search,
            props.match && props.match.params,
            props.showCreateModal
        ]
    )

    // trigger reload of list data on mount and if certain things change in list state
    useEffect(
        function () {
            setLoadingListData(true);
        },
        [
            listState.selectedPage,
            listState.searchText,
            listState.showCreateModal,
            listState.showUpdateModal,
            listState.updateModelId
        ]
    );

    // reload list data if "loadingListData" changes to true
    useEffect(function () {
        if (loadingListData) {
            let listStateChange = {};

            listFetchApiFunction(
                listState.selectedPage,
                listState.searchText
            )
                .then(function (listData) {
                    listStateChange = {
                        modelList: listData.modelList || [],
                        pageCount: listData.pageCount || Constants.defaultPageCount,
                    };
                    mergeListState(listState, listStateChange);
                    setLoadingListData(false);
                })
                .catch(function (error) {
                    setLoadingListData(false);
                    console && console.error(error);
                    MessageDisplayerUtility.error('An error occurred while loading the ' + modelName + ' list.');
                });
        }
    }, [loadingListData]);

    return [listState, loadingListData];
}
