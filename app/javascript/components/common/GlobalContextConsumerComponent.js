import React from 'react';
import {GlobalContext} from '../admin-frame/AdminFrame';
import {withRouter} from 'react-router-dom';

// HOC to send global context to wrapped component in props
export function withContext(WrappedComponent) {
    class GlobalContextConsumerComponent extends React.Component {
        render = () => {
            var self = this;
            return (
                <GlobalContext.Consumer>
                    {function (context) {
                        return (
                            <WrappedComponent context={context} {...self.props}/>
                        );
                    }}
                </GlobalContext.Consumer>
            );
        }
    }

    return withRouter(GlobalContextConsumerComponent);
}
