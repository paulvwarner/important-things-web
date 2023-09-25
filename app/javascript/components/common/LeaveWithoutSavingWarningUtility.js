export let LeaveWithoutSavingWarningUtility = {
    enableWindowOnBeforeUnload: function (message) {
        window.onbeforeunload = function (e) {
            // If we haven't been passed the event, get the window.event
            e = e || window.event;

            // For IE6-8 and Firefox prior to version 4
            if (e) {
                e.returnValue = message;
            }

            // For Chrome, Safari, IE8+ and Opera 12+
            return message;
        };
    },

    disableWindowOnBeforeUnload: function () {
        window.onbeforeunload = null;
    },

    enableLeaveWithoutSavingWarnings: function (context, warningText) {
        context.confirmBeforeNavValueSetter({
            confirmBeforeNav: true,
            warningText: warningText
        });
        this.enableWindowOnBeforeUnload('You have unsaved changes. Are you sure you want to leave this page?')
    },

    disableLeaveWithoutSavingWarnings: function (context) {
        context.confirmBeforeNavValueSetter({
            confirmBeforeNav: false,
            warningText: null
        });
        this.disableWindowOnBeforeUnload();
    }
};
