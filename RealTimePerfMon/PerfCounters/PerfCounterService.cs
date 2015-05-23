using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RealTimePerfMon.PerfCounters
{
    public class PerfCounterService
    {
        List<PerCounterHelper> _counters;

        public PerfCounterService()
        {
            _counters = new List<PerCounterHelper>()
            {
                new PerCounterHelper("Processor", "Processor", "% Processor Time", "_Total"),
                new PerCounterHelper("Memory", "Memory", "Available MBytes"),
                new PerCounterHelper("Disk", "PhysicalDisk", "% Disk Time", "_Total")
            };
        }

        public dynamic GetCounters()
        {
            return _counters.Select(c => new { name = c.Name, value = c.Value });
        }
    }
}