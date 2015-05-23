using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace RealTimePerfMon.Hubs
{
    public class PerfMonHub : Hub
    {
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