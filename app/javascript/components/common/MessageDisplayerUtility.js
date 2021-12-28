// set toastr options for app
toastr.options.closeButton = true;
toastr.options.closeMethod = 'fadeOut';
toastr.options.closeDuration = 300;
toastr.options.closeEasing = 'swing';
toastr.options.positionClass = "toast-bottom-right";

export let MessageDisplayerUtility = {
    error: function (message) {
        toastr.error(message);
    },

    success: function (message) {
        toastr.success(message);
    },
};