import React, {Component} from 'react';
import {withContext} from "../common/GlobalContextConsumerComponent";

export const UsersListPage = withContext(class extends Component {
    render = () => {
        return (
            <div className="common-list-page">
                <div className="common-list-page-content">
                    pvw todo users list
                </div>
            </div>
        );
    };
});
