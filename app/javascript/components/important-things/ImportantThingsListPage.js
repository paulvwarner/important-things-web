import React, {Component} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {PillButton} from "../common/PillButton";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {withContext} from "../common/GlobalContextConsumerComponent";
import {CreateImportantThingWrapper} from "./CreateImportantThingWrapper";
import {MessageDisplayerUtility} from "../common/MessageDisplayerUtility";
import {UpdateImportantThingWrapper} from "./UpdateImportantThingWrapper";

export const ImportantThingsListPage = withContext(class extends Component {
    constructor(props) {
        super(props);
        this.state = this.stateFromProps(props)
    }

    componentDidMount = () => {
        this.loadPageData();
    };

    componentDidUpdate = (prevProps, prevState) => {
        var self = this;
        var stateChange = this.stateFromProps(this.props);

        if (
            this.state.showAddImportantThingModal !== stateChange.showAddImportantThingModal ||
            this.state.showUpdateImportantThingModal !== stateChange.showUpdateImportantThingModal ||
            this.state.updateImportantThingId !== stateChange.updateImportantThingId
        ) {
            this.setState(stateChange, function () {
                self.loadPageData();
            });
        }
    };

    stateFromProps = (props) => {
        var updateImportantThingId = null;
        var showUpdateImportantThingModal = false;

        var routeParams = props.match && props.match.params;
        if (routeParams && routeParams.importantThingId && routeParams.importantThingId !== 'add') {
            showUpdateImportantThingModal = true;
            updateImportantThingId = routeParams.importantThingId;
        }

        return {
            showAddImportantThingModal: props.showAddImportantThingModal,
            showUpdateImportantThingModal: showUpdateImportantThingModal,
            updateImportantThingId: updateImportantThingId
        };
    };

    loadPageData = () => {
        var self = this;
        var stateChange = {};

        this.setState(
            {loading: true},
            function () {
                ApiUtility.getImportantThingsList()
                    .then(function (importantThingsListData) {
                        stateChange = {
                            loading: false,
                            importantThingsList: importantThingsListData.importantThingsList || [],
                        };

                        self.setState(stateChange);
                    })
                    .catch(function (error) {
                        self.setState({
                            loading: false
                        });
                        console && console.error(error);
                        MessageDisplayerUtility.error('An error occurred while loading the important things list.');
                    });
            }
        );
    };

    goToAddImportantThingModal = () => {
        this.props.context.navigator.navigateTo('/important-things/add');
    };

    goToUpdateImportantThingModal = (importantThing) => {
        this.props.context.navigator.navigateTo('/important-things/' + importantThing.id);
    }

    closeModals = () => {
        this.props.context.navigator.navigateTo('/important-things');
    };

    renderImportantThingsListDisplay = (importantThingsList) => {
        var importantThingsListDisplay = [];

        for (var i = 0; i < importantThingsList.length; i++) {
            const importantThing = importantThingsList[i];

            importantThingsListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                    onClick={this.goToUpdateImportantThingModal.bind(this, importantThing)}
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
    };

    render = () => {
        if (this.state.importantThingsList) {
            let importantThingsListDisplay = this.renderImportantThingsListDisplay(this.state.importantThingsList);

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
                                    onClick={this.goToAddImportantThingModal}
                                    buttonText="ADD"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="common-list-page-content">
                        {(() => {
                            if (this.state.loading) {
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
                            {importantThingsListDisplay}
                        </div>
                    </div>
                    {(() => {
                        if (this.state.showAddImportantThingModal) {
                            return (
                                <CreateImportantThingWrapper
                                    cancel={this.closeModals}
                                    afterSuccessfulSave={this.closeModals}
                                />
                            );
                        } else if (this.state.showUpdateImportantThingModal) {
                            return (
                                <UpdateImportantThingWrapper
                                    cancel={this.closeModals}
                                    afterSuccessfulSave={this.closeModals}
                                    importantThingId={this.state.updateImportantThingId}
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
});
