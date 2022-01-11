import React, {useContext, useEffect, useState} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {PillButton} from "../common/PillButton";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {ListPaginationOptions} from "../common/ListPaginationOptions";
import {UrlUtility} from "../common/UrlUtility";
import {Constants} from "../common/Constants";
import {CreateImportantThing} from "./CreateImportantThing";
import {UpdateImportantThing} from "./UpdateImportantThing";
import {GlobalContext} from "../admin-frame/AdminFrame";

export const ImportantThingsListPage = function (props) {
    const context = useContext(GlobalContext);

    const [listState, setListState] = useState({
        selectedPage: 1,
        showAddImportantThingModal: false,
        showUpdateImportantThingModal: false,
        updateImportantThingId: null,
        importantThingsList: [],
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
            let updateImportantThingId = null;
            let showUpdateImportantThingModal = false;

            let routeParams = props.match && props.match.params;
            if (routeParams && routeParams.importantThingId && routeParams.importantThingId !== 'add') {
                showUpdateImportantThingModal = true;
                updateImportantThingId = routeParams.importantThingId;
            }

            let queryParams = UrlUtility.getQueryParamsFromProps(props);
            if (queryParams.page) {
                selectedPage = queryParams.page;
            }

            mergeListState(listState, {
                selectedPage: selectedPage,
                showAddImportantThingModal: props.showAddImportantThingModal,
                showUpdateImportantThingModal: showUpdateImportantThingModal,
                updateImportantThingId: updateImportantThingId
            })
        },
        [
            props.location && props.location.search,
            props.match && props.match.params,
            props.showAddImportantThingModal
        ]
    )

    // reload list data on mount and if certain things change in list state
    useEffect(
        function () {
            setLoadingListData(true);
        },
        [
            listState.selectedPage,
            listState.showAddImportantThingModal,
            listState.showUpdateImportantThingModal,
            listState.updateImportantThingId
        ]
    );

    useEffect(function () {
        if (loadingListData) {
            let listStateChange = {};

            ApiUtility.getImportantThingsList(listState.selectedPage)
                .then(function (importantThingsListData) {
                    listStateChange = {
                        importantThingsList: importantThingsListData.importantThingsList || [],
                        pageCount: importantThingsListData.pageCount || Constants.defaultPageCount,
                    };
                    mergeListState(listState, listStateChange);
                    setLoadingListData(false);
                })
                .catch(function (error) {
                    setLoadingListData(false);
                    console && console.error(error);
                    MessageDisplayerUtility.error('An error occurred while loading the important things list.');
                });
        }
    }, [loadingListData]);

    function goToAddImportantThingModal() {
        context.navigator.navigateTo('/important-things/add');
    }

    function goToUpdateImportantThingModal(importantThing) {
        context.navigator.navigateTo('/important-things/' + importantThing.id);
    }

    function closeModals() {
        context.navigator.navigateTo('/important-things');
    }

    function renderImportantThingsListDisplay(importantThingsList) {
        let importantThingsListDisplay = [];

        for (let i = 0; i < importantThingsList.length; i++) {
            const importantThing = importantThingsList[i];

            importantThingsListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                    onClick={goToUpdateImportantThingModal.bind(null, importantThing)}
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

    if (listState.importantThingsList) {
        return (
            <div className="common-list-page important-things-list-page">
                <div className="common-list-page-header">
                    <div className="common-list-page-header-content">
                        <div className="common-list-page-header-content-left">
                            <div className="common-list-page-header-text">
                                Important Things
                            </div>
                        </div>
                        <div className="common-list-page-header-content-right">
                            <PillButton
                                onClick={goToAddImportantThingModal}
                                buttonText="ADD"
                            />
                        </div>
                    </div>
                </div>
                <div className="common-list-page-content">
                    {(() => {
                        if (loadingListData) {
                            return (
                                <OverlayLoadingIndicator/>
                            );
                        }
                    })()}
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
                        {renderImportantThingsListDisplay(listState.importantThingsList)}
                    </div>
                    <ListPaginationOptions
                        pageCount={listState.pageCount}
                        selectedPage={listState.selectedPage}
                        urlBase="/important-things"
                    />
                </div>
                {(() => {
                    if (listState.showAddImportantThingModal) {
                        return (
                            <CreateImportantThing
                                cancel={closeModals}
                                afterSuccessfulSave={closeModals}
                            />
                        );
                    } else if (listState.showUpdateImportantThingModal) {
                        return (
                            <UpdateImportantThing
                                cancel={closeModals}
                                afterSuccessfulSave={closeModals}
                                importantThingId={listState.updateImportantThingId}
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
