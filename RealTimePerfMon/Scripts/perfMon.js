(function myfunction() {

    //SignalR is a jquery plugin so augments $ and gives you a proxy on the client for the Server hub
    var perfMonHub = $.connection.perfMonHub;
    $.connection.hub.logging = true;

    //This call is async and returns a promise that we can hook into from the client
    $.connection.hub.start();

    //now add the newMessage method on the client that was dynamically created in the server
    perfMonHub.client.newMessage = function (message) {
        vm.addMessage(message);
    };

    var ViewModel = function () {
        var self = this;
        self.message = ko.observable(""),
        self.messages = ko.observableArray()
    };

    //create method on my view model to call the server Send method in the Hub.
    ViewModel.prototype = {
        sendMessage: function () {
            var self = this;
            perfMonHub.server.send(self.message());

            //clear out once message is sent
            self.message("");
        },
        addMessage: function (message) {
            var self = this;
            self.messages.push(message);
        }
    }

    //create an instance of the vm
    var vm = new ViewModel();

    //Finally, wire this up when DOM is ready
    $(function () {
        ko.applyBindings(vm);
    });
}());