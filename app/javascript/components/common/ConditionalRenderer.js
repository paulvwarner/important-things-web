export let ConditionalRenderer = function (props) {
    if ('if' in props) {
        if (props.if) {
            return props.renderer()
        }
    }

    return null;
};
