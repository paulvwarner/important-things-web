import React, {useContext} from 'react';
import {GlobalContext} from "../admin-frame/AdminFrame";

export const UsersListPage = function (props) {
    const context = useContext(GlobalContext);

    return (
        <div className="common-list-page">
            <div className="common-list-page-content">
                pvw todo users list
            </div>
        </div>
    );
};
