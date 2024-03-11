using Microsoft.AspNetCore.Mvc;
using NCIntegrity.Common.Entities;
using NCIntegrity.Common.Interfaces;
using NCIntegrity.Domain;
using NCIntegrity.Domain.Entities;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Text.Json;
using webapi.Models;

namespace webapi.Controllers.Calculations
{
    [ApiController]
    [Route("[controller]")]
    public class LeakRuptureBoundryCalculationController : ControllerBase
    {
        [HttpPost]
        public IEnumerable<LeakRuptureBoundryAnalysisOutput> Post([FromBody] LeakRuptureBoundaryWebsiteInput data)
        {

            List<LeakRuptureBoundryAnalysisOutput> results = new List<LeakRuptureBoundryAnalysisOutput>();


            {

                for (int i = 5; i < 500; i++)
                {
                    results.Add(LeakRuptureBoundryAnalysis.Calculate(new LeakRuptureBoundryAnalysisInput(new Pipe(data.OuterDiameter, data.WallThickness, data.YieldStrength), new MetalLoss(0, i, 0), null, data.FullSizedCVN, data.PressureOfInterest)));

                }

                return results.ToArray();
            }

        }
    }
}
