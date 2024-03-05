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
using NCIntegrity.Common.Entities.Inputs;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class B31GCriticalDepthCalculationController : ControllerBase
    {
        [HttpPost]
        public IEnumerable<B31GCriticalDepthOutput> Post([FromBody] B31GCriticalDepthWebsiteInput input)
        {

            List < B31GCriticalDepthOutput> results = new List<B31GCriticalDepthOutput>();
            {

                for (int i = 0; i < 500; i++)
                {
                    results.Add(B31GModified.CalculateCriticalDepth(new B31GInput(new Feature(), new MetalLoss( 0 , i , 0), new Pipe(input.OuterDiameter, input.WallThickness, input.YieldStrength), "", input.PressureOfInterest, input.SafetyFactor)));

                }

                return results.ToArray();
            }

        }
    }
}
