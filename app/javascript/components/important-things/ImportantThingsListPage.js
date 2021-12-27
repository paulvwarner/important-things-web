import React, {Component} from 'react';
import {ApiUtility} from "../common/ApiUtility";
import {PillButton} from "../common/PillButton";
import {OverlayLoadingIndicator} from "../common/OverlayLoadingIndicator";
import {withContext} from "../common/GlobalContextConsumerComponent";

export const ImportantThingsListPage = withContext(class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            importantThingsList: null
        }
    }

    componentDidMount = () => {
        this.loadPageData();
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
                        toastr.error('An error occurred while loading the important things list.');
                    });
            }
        );
    };

    goToAddImportantThingModal = () => {
        this.props.context.navigator.navigateTo('/important-things/add');
    };

    renderImportantThingsListDisplay = (importantThingsList) => {
        var importantThingsListDisplay = [];

        for (var i = 0; i < importantThingsList.length; i++) {
            var importantThing = importantThingsList[i];

            importantThingsListDisplay.push(
                <div
                    key={i + 1}
                    className="common-list-row common-list-values-row"
                >
                    <div
                        className="common-list-row-cell common-list-row-value-cell important-things-list-row-cell message"
                    >{importantThing.message}</div>
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


                            </div>
                        </div>
                        <div className="common-list-content">
                            {importantThingsListDisplay}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <OverlayLoadingIndicator/>
            );
        }
    };
});
