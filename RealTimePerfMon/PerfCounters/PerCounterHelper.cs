using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace RealTimePerfMon.PerfCounters
{
    public class PerCounterHelper
    {
        PerformanceCounter _counter;

        public string Name { get; set; }

        public float Value 
        {
            get
            {
                return _counter.NextValue();
            }
        }

        public PerCounterHelper(string name, string category, string counter, string instance="")
        {
            //Works with IIS Express, but when deploying to IIS, the account running IIS would need permissions with PerformanceCounter
            _counter = new PerformanceCounter(category, counter, instance, readOnly: true);
            Name = name;
        }
    }
}