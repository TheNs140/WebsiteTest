using Microsoft.AspNetCore.Mvc;
using NCIntegrity.Common.Entities;
using NCIntegrity.Common.Interfaces;
using NCIntegrity.Domain;
using NCIntegrity.Domain.Entities;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LeakRuptureBoundryCalculationController : ControllerBase
    {
        [HttpPost]
        public IEnumerable<LeakRuptureBoundryAnalysisOutput> Post([FromBody] List<LeakRuptureBoundryAnalysisInput> dataList )
        {

            List<LeakRuptureBoundryAnalysisOutput> results = new List<LeakRuptureBoundryAnalysisOutput>();


            {
                // Check if the received data is not null or empty
                if (dataList == null || dataList.Count == 0)
                {
                    // Return an empty list or handle accordingly
                    return results;
                }

                for(int i = 0; i < dataList.Count; i++)
                {
                    results.Add(LeakRuptureBoundryAnalysis.Calculate(dataList[i]));

                }


                // Process each dynamic instance in dataLis

                // Return the list of calculated results
                return results.ToArray();
            }
                
        }
    }
}
