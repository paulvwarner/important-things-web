import {useRef} from 'react';
import {Constants} from "../Constants";

// return function that can't get called twice within the debounceTimeoutMs window - set up to work in a function component context
export function useDebouncedFunction(passedFunction) {
    const ignoreFunctionCallRef = useRef(false);

    return function () {
        const ignoreFunctionCall = ignoreFunctionCallRef.current;
        if (!ignoreFunctionCall) {
            ignoreFunctionCallRef.current = true;
            setTimeout(() => {
                ignoreFunctionCallRef.current = false;
            }, Constants.debounceTimeoutMs)
            passedFunction();
        }
    }
}
