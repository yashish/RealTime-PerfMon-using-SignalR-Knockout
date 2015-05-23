using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using RealTimePerfMon.PerfCounters;

namespace RealTimePerfMon.Hubs
{
    public class PerfMonHub : Hub
    {
        public PerfMonHub()
        {
            StartCounterCollection();
        }

        private void StartCounterCollection()
        {
            var task = Task.Factory.StartNew(async () =>
            {
                var perfCounterService = new PerfCounterService();
                while (true)
                {
                    var results = perfCounterService.GetCounters();
                    Clients.All.newCounters(results);

                    await Task.Delay(3000);
                }

            }, TaskCreationOptions.LongRunning);

            /* // Alternative using Task.Run(), can pass in a cancellation token but not able to identify it as longrunning process.
            Task.Run(() =>
            {
                var perfCounterService = new PerfCounterService();
                while (true)
                {
                    var counters = perfCounterService.GetCounters();
                    Clients.All.newCounters(counters);
                }
            });
           */
        }

        public void Send(string message)
        {
            //broadcast to all clients. Note that All is a dynamic method
            //SignalR makes this look like an RPC call, but the SignalR library is going to create the newMessage
            //Javascript method client side when it packages this up.
            Clients.All.newMessage(
                "Hi from " + Context.User.Identity .Name + ": " + message
                );
        }
    }
}