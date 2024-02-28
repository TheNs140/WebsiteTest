using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using NCIntegrity.Common.Entities;
using webapi.Models;
using NCIntegrity.Domain.Entities;
using NCIntegrity.Common.Entities.Inputs;

namespace webapi.Controllers
{

    [ApiController]
    [Route("[controller]")]


    public class ILIB31GModifiedCriticalDepthController : ControllerBase
    {

        public class B31GCriticalDepthParameters
        {
            public B31GWebsiteInput inputs { get; set; }
            public MetalLossParameterPassing[] data { get; set; }
        }

        [HttpPost]
        public IEnumerable<B31GCriticalDepthOutput> Post([FromBody] B31GCriticalDepthParameters parameters)
        {

            B31GWebsiteInput input = parameters.inputs;
            MetalLossParameterPassing[] allMetalLoss = parameters.data;

            List<B31GInput> dataList = new List<B31GInput>();
            List<B31GCriticalDepthOutput> results = new List<B31GCriticalDepthOutput>();

            for (int i = 0; i < allMetalLoss.Count(); i++)
            {
                dataList.Add(new B31GInput(new Feature(), new MetalLoss(allMetalLoss[i].depth, allMetalLoss[i].length, allMetalLoss[i].width), new Pipe(input.OuterDiameter, allMetalLoss[i].wallThickness, input.YieldStrength), null, input.PressureOfInterest, input.SafetyFactor));
            }

            for (int i = 0; i < allMetalLoss.Count(); i++)
            {
                results.Add(B31GModified.CalculateCriticalDepth(dataList[i]));
            }

            return results.ToArray();
        }



    }
}
