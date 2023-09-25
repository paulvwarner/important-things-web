export let CrossComponentValueManager = (function () {
    function CrossComponentValueManager() {
        this.valueChangeReactionFunctions = [];
    }

    CrossComponentValueManager.prototype.createValueSetter = function () {
        let self = this;
        return (function (value) {
            self.value = value;
            self.valueChangeReactionFunctions.forEach(function (valueChangeReactionFunction) {
                valueChangeReactionFunction(value);
            });
        });
    };

    CrossComponentValueManager.prototype.reactToValueChangeWith = function (valueChangeReactionFunction) {
        if (this.valueChangeReactionFunctions.indexOf(valueChangeReactionFunction) < 0) {
            this.valueChangeReactionFunctions.push(valueChangeReactionFunction);
        }
    };

    return CrossComponentValueManager;
}());
