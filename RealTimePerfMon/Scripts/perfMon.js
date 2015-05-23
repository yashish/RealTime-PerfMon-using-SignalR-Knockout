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

    perfMonHub.client.newCounters = function (counters) {
        vm.getCounters(counters);
    }

    var ChartEntry = function (counterName) {
        var self = this;
        self.name = counterName; //no need to make this observable as this will never change for each entry
        self.chart = new SmoothieChart({ millisPerPixel: 50, labels: { fontSize: 15 } });
        self.timeSeries = new TimeSeries();
        self.chart.addTimeSeries(self.timeSeries, { lineWidth: 3, strokeStyle: "#00ff00" });
    }
    ChartEntry.prototype = {
        addValue: function (value) {
            var self = this;
            self.timeSeries.append(new Date().getTime(), value); // Note that this is the client timestamp, not the server time (synchronizing with server time will not be simple)
        },

        //start drawing charts after data binding with knockout
        start: function () {
            var self = this;
            self.canvas = document.getElementById(self.name);
            self.chart.streamTo(self.canvas);
        }
    };


    var ViewModel = function () {
        var self = this;
        self.message = ko.observable(""),
        self.messages = ko.observableArray(),
        self.counters = ko.observableArray() //this will be a dictionary of counters to accomodate any number of counters pushed by the server
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
        },
        getCounters: function (updatedCounters) {
            var self = this;
            
            $.each(updatedCounters, function (index, updatedCounter) {
                var entry = ko.utils.arrayFirst(self.counters(), function (counter) {
                    return counter.name === updatedCounter.name;
                });

                if (!entry) {
                    entry = new ChartEntry(updatedCounter.name);
                    self.counters.push(entry);

                    //call start method to draw the chart
                    entry.start();
                }
                //add counter value
                entry.addValue(updatedCounter.value);
            })
        }
    }

    //create an instance of the vm
    var vm = new ViewModel();

    //Finally, wire this up when DOM is ready
    $(function () {
        ko.applyBindings(vm);
    });
}());