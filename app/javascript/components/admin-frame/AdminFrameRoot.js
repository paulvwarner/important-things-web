import {useEffect} from "react";

export let AdminFrameRoot = function (props) {
    // redirect to default page on mount.
    // this component would be more useful if more roles were supported that had different default pages.
    useEffect(function () {
        goToDefaultPage();
    }, []);

    function goToDefaultPage() {
        window.location.assign('/insights');
    }

    return null;
};
